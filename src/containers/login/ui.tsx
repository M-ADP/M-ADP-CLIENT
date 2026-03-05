'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import * as S from './style';
import SocialLoginButton from '@/components/ui/SocialLoginButton/ui';
import { useAuthStore } from '@/store/authStore';

import { Suspense } from 'react';

export default function LoginContainer() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <LoginContainerInner />
    </Suspense>
  );
}

function LoginContainerInner() {
  const { step } = useAuthStore();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleGoogleLogin = () => {
    window.location.href = `${baseUrl}/auth/oauth2/authorization/google`;
  };

  const handleGithubLogin = async () => {
    try {
      const token = localStorage.getItem('token');

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
