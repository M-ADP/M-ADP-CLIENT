import { Fragment, ReactNode } from 'react';
import Image from 'next/image';
import { useCallback, useEffect, useRef } from 'react';
import * as S from './style';
import { ConversationMessage, TaskSnapshot, SSEEventRecord } from '@/types/chatops';
import ThinkingPanel from '@/components/ui/Agent/ThinkingPanel/ui';

const FIELD_LABELS: Record<string, string> = {
  name: '프로젝트 이름',
  project_name: '프로젝트 이름',
  application_name: '애플리케이션 이름',
  cpu: 'CPU',
  max_cpu: '최대 CPU',
  memory: '메모리',
  max_memory: '최대 메모리',
  disk: '디스크',
  max_disk: '최대 디스크',
};

function toFieldLabel(key: string) {
  return FIELD_LABELS[key] || key.replace(/_/g, ' ');
}

function renderInlineMarkdown(text: string): ReactNode[] {
  const tokens = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).filter(Boolean);

  return tokens.map((token, index) => {
    if (token.startsWith('**') && token.endsWith('**')) {
      return <strong key={`${token}-${index}`}>{token.slice(2, -2)}</strong>;
    }

    if (token.startsWith('`') && token.endsWith('`')) {
      return <S.InlineCode key={`${token}-${index}`}>{token.slice(1, -1)}</S.InlineCode>;
    }

    return <Fragment key={`${token}-${index}`}>{token}</Fragment>;
  });
}

function renderParagraph(text: string, key: string) {
  const lines = text.split('\n');

  return (
    <S.MarkdownParagraph key={key}>
      {lines.map((line, index) => (
        <Fragment key={`${key}-${index}`}>
          {index > 0 && <br />}
          {renderInlineMarkdown(line)}
        </Fragment>
      ))}
    </S.MarkdownParagraph>
  );
}

function renderMarkdown(text: string): ReactNode[] {
  const segments = text.split(/```([\s\S]*?)```/g);

  return segments.flatMap((segment, segmentIndex) => {
    if (segmentIndex % 2 === 1) {
      const codeText = segment.replace(/^\n+|\n+$/g, '');
      return (
        <S.CodeBlock key={`code-${segmentIndex}`}>
          <code>{codeText}</code>
        </S.CodeBlock>
      );
    }

    return segment
      .split(/\n{2,}/)
      .map((block) => block.trim())
      .filter(Boolean)
      .map((block, blockIndex) => {
        const orderedLines = block.match(/^\d+\.\s+.+(?:\n\d+\.\s+.+)*$/);
        if (orderedLines) {
          const items = block.split('\n').map((line) => line.replace(/^\d+\.\s+/, ''));
          return (
            <S.MarkdownOrderedList key={`ol-${segmentIndex}-${blockIndex}`}>
              {items.map((item, itemIndex) => (
                <li key={`ol-item-${itemIndex}`}>{renderInlineMarkdown(item)}</li>
              ))}
            </S.MarkdownOrderedList>
          );
        }

        const unorderedLines = block.match(/^[-*]\s+.+(?:\n[-*]\s+.+)*$/);
        if (unorderedLines) {
          const items = block.split('\n').map((line) => line.replace(/^[-*]\s+/, ''));
          return (
            <S.MarkdownUnorderedList key={`ul-${segmentIndex}-${blockIndex}`}>
              {items.map((item, itemIndex) => (
                <li key={`ul-item-${itemIndex}`}>{renderInlineMarkdown(item)}</li>
              ))}
            </S.MarkdownUnorderedList>
          );
        }

        return renderParagraph(block, `p-${segmentIndex}-${blockIndex}`);
      });
  });
}

interface ChatSectionProps {
  messages: ConversationMessage[];
  isThinking: boolean;
  // SSE 계약 추가 상태
  currentTask: TaskSnapshot | null;
  isApprovalPending: boolean;
  supersededBy: number | null;
  sseEventLog: SSEEventRecord[];
  activeRequestId: number | null;
  scrollToLatestToken: number;
  onEditTask: (requestId: number) => void;
  onApprove: (requestId: number) => void;
  onReject: (requestId: number) => void;
}

/** task 카드에서 실제로 사용할 task를 결정한다: SSE live task > message.task */
function resolveTask(
  messageTask: TaskSnapshot | null,
  messageRequestId: number | null,
  liveTask: TaskSnapshot | null,
  pendingRequestId: number | null
): TaskSnapshot | null {
  // 같은 request에 대한 live task가 있으면 우선
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const latestUserMessageRef = useRef<HTMLDivElement>(null);

  const pendingRequestId = messages
    .filter((m) => m.request_id !== null)
    .at(-1)?.request_id ?? null;
  const thinkingRequestId = sseEventLog.at(-1)?.event.request_id ?? null;
  const latestUserMessageId = [...messages].reverse().find((message) => message.role === 'user')?.message_id ?? null;
  const scrollLatestTurnIntoView = useCallback((behavior: ScrollBehavior) => {
    latestUserMessageRef.current?.scrollIntoView({
      behavior,
      block: 'start',
      inline: 'nearest',
    });
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      scrollLatestTurnIntoView('smooth');
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [scrollToLatestToken, scrollLatestTurnIntoView]);

  return (
    <S.ChatArea ref={scrollRef}>
      {messages.map((message) => {
        if (message.role === 'user') {
            return (
              <S.UserMessageRow
                key={message.message_id}
                ref={message.message_id === latestUserMessageId ? latestUserMessageRef : null}
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
                <S.MessageRow>
                  <S.Avatar>
                    <Image src="/assets/logo.svg" alt="AI Avatar" width={24} height={24} />
                  </S.Avatar>
                  <S.AIMessageCard>{renderMarkdown(message.text)}</S.AIMessageCard>
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
            const isTerminal = ['completed', 'failed', 'cancelled', 'expired'].includes(task.approval_state);
            const disableActions = isSuperseded || isTerminal || isApprovalPending;

            return (
              <Fragment key={message.message_id}>
                {thinkingRow}
                <S.MessageRow>
                  <S.Avatar>
                    <Image src="/assets/logo.svg" alt="AI Avatar" width={24} height={24} />
                  </S.Avatar>
                  <S.TaskCard>
                    <S.TaskCardHeader>
                      <S.TaskCardTitle>{task.title}</S.TaskCardTitle>
                    </S.TaskCardHeader>
                    <S.TaskCardSummary>{task.summary}</S.TaskCardSummary>

                    {/* filled_inputs 확인 패널 */}
                    {task.filled_inputs && Object.keys(task.filled_inputs).length > 0 && (
                      <S.FilledInputs>
                        {Object.entries(task.filled_inputs).map(([key, value]) => (
                          <S.FilledInputRow key={key}>
                            <S.FilledInputLabel>{toFieldLabel(key)}</S.FilledInputLabel>
                            <S.FilledInputValue>{String(value)}</S.FilledInputValue>
                          </S.FilledInputRow>
                        ))}
                      </S.FilledInputs>
                    )}

                    {/* fallback_used 배지 */}
                    {/* 액션 버튼 or 상태 텍스트 */}
                    {isSuperseded ? (
                      <S.TaskStatusText status="superseded">
                        새 요청으로 대체됨
                      </S.TaskStatusText>
                    ) : isTerminal ? (
                      <S.TaskStatusText status={task.approval_state}>
                        {task.approval_state === 'completed'
                          ? '완료'
                          : task.approval_state === 'failed'
                            ? '실패'
                            : task.approval_state === 'cancelled'
                              ? '취소됨'
                              : task.approval_state === 'expired'
                                ? '만료됨'
                                : task.approval_state}
                      </S.TaskStatusText>
                    ) : (
                      <S.TaskCardActions>
                        {isApprovalPending && (
                          <S.PendingIndicator>실행 중...</S.PendingIndicator>
                        )}
                        {task.next_actions?.map((action) => {
                          if (action === 'approve') {
                            return (
                              <S.ActionButton
                                key={action}
                                variant="primary"
                                disabled={disableActions}
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
                                disabled={disableActions}
                                onClick={() => {
                                  if (message.request_id) onReject(message.request_id);
                                }}
                              >
                                거절
                              </S.ActionButton>
                            );
                          }
                          if (action === 'edit') {
                            return (
                              <S.ActionButton
                                key={action}
                                variant="secondary"
                                disabled={disableActions || !message.request_id || message.request_id !== activeRequestId}
                                onClick={() => {
                                  if (!message.request_id) return;
                                  onEditTask(message.request_id);
                                }}
                              >
                                수정
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
                          if (action === 'fill_inputs') {
                            return null;
                          }
                          if (action === 'choose_option') {
                            return (
                              <S.ActionButton key={action} variant="secondary" disabled>
                                선택하기
                              </S.ActionButton>
                            );
                          }
                          if (action === 'view_progress') {
                            return (
                              <S.ActionButton key={action} variant="secondary" disabled>
                                진행 보기
                              </S.ActionButton>
                            );
                          }
                          return null;
                        })}
                      </S.TaskCardActions>
                    )}
                  </S.TaskCard>
                </S.MessageRow>
              </Fragment>
            );
          }
        }
        return null;
      })}
      <S.ScrollSpacer />
    </S.ChatArea>
  );
}
