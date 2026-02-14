'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import * as S from './style';

const USER_MESSAGE = "최애의 사인 프로젝트의 CPU 사용량을 알고 싶어";
const AI_MESSAGE = "좋습니다, 다음은 최애의 사인 프로젝트의 CPU 사용량 입니다.";

export default function AgentPage() {
  const [isChatStarted, setIsChatStarted] = useState(false);
  const [streamedText, setStreamedText] = useState("");
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (isChatStarted) {
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex <= AI_MESSAGE.length) {
          setStreamedText(AI_MESSAGE.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, 50);

      return () => clearInterval(interval);
    }
  }, [isChatStarted]);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!isChatStarted) {
      setIsChatStarted(true);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <S.Container isChat={isChatStarted}>
      {!isChatStarted && (
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
      )}

      {isChatStarted && (
        <S.ChatArea>
          <S.MessageRow>
            <S.Avatar>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </S.Avatar>
            <S.UserMessageCard>
              {USER_MESSAGE}
            </S.UserMessageCard>
          </S.MessageRow>

          <S.MessageRow>
            <S.Avatar>
              <Image
                src="/assets/logo.svg"
                alt="AI Avatar"
                width={24}
                height={24}
              />
            </S.Avatar>
            <S.AIMessageCard>
              {streamedText}
            </S.AIMessageCard>
          </S.MessageRow>
        </S.ChatArea>
      )}

      <S.SearchContainer>
        <S.InputWrapper>
          <S.IconCircle>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4L14.4 9.6L20 12L14.4 14.4L12 20L9.6 14.4L4 12L9.6 9.6L12 4Z" fill="#969696" />
            </svg>
          </S.IconCircle>
          <S.SearchInput
            placeholder="무엇을 원하시나요?"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </S.InputWrapper>

        <S.IconCircle className="send-button" onClick={handleSearch}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 19V5M12 5L5 12M12 5L19 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </S.IconCircle>
      </S.SearchContainer>
    </S.Container>
  );
}
