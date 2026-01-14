'use client';

import Image from 'next/image';
import * as S from './style';
import SocialLoginButton from '@/components/ui/SocialLoginButton/ui';

export default function LoginContainer() {
  const handleGoogleLogin = () => {
    console.log('Google login clicked');
  };

  return (
    <S.LoginWrapper>
      <S.LoginContent>
        <S.LogoSection>
          <S.LogoImage>
            <Image src="/assets/logo.svg" alt="MADP Logo" fill />
          </S.LogoImage>
          <S.LogoText>MADP</S.LogoText>
        </S.LogoSection>
        <S.ButtonWrapper>
            <SocialLoginButton provider="google" onClick={handleGoogleLogin} />
            <SocialLoginButton provider="github" onClick={handleGoogleLogin} />
        </S.ButtonWrapper>
      </S.LoginContent>
    </S.LoginWrapper>
  );
}
