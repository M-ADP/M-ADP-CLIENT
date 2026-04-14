import Image from 'next/image';
import { colors } from '@/styles/colors';
import * as S from './style';
import { ConversationMessage } from '@/types/chatops';

interface ChatSectionProps {
  messages: ConversationMessage[];
  streamingText: string;
  isStreaming: boolean;
  activeSessionId: number;
  onApprove: (requestId: number) => void;
  onReject: (requestId: number) => void;
}

export default function ChatSection({
  messages,
  streamingText,
  isStreaming,
  onApprove,
  onReject,
}: ChatSectionProps) {
  return (
    <S.ChatArea>
      {messages.map((message) => {
        if (message.role === 'user') {
          return (
            <S.MessageRow key={message.message_id}>
              <S.Avatar color={colors.primary.default}>N</S.Avatar>
              <S.UserMessageCard>{message.text}</S.UserMessageCard>
            </S.MessageRow>
          );
        }

        if (message.role === 'assistant') {
          if (message.type === 'text') {
            return (
              <S.MessageRow key={message.message_id}>
                <S.Avatar>
                  <Image src="/assets/logo.svg" alt="AI Avatar" width={24} height={24} />
                </S.Avatar>
                <S.AIMessageCard>{message.text}</S.AIMessageCard>
              </S.MessageRow>
            );
          }

          if (message.type === 'task' && message.task) {
            const task = message.task;
            return (
              <S.MessageRow key={message.message_id}>
                <S.Avatar>
                  <Image src="/assets/logo.svg" alt="AI Avatar" width={24} height={24} />
                </S.Avatar>
                <S.TaskCard>
                  <S.TaskCardHeader>
                    <S.TaskCardTitle>{task.title}</S.TaskCardTitle>
                    {task.risk_level && (
                      <S.Badge level={task.risk_level.toLowerCase()}>{task.risk_level}</S.Badge>
                    )}
                  </S.TaskCardHeader>
                  <S.TaskCardSummary>{task.summary}</S.TaskCardSummary>
                  
                  {task.status === 'completed' ? (
                    <S.TaskStatusText status="completed">완료</S.TaskStatusText>
                  ) : task.status === 'rejected' ? (
                    <S.TaskStatusText status="rejected">취소됨</S.TaskStatusText>
                  ) : (
                    <S.TaskCardActions>
                      {task.next_actions?.map((action) => {
                        if (action === 'approve') {
                          return (
                            <S.ActionButton
                              key={action}
                              variant="primary"
                              onClick={() => {
                                if (message.request_id) onApprove(message.request_id);
                              }}
                            >
                              승인
                            </S.ActionButton>
                          );
                        }
                        if (action === 'cancel') {
                          return (
                            <S.ActionButton
                              key={action}
                              variant="danger"
                              onClick={() => {
                                if (message.request_id) onReject(message.request_id);
                              }}
                            >
                              거절
                            </S.ActionButton>
                          );
                        }
                        if (action === 'retry') {
                          return (
                            <S.ActionButton key={action} variant="secondary" disabled>
                              재시도
                            </S.ActionButton>
                          );
                        }
                        if (action === 'view_result') {
                          return (
                            <S.ActionButton key={action} variant="secondary" disabled>
                              결과 보기
                            </S.ActionButton>
                          );
                        }
                        return null;
                      })}
                    </S.TaskCardActions>
                  )}
                </S.TaskCard>
              </S.MessageRow>
            );
          }
        }
        return null;
      })}

      {isStreaming && (
        <S.MessageRow>
          <S.Avatar>
            <Image src="/assets/logo.svg" alt="AI Avatar" width={24} height={24} />
          </S.Avatar>
          <S.AIMessageCard>{streamingText || '...'}</S.AIMessageCard>
        </S.MessageRow>
      )}
    </S.ChatArea>
  );
}
