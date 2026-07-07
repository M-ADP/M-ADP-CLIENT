import { Fragment } from 'react';
import Image from 'next/image';
import * as S from './style';
import { ConversationMessage, TaskSnapshot, SSEEventRecord } from '@/types/chatops';
import ThinkingPanel from '@/components/ui/Agent/ThinkingPanel/ui';
import MarkdownMessage from './MarkdownMessage';
import TaskMessage from './TaskMessage';
import { useChatScroll } from '@/hooks/chatops/useChatScroll';

interface ChatSectionProps {
  messages: ConversationMessage[];
  isThinking: boolean;
  currentTask: TaskSnapshot | null;
  isApprovalPending: boolean;
  supersededBy: string | null;
  sseEventLog: SSEEventRecord[];
  activeRequestId: string | null;
  scrollToLatestToken: number;
  onEditTask: (requestId: string) => void;
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
}

/** task 카드에서 실제로 사용할 task를 결정한다: SSE live task > message.task */
function resolveTask(
  messageTask: TaskSnapshot | null,
  messageRequestId: string | null,
  liveTask: TaskSnapshot | null,
  pendingRequestId: string | null
): TaskSnapshot | null {
  if (liveTask && pendingRequestId && messageRequestId === pendingRequestId) {
    return liveTask;
  }
  return messageTask;
}

export default function ChatSection({
  messages,
  isThinking,
  currentTask,
  isApprovalPending,
  supersededBy,
  sseEventLog,
  activeRequestId,
  scrollToLatestToken,
  onEditTask,
  onApprove,
  onReject,
}: ChatSectionProps) {
  const pendingRequestId = messages
    .filter((m) => m.request_id !== null)
    .at(-1)?.request_id ?? null;
  const thinkingRequestId = sseEventLog.at(-1)?.event.request_id ?? null;
  const latestMessage = messages.at(-1);
  const latestMessageId = latestMessage?.message_id ?? null;
  const latestMessageText = latestMessage?.text;
  const latestUserMessageId = messages.filter((m) => m.role === 'user').at(-1)?.message_id ?? null;

  const { scrollRef, latestMessageRef, lastUserMsgRef, spacerHeight } = useChatScroll({
    latestMessageId,
    latestMessageText,
    latestUserMessageId,
    scrollToLatestToken,
  });

  return (
    <S.ChatArea ref={scrollRef}>
      {messages.map((message) => {
        if (message.role === 'user') {
          return (
            <S.UserMessageRow
              key={message.message_id}
              ref={message.message_id === latestUserMessageId ? lastUserMsgRef : null}
            >
              <S.UserMessageCard>{message.text}</S.UserMessageCard>
            </S.UserMessageRow>
          );
        }

        if (message.role === 'assistant') {
          const isLivePlaceholder = message.message_id.startsWith('sse-live-');
          const shouldShowThinking =
            (isLivePlaceholder && isThinking) ||
            (
              message.request_id !== null &&
              thinkingRequestId !== null &&
              message.request_id === thinkingRequestId &&
              (isThinking || sseEventLog.length > 0)
            );
          const thinkingRow = shouldShowThinking ? (
            <S.ThinkingRow>
              <S.ThinkingOffset />
              <S.ThinkingPanelWrap>
                <ThinkingPanel events={sseEventLog} isLive={isThinking} />
              </S.ThinkingPanelWrap>
            </S.ThinkingRow>
          ) : null;

          if (message.type === 'text') {
            if (!message.text) {
              return thinkingRow ? <Fragment key={message.message_id}>{thinkingRow}</Fragment> : null;
            }

            return (
              <Fragment key={message.message_id}>
                {thinkingRow}
                <S.MessageRow ref={message.message_id === latestMessageId ? latestMessageRef : null}>
                  <S.Avatar>
                    <Image src="/assets/logo.svg" alt="AI Avatar" width={24} height={24} />
                  </S.Avatar>
                  <S.AIMessageCard>
                    <MarkdownMessage>{message.text}</MarkdownMessage>
                  </S.AIMessageCard>
                </S.MessageRow>
              </Fragment>
            );
          }

          if (message.type === 'task') {
            const task = resolveTask(message.task, message.request_id, currentTask, pendingRequestId);
            if (!task) {
              return thinkingRow ? <Fragment key={message.message_id}>{thinkingRow}</Fragment> : null;
            }
            const isSuperseded = supersededBy !== null && message.request_id !== null;

            return (
              <Fragment key={message.message_id}>
                {thinkingRow}
                <TaskMessage
                  ref={message.message_id === latestMessageId ? latestMessageRef : null}
                  task={task}
                  requestId={message.request_id}
                  activeRequestId={activeRequestId}
                  isApprovalPending={isApprovalPending}
                  isSuperseded={isSuperseded}
                  onApprove={onApprove}
                  onReject={onReject}
                  onEditTask={onEditTask}
                />
              </Fragment>
            );
          }
        }
        return null;
      })}
      <S.ScrollSpacer style={{ height: `${spacerHeight}px` }} />
    </S.ChatArea>
  );
}
