'use client';

import { useEffect, Suspense, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useGoogleAuthMutation } from '@/services/login/login.mutation';
import { useAuthStore } from '@/store/authStore';
import { jwtDecode } from 'jwt-decode';
import * as S from './style';

interface DecodedToken {
    role?: string;
}

function AuthCallbackContent() {
    const router = useRouter();
    const setStep = useAuthStore((state) => state.setStep);
    const googleAuthMutation = useGoogleAuthMutation();
    const [pageError, setPageError] = useState(false);
    const hasFetched = useRef(false);

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        const hash = window.location.hash;

        const errorMatch = hash.match(/#error=(.+)/);
        if (errorMatch) {
            router.replace('/login');
            return;
        }

        const codeMatch = hash.match(/#code=(.+)/);
        const code = codeMatch ? codeMatch[1] : null;

        if (!code) {
            console.error('인가 코드가 없습니다. 현재 경로:', window.location.href);
            setPageError(true);
            return;
        }

        const processAuth = async () => {
            try {
                const response = await googleAuthMutation.mutateAsync({ code });

                if (response.access_token) {
                    localStorage.setItem('token', response.access_token);

                    const decoded = jwtDecode<DecodedToken>(response.access_token);
                    const role = decoded.role;

                    if (role === 'PARTIAL_AUTH') {
                        setStep('github');
                        router.replace('/login');
                    } else {
                        router.replace('/');
                    }
                } else {
                    router.replace('/');
                }
            } catch (error) {
                console.error('인증 처리 중 에러가 발생했습니다:', error);
                setPageError(true);
            }
        };

        processAuth();
    }, []);

    if (pageError) {
        return (
            <S.Container>
                <S.ErrorText>인증에 실패했습니다. 다시 로그인해주세요.</S.ErrorText>
            </S.Container>
        );
    }

    return (
        <S.Container>
            <S.Loader />
        </S.Container>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={
            <S.Container>
                <S.Loader />
            </S.Container>
        }>
            <AuthCallbackContent />
        </Suspense>
    );
}
