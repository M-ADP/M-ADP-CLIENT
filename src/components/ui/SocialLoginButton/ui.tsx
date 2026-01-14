'use client';

import Image from 'next/image';
import * as S from './style';
import type { SocialLoginButtonProps } from '@/types/socialLoginButton';

const providerConfig = {
  google: {
    icon: '/icons/google.svg',
    text: 'Google로 로그인',
  },
  github: {
    icon: '/icons/github.svg',
    text: 'Github로 로그인',
  },
};

export default function SocialLoginButton({
  provider,
  onClick,
  className,
}: SocialLoginButtonProps) {
  const config = providerConfig[provider];

  return (
    <S.SocialLoginButtonWrapper onClick={onClick} className={className}>
      <S.IconWrapper>
        <Image src={config.icon} alt={`${provider} icon`} width={48} height={48} />
      </S.IconWrapper>
      <S.ButtonText>{config.text}</S.ButtonText>
    </S.SocialLoginButtonWrapper>
  );
}
