import { forwardRef } from 'react';
import Image from 'next/image';
import * as S from './style';
import { TaskSnapshot } from '@/types/chatops';

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

const TERMINAL_STATES = ['completed', 'failed', 'cancelled', 'expired'];

const TERMINAL_LABEL: Record<string, string> = {
  completed: '완료',
  failed: '실패',
  cancelled: '취소됨',
  expired: '만료됨',
};

interface TaskMessageProps {
  task: TaskSnapshot;
  requestId: string | null;
  activeRequestId: string | null;
  isApprovalPending: boolean;
  isSuperseded: boolean;
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
  onEditTask: (requestId: string) => void;
}

const TaskMessage = forwardRef<HTMLDivElement, TaskMessageProps>(function TaskMessage(
  {
    task,
    requestId,
    activeRequestId,
    isApprovalPending,
    isSuperseded,
    onApprove,
    onReject,
    onEditTask,
  },
  ref,
) {
  const isTerminal = TERMINAL_STATES.includes(task.approval_state);
  const disableActions = isSuperseded || isTerminal || isApprovalPending;

  return (
    <S.MessageRow ref={ref}>
      <S.Avatar>
        <Image src="/assets/logo.svg" alt="AI Avatar" width={24} height={24} />
      </S.Avatar>
      <S.TaskCard>
        <S.TaskCardHeader>
          <S.TaskCardTitle>{task.title}</S.TaskCardTitle>
        </S.TaskCardHeader>
        <S.TaskCardSummary>{task.summary}</S.TaskCardSummary>

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

        {isSuperseded ? (
          <S.TaskStatusText status="superseded">새 요청으로 대체됨</S.TaskStatusText>
        ) : isTerminal ? (
          <S.TaskStatusText status={task.approval_state}>
            {TERMINAL_LABEL[task.approval_state] ?? task.approval_state}
          </S.TaskStatusText>
        ) : (
          <S.TaskCardActions>
            {isApprovalPending && <S.PendingIndicator>실행 중...</S.PendingIndicator>}
            {task.next_actions?.map((action) => {
              if (action === 'approve') {
                return (
                  <S.ActionButton
                    key={action}
                    variant="primary"
                    disabled={disableActions}
                    onClick={() => {
                      if (requestId) onApprove(requestId);
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
                      if (requestId) onReject(requestId);
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
                    disabled={disableActions || !requestId || requestId !== activeRequestId}
                    onClick={() => {
                      if (!requestId) return;
                      onEditTask(requestId);
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
  );
});

export default TaskMessage;
