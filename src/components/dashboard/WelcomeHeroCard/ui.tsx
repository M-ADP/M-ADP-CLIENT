import React from 'react';
import * as S from './style';

interface WelcomeHeroCardProps {
  userName: string;
}

export const WelcomeHeroCard: React.FC<WelcomeHeroCardProps> = ({ userName }) => {
  return (
    <S.HeroContainer>
      <S.BackgroundImage />

      <S.ContentWrapper>
        <S.GreetingSub>환영합니다!</S.GreetingSub>
        <S.GreetingMain>{userName}님!</S.GreetingMain>
        <S.QuestionText>무엇을 원하시나요?</S.QuestionText>
      </S.ContentWrapper>

      <S.ProfileLink>
        프로필로 가기 <span>→</span>
      </S.ProfileLink>
    </S.HeroContainer>
  );
};
