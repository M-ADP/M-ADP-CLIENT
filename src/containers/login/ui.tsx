'use client';

import Image from 'next/image';
import * as S from './style';
import SocialLoginButton from '@/components/ui/SocialLoginButton/ui';
import { useAuthStore } from '@/store/authStore';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Suspense } from 'react';

interface AuthTokenPayload {
  exp: number;
  role?: string;
}

export default function LoginContainer() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <LoginContainerInner />
    </Suspense>
  );
}

function LoginContainerInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { step } = useAuthStore();
  const token = Cookies.get('token');
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const nextPath = searchParams.get('next') || '/';

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<AuthTokenPayload>(token);
        const isExpired = decoded.exp * 1000 < Date.now();
        if (!isExpired) {
          // PARTIAL_AUTH이면 깃허브 연동이 필요한 상태이므로 홈으로 보내지 않음
          if (decoded.role !== 'PARTIAL_AUTH') {
            router.replace(nextPath);
          }
        }
      } catch {
        // Invalid token format
      }
    }
  }, [nextPath, token, router]);

  const handleGoogleLogin = () => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('post_login_redirect', nextPath);
    }
    window.location.href = `${baseUrl}/auth/oauth2/authorization/google`;
  };

  const handleGithubLogin = async () => {
    try {
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem('post_login_redirect', nextPath);
      }
      const response = await fetch(`/api/auth/github`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('백엔드 응답 디버깅:', data);
        if (data.backendBody && data.backendBody.includes('Jwt is not in the form')) {
          alert('저장된 토큰 형식이 잘못되었습니다. (JWT 형태 아님) - 백엔드 거부');
        } else {
          alert(`서버 에러(${data.backendStatus}): ${data.backendBody}`);
        }
        return;
      }

      if (data && data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Github 연동 리다이렉션 요청 실패:', error);
      alert('깃허브 연동 페이지로 이동하는 데 실패했습니다.');
    }
  };

  return (
    <S.LoginWrapper>
      <S.LoginContent>
        {step === 'google' ? (
          <>
            <S.LogoSection>
              <S.LogoImage>
                <Image src="/assets/logo.svg" alt="MADP Logo" fill />
              </S.LogoImage>
              <S.LogoText>MADP</S.LogoText>
            </S.LogoSection>

            <S.ButtonWrapper>
              <SocialLoginButton provider="google" onClick={handleGoogleLogin} />
            </S.ButtonWrapper>
          </>
        ) : (
          <>
            <S.LogoSection>
              <S.LogoImage>
                <Image src="/icons/github.svg" alt="Github Logo" fill style={{ objectFit: 'contain' }} />
              </S.LogoImage>
              <S.LogoText>Github</S.LogoText>
            </S.LogoSection>

            <S.GuideText>원활한 사용을 위해 깃허브 연결을 진행해주세요.</S.GuideText>

            <S.ButtonWrapper>
              <SocialLoginButton provider="github" onClick={handleGithubLogin} />
            </S.ButtonWrapper>
          </>
        )}
      </S.LoginContent>
    </S.LoginWrapper>
  );
}
