import { Fragment } from 'react';
import Image from 'next/image';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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

function MarkdownMessage({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => <S.MarkdownParagraph>{children}</S.MarkdownParagraph>,
        ol: ({ children }) => <S.MarkdownOrderedList>{children}</S.MarkdownOrderedList>,
        ul: ({ children }) => <S.MarkdownUnorderedList>{children}</S.MarkdownUnorderedList>,
        blockquote: ({ children }) => <S.MarkdownBlockquote>{children}</S.MarkdownBlockquote>,
        a: ({ children, href }) => (
          <S.MarkdownLink href={href} target="_blank" rel="noreferrer noopener">
            {children}
          </S.MarkdownLink>
        ),
        code: ({ children, className }) => <code className={className}>{children}</code>,
        pre: ({ children }) => <S.CodeBlock>{children}</S.CodeBlock>,
        table: ({ children }) => (
          <S.MarkdownTableScroll>
            <S.MarkdownTable>{children}</S.MarkdownTable>
          </S.MarkdownTableScroll>
        ),
        th: ({ children }) => <S.MarkdownTableHeader>{children}</S.MarkdownTableHeader>,
        td: ({ children }) => <S.MarkdownTableCell>{children}</S.MarkdownTableCell>,
      }}
    >
      {children}
    </ReactMarkdown>
  );
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
  // 마지막 AI 메시지 ref (스트리밍 추적용)
  const latestMessageRef = useRef<HTMLDivElement>(null);
  // 마지막 유저 메시지 ref (전송 시 상단 정렬용)
  const lastUserMsgRef = useRef<HTMLDivElement>(null);
  // 마운트 최초 실행 스킵용 — 기존 대화 로드 시 잘못된 스크롤 방지
  const hasSentRef = useRef(false);
  // 동적 spacer: 유저 메시지부터 콘텐츠 끝까지가 viewport보다 작을 때만 부족분만큼 추가
  const [spacerHeight, setSpacerHeight] = useState(0);

  const pendingRequestId = messages
    .filter((m) => m.request_id !== null)
    .at(-1)?.request_id ?? null;
  const thinkingRequestId = sseEventLog.at(-1)?.event.request_id ?? null;
  const latestMessage = messages.at(-1);
  const latestMessageId = latestMessage?.message_id ?? null;
  const latestMessageText = latestMessage?.text;
  const latestUserMessageId = messages.filter((m) => m.role === 'user').at(-1)?.message_id ?? null;

  // spacer = max(0, viewport - (마지막 유저 메시지 ~ 마지막 콘텐츠 끝))
  // → AI 응답이 짧으면 빈 공간 채워서 유저 메시지 상단 스크롤 가능
  // → AI 응답이 길면 spacer = 0, 빈 공간 없음
  useLayoutEffect(() => {
    const container = scrollRef.current;
    const userMsg = lastUserMsgRef.current;

    if (!container || !userMsg) {
      setSpacerHeight(0);
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const scrollTop = container.scrollTop;

    const userMsgRect = userMsg.getBoundingClientRect();
    const userMsgTop = userMsgRect.top - containerRect.top + scrollTop;

    // 유저 메시지 이후 마지막 콘텐츠 (AI 메시지 또는 유저 메시지 자체)
    const lastEl = latestMessageRef.current ?? userMsg;
    const lastElRect = lastEl.getBoundingClientRect();
    const lastElBottom = lastElRect.top - containerRect.top + scrollTop + lastElRect.height;

    const heightFromUserMsg = lastElBottom - userMsgTop;
    const needed = container.clientHeight - heightFromUserMsg;

    setSpacerHeight(Math.max(0, needed));
  }, [latestMessageId, latestMessageText, latestUserMessageId]);

  const scrollUserMsgToTop = useCallback((behavior: ScrollBehavior) => {
    const container = scrollRef.current;
    const element = lastUserMsgRef.current;
    if (!container || !element) return;

    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    const elementTop = elementRect.top - containerRect.top + container.scrollTop;

    container.scrollTo({
      top: Math.max(0, elementTop - 24),
      behavior,
    });
  }, []);

  // 유저가 메시지 전송 시에만 → 유저 메시지 상단 정렬 (마운트 시 실행 안 함)
  useEffect(() => {
    if (!hasSentRef.current) {
      hasSentRef.current = true;
      return;
    }
    const frame = window.requestAnimationFrame(() => {
      scrollUserMsgToTop('smooth');
    });
    return () => window.cancelAnimationFrame(frame);
  }, [scrollToLatestToken, scrollUserMsgToTop]);

  // AI 응답 스트리밍 중 → 뷰포트 밖으로 나간 경우에만 스크롤 (초기 로드 포함)
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      latestMessageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [latestMessageId, latestMessageText]);

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
            const isTerminal = ['completed', 'failed', 'cancelled', 'expired'].includes(task.approval_state);
            const disableActions = isSuperseded || isTerminal || isApprovalPending;

            return (
              <Fragment key={message.message_id}>
                {thinkingRow}
                <S.MessageRow ref={message.message_id === latestMessageId ? latestMessageRef : null}>
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
      <S.ScrollSpacer style={{ height: `${spacerHeight}px` }} />
    </S.ChatArea>
  );
}
