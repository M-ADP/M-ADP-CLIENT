import { useEffect, useMemo, useRef, useState } from 'react';
import * as S from './style';
import { TaskSnapshot } from '@/types/chatops';
import { useDailyUsage } from '@/services/chatops/chatops.query';

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

type AssistMode = 'default' | 'edit';

interface SearchSectionProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSearch: (e?: React.FormEvent) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  disabled?: boolean;
  activeTask?: TaskSnapshot | null;
  activeRequestId?: number | null;
  assistMode?: AssistMode;
  onSubmitMissingInputs?: (requestId: number, message: string) => void;
  onDismissAssist?: () => void;
  onRejectRequest?: (requestId: number) => void;
}

export default function SearchSection({
  inputValue,
  setInputValue,
  handleSearch,
  handleKeyDown,
  disabled,
  activeTask,
  activeRequestId,
  assistMode = 'default',
  onSubmitMissingInputs,
  onDismissAssist,
  onRejectRequest,
}: SearchSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: usage } = useDailyUsage();

  const usageRatio = usage && usage.daily_limit > 0
    ? Math.min(usage.daily_usage / usage.daily_limit, 1)
    : 0;
  const usageExhausted = !!usage && usage.daily_limit > 0 && usage.daily_usage >= usage.daily_limit;
  const resetsAtLabel = useMemo(() => {
    if (!usage?.resets_at) return '';
    const date = new Date(usage.resets_at);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleString('ko-KR', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, [usage?.resets_at]);

  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled]);

  const [assistValues, setAssistValues] = useState<Record<string, string>>(() => {
    const nextValues: Record<string, string> = {};
    const filledInputs = activeTask?.filled_inputs ?? {};

    for (const [key, value] of Object.entries(filledInputs)) {
      nextValues[key] = String(value ?? '');
    }

    return nextValues;
  });

  const missingInputs = useMemo(
    () => activeTask?.missing_inputs ?? [],
    [activeTask]
  );

  const editableInputs = useMemo(
    () => Object.entries(activeTask?.filled_inputs ?? {}).map(([key, value]) => ({
      key,
      label: toFieldLabel(key),
      value: String(value ?? ''),
    })),
    [activeTask]
  );

  const showMissingInputPanel =
    activeRequestId !== null &&
    activeRequestId !== undefined &&
    activeTask?.approval_state === 'not_ready' &&
    missingInputs.length > 0;

  const showEditPanel =
    assistMode === 'edit' &&
    activeRequestId !== null &&
    activeRequestId !== undefined &&
    editableInputs.length > 0;

  const assistFields = showEditPanel
    ? editableInputs
    : missingInputs.map((input) => ({
        key: input.key,
        label: input.label,
        value: assistValues[input.key] ?? '',
      }));

  const showAssistPanel = showMissingInputPanel || showEditPanel;

  const canSubmitAssist =
    !!activeRequestId &&
    assistFields.every((input) => (assistValues[input.key] ?? input.value ?? '').trim().length > 0) &&
    !disabled;

  return (
    <S.Dock>
      {showAssistPanel && (
        <S.AssistPanel>
          <S.AssistHeader>
            <S.AssistTitle>
              {showEditPanel ? '실행 전에 값을 수정할 수 있습니다' : '작업을 계속하려면 아래 정보가 필요합니다'}
            </S.AssistTitle>
            <S.AssistBody>
              {showEditPanel
                ? '변경할 값만 수정한 뒤 다시 보내면 됩니다.'
                : activeTask?.summary || '필요한 값만 입력하면 다음 단계로 진행합니다.'}
            </S.AssistBody>
          </S.AssistHeader>
          <S.AssistFields>
            {assistFields.map((input) => (
              <S.AssistField key={input.key}>
                <S.AssistLabel>{input.label}</S.AssistLabel>
                <S.AssistInput
                  placeholder={input.label}
                  value={assistValues[input.key] ?? input.value ?? ''}
                  onChange={(event) => {
                    const nextValue = event.target.value;
                    setAssistValues((prev) => ({
                      ...prev,
                      [input.key]: nextValue,
                    }));
                  }}
                  onKeyDown={(event) => {
                    if (event.key !== 'Enter' || !canSubmitAssist || !activeRequestId || !onSubmitMissingInputs) {
                      return;
                    }
                    event.preventDefault();
                    const messageText = assistFields
                      .map((field) => `${field.label}: ${assistValues[field.key] ?? field.value ?? ''}`)
                      .join('\n');
                    onSubmitMissingInputs(activeRequestId, messageText);
                  }}
                  disabled={disabled}
                />
              </S.AssistField>
            ))}
          </S.AssistFields>
          <S.AssistActions>
            <S.AssistActionButton
              type="button"
              variant="primary"
              disabled={!canSubmitAssist}
              onClick={() => {
                if (!activeRequestId || !onSubmitMissingInputs) return;
                const messageText = assistFields
                  .map((input) => `${input.label}: ${assistValues[input.key] ?? input.value ?? ''}`)
                  .join('\n');
                onSubmitMissingInputs(activeRequestId, messageText);
              }}
            >
              {showEditPanel ? '변경 반영' : '계속하기'}
            </S.AssistActionButton>
            <S.AssistActionButton
              type="button"
              variant="secondary"
              disabled={disabled}
              onClick={() => {
                if (showEditPanel) {
                  onDismissAssist?.();
                  return;
                }
                if (!activeRequestId || !onRejectRequest) return;
                onRejectRequest(activeRequestId);
              }}
            >
              {showEditPanel ? '닫기' : '취소'}
            </S.AssistActionButton>
          </S.AssistActions>
        </S.AssistPanel>
      )}

      <S.SearchContainer onSubmit={handleSearch}>
        <S.InputWrapper>
          <S.IconCircle>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4L14.4 9.6L20 12L14.4 14.4L12 20L9.6 14.4L4 12L9.6 9.6L12 4Z" fill="#969696" />
            </svg>
          </S.IconCircle>
          <S.SearchInput
            ref={inputRef}
            placeholder="무엇을 원하시나요?"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
          />
        </S.InputWrapper>

        <S.SendButton type="submit" disabled={disabled || usageExhausted} aria-label="메시지 전송">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 19V5M12 5L5 12M12 5L19 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </S.SendButton>
      </S.SearchContainer>

      {usage && (
        <S.UsageRow>
          <S.UsageText exhausted={usageExhausted}>
            오늘 사용량 {usage.daily_usage.toLocaleString()} / {usage.daily_limit.toLocaleString()} 토큰
            {resetsAtLabel && <S.UsageReset> · {resetsAtLabel} 초기화</S.UsageReset>}
          </S.UsageText>
          <S.UsageBar>
            <S.UsageBarFill ratio={usageRatio} exhausted={usageExhausted} />
          </S.UsageBar>
        </S.UsageRow>
      )}
    </S.Dock>
  );
}
