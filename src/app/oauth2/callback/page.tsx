'use client';

import { useEffect, Suspense, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthCodeMutation } from '@/services/login/login.mutation';
import { useAuthStore } from '@/store/authStore';
import { identifyClarity } from '@/utils/clarity';
import Cookies from 'js-cookie';
import * as S from './style';

function AuthCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const setStep = useAuthStore((state) => state.setStep);
    const authCodeMutation = useAuthCodeMutation();
    const [pageError, setPageError] = useState(false);
    const hasFetched = useRef(false);
    const nextPath =
        searchParams.get('next') ||
        (typeof window !== 'undefined' ? window.sessionStorage.getItem('post_login_redirect') : null) ||
        '/';

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
            queueMicrotask(() => setPageError(true));
            return;
        }

        const processAuth = async () => {
            try {
                const response = await authCodeMutation.mutateAsync({ code });

                if (response.access_token) {
                    Cookies.set('token', response.access_token, { path: '/' });

                    identifyClarity(response.access_token);

                    // is_authenticated가 'true' 문자열인 경우만 참으로 인정
                    const isAuthenticated = response.is_authenticated === 'true';

                    if (!isAuthenticated) {
                        setStep('github');
                        router.replace(`/login?next=${encodeURIComponent(nextPath)}`);
                    } else {
                        if (typeof window !== 'undefined') {
                            window.sessionStorage.removeItem('post_login_redirect');
                        }
                        router.replace(nextPath);
                    }
                } else {
                    if (typeof window !== 'undefined') {
                        window.sessionStorage.removeItem('post_login_redirect');
                    }
                    router.replace(nextPath);
                }
            } catch (error) {
                console.error('인증 처리 중 에러가 발생했습니다:', error);
                setPageError(true);
            }
        };

        processAuth();
    }, [authCodeMutation, nextPath, router, searchParams, setStep]);

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
