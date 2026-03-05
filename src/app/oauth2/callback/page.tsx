'use client';

import { useEffect, Suspense, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useGoogleAuthMutation } from '@/services/login/login.mutation';
import { useAuthStore } from '@/store/authStore';

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
            alert('해당 계정으로 로그인을 할 수 없습니다.');
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
                    setStep('github');
                }

                router.replace('/login');
            } catch (error) {
                console.error('인증 처리 중 에러가 발생했습니다:', error);
                alert('로그인 처리 중 오류가 발생했습니다.');
                setPageError(true);
            }
        };

        processAuth();
    }, []);

    if (pageError) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.2rem' }}>
                인증에 실패했습니다. 다시 로그인해주세요.
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.2rem' }}>
            인증 정보를 처리 중입니다... 잠시만 기다려주세요.
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.2rem' }}>
                로딩 중...
            </div>
        }>
            <AuthCallbackContent />
        </Suspense>
    );
}
