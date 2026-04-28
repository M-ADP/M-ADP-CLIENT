'use client';

import { useEffect, Suspense, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthCodeMutation } from '@/services/login/login.mutation';
import { useAuthStore } from '@/store/authStore';
import { identifyClarity } from '@/utils/clarity';
import Cookies from 'js-cookie';
import * as S from './style';

type CallbackError =
    | { kind: 'school_account' }
    | { kind: 'oauth_denied'; detail?: string }
    | { kind: 'missing_code' }
    | { kind: 'auth_failed'; detail?: string };

function AuthCallbackContent() {
    const router = useRouter();
    const setStep = useAuthStore((state) => state.setStep);
    const authCodeMutation = useAuthCodeMutation();
    const [error, setError] = useState<CallbackError | null>(null);
    const hasFetched = useRef(false);

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        const hash = window.location.hash;

        const errorMatch = hash.match(/#error=([^&]+)/);
        if (errorMatch) {
            setError({ kind: 'oauth_denied', detail: decodeURIComponent(errorMatch[1]) });
            return;
        }

        const codeMatch = hash.match(/#code=(.+)/);
        const code = codeMatch ? codeMatch[1] : null;

        if (!code) {
            setError({ kind: 'missing_code' });
            return;
        }

        const processAuth = async () => {
            try {
                const response = await authCodeMutation.mutateAsync({ code });

                if (response.access_token) {
                    Cookies.set('token', response.access_token, { path: '/' });
                    identifyClarity(response.access_token);

                    const isAuthenticated = response.is_authenticated === 'true';

                    if (!isAuthenticated) {
                        setStep('github');
                        router.replace('/login');
                    } else {
                        router.replace('/');
                    }
                } else {
                    setError({ kind: 'auth_failed' });
                }
            } catch (err) {
                const message = err instanceof Error ? err.message : '';
                const isSchoolAccountError = /school|학교|domain|허용되지|허용된/i.test(message);
                if (isSchoolAccountError) {
                    setError({ kind: 'school_account' });
                } else {
                    setError({ kind: 'auth_failed', detail: message || undefined });
                }
            }
        };

        processAuth();
    }, []);

    if (error) {
        return <ErrorView error={error} onRetry={() => router.replace('/login')} />;
    }

    return (
        <S.Container>
            <S.LoaderWrap>
                <S.Loader />
                <S.LoaderCaption>로그인 처리 중...</S.LoaderCaption>
            </S.LoaderWrap>
        </S.Container>
    );
}

const ERROR_COPY: Record<CallbackError['kind'], { title: string; description: string; hint?: string }> = {
    school_account: {
        title: '학교 계정으로 로그인해 주세요',
        description: 'M-ADP는 부산소프트웨어마이스터고등학교 구성원만 사용할 수 있어요.',
        hint: '@bssm.hs.kr 계정으로 다시 시도해 주세요.',
    },
    oauth_denied: {
        title: '구글 로그인이 취소되었어요',
        description: '구글 계정 선택 화면에서 로그인을 완료해야 진행할 수 있습니다.',
    },
    missing_code: {
        title: '인증 정보를 찾을 수 없어요',
        description: '로그인 페이지에서 다시 시도해 주세요.',
    },
    auth_failed: {
        title: '로그인에 실패했어요',
        description: '잠시 후 다시 시도해 주세요. 문제가 계속되면 관리자에게 문의해 주세요.',
    },
};

function ErrorView({ error, onRetry }: { error: CallbackError; onRetry: () => void }) {
    const copy = ERROR_COPY[error.kind];
    const detail = 'detail' in error ? error.detail : undefined;

    return (
        <S.Container>
            <S.Card>
                <S.Brand>
                    <Image src="/assets/logo.svg" alt="M-ADP" width={40} height={40} />
                    <S.BrandName>M-ADP</S.BrandName>
                </S.Brand>

                <S.IconBadge $variant={error.kind === 'school_account' ? 'warning' : 'error'}>
                    {error.kind === 'school_account' ? '🎓' : '⚠️'}
                </S.IconBadge>

                <S.Title>{copy.title}</S.Title>
                <S.Description>{copy.description}</S.Description>
                {copy.hint && <S.Hint>{copy.hint}</S.Hint>}

                {detail && (
                    <S.DetailBox>
                        <S.DetailLabel>오류 상세</S.DetailLabel>
                        <S.DetailText>{detail}</S.DetailText>
                    </S.DetailBox>
                )}

                <S.Actions>
                    <S.PrimaryButton type="button" onClick={onRetry}>
                        다시 로그인하기
                    </S.PrimaryButton>
                    <S.SecondaryButton
                        type="button"
                        onClick={() => router.push('/support')}
                    >
                        도움말 보기
                    </S.SecondaryButton>
                </S.Actions>
            </S.Card>
        </S.Container>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={
            <S.Container>
                <S.LoaderWrap>
                    <S.Loader />
                    <S.LoaderCaption>로그인 처리 중...</S.LoaderCaption>
                </S.LoaderWrap>
            </S.Container>
        }>
            <AuthCallbackContent />
        </Suspense>
    );
}
