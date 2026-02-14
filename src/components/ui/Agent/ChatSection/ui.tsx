import Image from 'next/image';
import { colors } from '@/styles/colors';
import * as S from './style';

interface ChatSectionProps {
  userMessage: string;
  streamedText: string;
}

export default function ChatSection({ userMessage, streamedText }: ChatSectionProps) {
  return (
    <S.ChatArea>
      <S.MessageRow>
        <S.Avatar color={colors.primary.default}>
          N
        </S.Avatar>
        <S.UserMessageCard>
          {userMessage}
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
  );
}
