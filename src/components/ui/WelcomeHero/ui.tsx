import React from 'react';
import * as S from './style';
import { normalizeDisplayName } from '@/utils/userDisplay';

interface WelcomeHeroProps {
  userName: string;
}

export const WelcomeHero: React.FC<WelcomeHeroProps> = ({ userName }) => {
  const normalizedUserName = normalizeDisplayName(userName);

  return (
    <S.HeroContainer>
      <S.BackgroundImage />

      <S.ContentWrapper>
        <S.GreetingSub>환영합니다!</S.GreetingSub>
        <S.GreetingMain>
          <S.GreetingName title={normalizedUserName}>{normalizedUserName}</S.GreetingName>
          <S.GreetingSuffix>님!</S.GreetingSuffix>
        </S.GreetingMain>
        <S.QuestionText>무엇을 원하시나요?</S.QuestionText>
      </S.ContentWrapper>

      <S.ProfileLink>
        프로필로 가기 <span>→</span>
      </S.ProfileLink>
    </S.HeroContainer>
  );
};
