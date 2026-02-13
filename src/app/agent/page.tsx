'use client';

import Image from 'next/image';
import * as S from './style';

export default function AgentPage() {
  return (
    <S.Container>
      <S.LogoSection>
        <Image
          src="/assets/logo.svg"
          alt="M-ADP Logo"
          width={100}
          height={92}
          priority
        />
        <S.LogoTitle>M-ADP</S.LogoTitle>
      </S.LogoSection>

      <S.SearchContainer>
        <S.InputWrapper>
          <S.IconCircle>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4L14.4 9.6L20 12L14.4 14.4L12 20L9.6 14.4L4 12L9.6 9.6L12 4Z" fill="#969696" />
            </svg>
          </S.IconCircle>
          <S.SearchInput placeholder="무엇을 원하시나요?" />
        </S.InputWrapper>

        <S.IconCircle className="send-button">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 19V5M12 5L5 12M12 5L19 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </S.IconCircle>
      </S.SearchContainer>
    </S.Container>
  );
}
