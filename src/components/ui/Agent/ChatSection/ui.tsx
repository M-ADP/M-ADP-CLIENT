import { Fragment } from 'react';
import Image from 'next/image';
import { useState } from 'react';
import * as S from './style';
import { ConversationMessage, TaskSnapshot, SSEEventRecord } from '@/types/chatops';
import ThinkingPanel from '@/components/ui/Agent/ThinkingPanel/ui';

// approval_state 한글 매핑
const APPROVAL_STATE_LABEL: Record<string, string> = {
  not_ready: '입력 필요',
  needs_clarification: '확인 필요',
  awaiting_approval: '승인 대기',
  approved: '실행 중',
  completed: '완료',
  failed: '실패',
  cancelled: '취소됨',
  expired: '만료됨',
};

// approval_state → 배지 색상 variant
const APPROVAL_STATE_VARIANT: Record<string, 'info' | 'warning' | 'success' | 'danger' | 'neutral'> = {
  not_ready: 'warning',
  needs_clarification: 'warning',
  awaiting_approval: 'info',
  approved: 'info',
  completed: 'success',
  failed: 'danger',
  cancelled: 'neutral',
  expired: 'neutral',
};

interface ChatSectionProps {
  messages: ConversationMessage[];
  isThinking: boolean;
  isMessageSubmitting: boolean;
  // SSE 계약 추가 상태
  currentTask: TaskSnapshot | null;
  isApprovalPending: boolean;
  supersededBy: number | null;
  sseEventLog: SSEEventRecord[];
  onSubmitMissingInputs: (requestId: number, message: string) => void;
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
  isMessageSubmitting,
  currentTask,
  isApprovalPending,
  supersededBy,
  sseEventLog,
  onSubmitMissingInputs,
  onApprove,
  onReject,
}: ChatSectionProps) {
  const [missingInputValues, setMissingInputValues] = useState<Record<number, Record<string, string>>>({});

  const pendingRequestId = messages
    .filter((m) => m.request_id !== null)
    .at(-1)?.request_id ?? null;
  const thinkingRequestId = sseEventLog.at(-1)?.event.request_id ?? null;

  return (
    <S.ChatArea>
      {messages.map((message) => {
        if (message.role === 'user') {
          return (
            <S.UserMessageRow key={message.message_id}>
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
                  <S.AIMessageCard>{message.text}</S.AIMessageCard>
                </S.MessageRow>
              </Fragment>
            );
          }

          if (message.type === 'task') {
            const task = resolveTask(message.task, message.request_id, currentTask, pendingRequestId);
            if (!task) {
              return thinkingRow ? <Fragment key={message.message_id}>{thinkingRow}</Fragment> : null;
            }
            const requestId = message.request_id;
            const inputValues = requestId !== null ? (missingInputValues[requestId] ?? {}) : {};
            const missingInputs = task.missing_inputs ?? [];

            const isSuperseded = supersededBy !== null && message.request_id !== null;
            const isTerminal = ['completed', 'failed', 'cancelled', 'expired'].includes(task.approval_state);
            const disableActions = isSuperseded || isTerminal || isApprovalPending;
            const canSubmitMissingInputs =
              requestId !== null &&
              !disableActions &&
              !isMessageSubmitting &&
              missingInputs.length > 0 &&
              missingInputs.every((input) => (inputValues[input.key] ?? '').trim().length > 0);

            const approvalLabel = APPROVAL_STATE_LABEL[task.approval_state] || task.approval_state;
            const approvalVariant = APPROVAL_STATE_VARIANT[task.approval_state] || 'neutral';

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
                      <S.HeaderBadges>
                        {task.risk_level && (
                          <S.Badge level={task.risk_level.toLowerCase()}>{task.risk_level}</S.Badge>
                        )}
                        <S.StateBadge variant={approvalVariant}>{approvalLabel}</S.StateBadge>
                      </S.HeaderBadges>
                    </S.TaskCardHeader>
                    <S.TaskCardSummary>{task.summary}</S.TaskCardSummary>

                    {/* filled_inputs 확인 패널 */}
                    {task.filled_inputs && Object.keys(task.filled_inputs).length > 0 && (
                      <S.FilledInputs>
                        {Object.entries(task.filled_inputs).map(([key, value]) => (
                          <S.FilledInputRow key={key}>
                            <S.FilledInputLabel>{key}</S.FilledInputLabel>
                            <S.FilledInputValue>{String(value)}</S.FilledInputValue>
                          </S.FilledInputRow>
                        ))}
                      </S.FilledInputs>
                    )}

                    {/* missing_inputs 인라인 폼 (UI 껍데기) */}
                    {missingInputs.length > 0 && !isTerminal && (
                      <S.MissingInputs>
                        <S.MissingInputsTitle>추가 입력 필요</S.MissingInputsTitle>
                        {missingInputs.map((input) => (
                          <S.MissingInputRow key={input.key}>
                            <S.MissingInputLabel>{input.label}</S.MissingInputLabel>
                            <S.MissingInputField
                              placeholder={input.label}
                              value={inputValues[input.key] ?? ''}
                              onChange={(event) => {
                                if (requestId === null) return;
                                const nextValue = event.target.value;
                                setMissingInputValues((state) => ({
                                  ...state,
                                  [requestId]: {
                                    ...(state[requestId] ?? {}),
                                    [input.key]: nextValue,
                                  },
                                }));
                              }}
                              disabled={isMessageSubmitting}
                            />
                          </S.MissingInputRow>
                        ))}
                      </S.MissingInputs>
                    )}

                    {/* fallback_used 배지 */}
                    {task.clarification_type && (
                      <S.ClarificationBadge>{task.clarification_type}</S.ClarificationBadge>
                    )}

                    {/* 액션 버튼 or 상태 텍스트 */}
                    {isSuperseded ? (
                      <S.TaskStatusText status="superseded">
                        새 요청으로 대체됨
                      </S.TaskStatusText>
                    ) : isTerminal ? (
                      <S.TaskStatusText status={task.approval_state}>
                        {approvalLabel}
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
                              <S.ActionButton key={action} variant="secondary" disabled={disableActions}>
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
                            return (
                              <S.ActionButton
                                key={action}
                                variant="primary"
                                disabled={!canSubmitMissingInputs}
                                onClick={() => {
                                  if (!requestId || missingInputs.length === 0) return;
                                  const messageText = missingInputs
                                    .map((input) => `${input.label}: ${inputValues[input.key] ?? ''}`)
                                    .join('\n');
                                  onSubmitMissingInputs(requestId, messageText);
                                }}
                              >
                                입력하기
                              </S.ActionButton>
                            );
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
    </S.ChatArea>
  );
}
