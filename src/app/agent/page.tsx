'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import * as S from './style';
import ChatSection from '@/components/ui/Agent/ChatSection/ui';
import SearchSection from '@/components/ui/Agent/SearchSection/ui';

// 현재 특별한 백엔드 개발 진행이 없어 멋대로 고정된 입출력을 사용함
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
    if (!inputValue.trim()) return;
    if (!isChatStarted) {
      setIsChatStarted(true);
    }
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
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
        <ChatSection
          userMessage={USER_MESSAGE}
          streamedText={streamedText}
        />
      )}

      <SearchSection
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSearch={handleSearch}
        handleKeyDown={handleKeyDown}
      />
    </S.Container>
  );
}
