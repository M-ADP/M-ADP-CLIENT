'use client';

import { useState, useEffect, useRef } from 'react';
import * as S from './style';
import { SSEEventRecord } from '@/types/chatops';

/** 이벤트 타입 → 사용자 친화적 라벨 */
const EVENT_LABEL: Record<string, string> = {
  'request.created': '요청 접수',
  'context.hydrated': '문맥 분석',
  'parsing.completed': '의도 파악 완료',
  'approval.required': '승인 대기',
  'request.ambiguous': '추가 확인 필요',
  'request.input_required': '추가 입력 필요',
  'response.started': '응답 생성 시작',
  'response.completed': '응답 생성 완료',
  'request.failed': '요청 실패',
  'execution.completed': '실행 완료',
  'execution.failed': '실행 실패',
  'approval.rejected': '승인 거절됨',
  'approval.superseded': '요청 대체됨',
};

function isPauseEvent(type: string): boolean {
  return ['approval.required', 'request.input_required', 'request.ambiguous'].includes(type);
}

function isFinalEvent(type: string): boolean {
  return [
    'response.completed',
    'request.failed',
    'execution.completed',
    'execution.failed',
    'approval.rejected',
    'approval.superseded',
  ].includes(type);
}

/** 실패 이벤트인지 */
function isFailedEvent(type: string): boolean {
  return ['request.failed', 'execution.failed'].includes(type);
}

function isCancelledEvent(type: string): boolean {
  return ['approval.rejected', 'approval.superseded'].includes(type);
}

function getPanelTone(type: string | null, isLive: boolean): 'live' | 'paused' | 'done' | 'failed' | 'cancelled' {
  if (!type) return isLive ? 'live' : 'paused';
  if (isFailedEvent(type)) return 'failed';
  if (isCancelledEvent(type)) return 'cancelled';
  if (isPauseEvent(type)) return 'paused';
  if (isFinalEvent(type)) return 'done';
  return isLive ? 'live' : 'paused';
}

function getStatusLabel(tone: 'live' | 'paused' | 'done' | 'failed' | 'cancelled'): string {
  switch (tone) {
    case 'live':
      return '';
    case 'paused':
      return '확인 필요';
    case 'done':
      return '완료';
    case 'failed':
      return '실패';
    case 'cancelled':
      return '중단됨';
  }
}

function getHeaderSummary(events: SSEEventRecord[], isLive: boolean): string {
  if (events.length === 0) return '요청을 분석하고 있습니다';

  const lastEvent = events[events.length - 1].event;
  const type = lastEvent.type;
  const stepCount = events.length;

  switch (type) {
    case 'request.created':
      return '요청을 확인하고 있습니다';
    case 'context.hydrated':
      return '관련 문맥을 살펴보고 있습니다';
    case 'parsing.completed':
      return isLive ? '요청을 해석했고 다음 단계를 정리하고 있습니다' : '요청 해석을 마쳤습니다';
    case 'response.started':
      return '답변을 작성하고 있습니다';
    case 'approval.required':
      return '실행 전 승인을 기다리고 있습니다';
    case 'request.input_required':
      return '실행에 필요한 정보를 더 알려주세요';
    case 'request.ambiguous':
      return '어떤 작업인지 조금 더 확인이 필요합니다';
    case 'response.completed':
      return `생각 ${stepCount}단계 완료`;
    case 'execution.completed':
      return '실행이 완료되었습니다';
    case 'request.failed':
    case 'execution.failed':
      return '처리 중 문제가 발생했습니다';
    case 'approval.rejected':
      return '요청이 취소되었습니다';
    case 'approval.superseded':
      return '새 요청으로 대체되었습니다';
    default:
      return EVENT_LABEL[type] || '처리를 마쳤습니다';
  }
}

interface ThinkingPanelProps {
  events: SSEEventRecord[];
  /** 아직 SSE가 흐르고 있는 상태인지 */
  isLive: boolean;
}

export default function ThinkingPanel({ events, isLive }: ThinkingPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [autoCollapsed, setAutoCollapsed] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const hasBeenLiveRef = useRef(isLive);
  const lastRecord = events.at(-1) ?? null;
  const lastEvent = lastRecord?.event ?? null;
  const lastType = lastEvent?.type ?? null;
  const panelTone = getPanelTone(lastType, isLive);
  const isActive = panelTone === 'live';
  const headerText = getHeaderSummary(events, isLive);
  const statusLabel = getStatusLabel(panelTone);

  useEffect(() => {
    if (isLive) {
      hasBeenLiveRef.current = true;
    }
  }, [isLive]);

  useEffect(() => {
    if (!isOpen || !lastType || !isFinalEvent(lastType) || autoCollapsed || !hasBeenLiveRef.current) {
      return;
    }

    const timer = setTimeout(() => {
      setIsOpen(false);
      setAutoCollapsed(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, [isOpen, lastType, autoCollapsed]);

  useEffect(() => {
    if (listRef.current && isOpen) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [events.length, isOpen]);

  if (events.length === 0 && !isLive) return null;

  const lastProgress =
    lastEvent && 'progress' in lastEvent ? (lastEvent as { progress?: number }).progress ?? 0 : 0;

  return (
    <S.Panel data-state={panelTone}>
      <S.PanelHeader onClick={() => setIsOpen((value) => !value)}>
        <S.HeaderGroup>
          {panelTone === 'live' && <S.SpinnerIcon />}
          {panelTone === 'done' && <S.CheckIcon>✓</S.CheckIcon>}
          {panelTone === 'failed' && <S.FailIcon>!</S.FailIcon>}
          {panelTone === 'paused' && <S.PauseIcon>•</S.PauseIcon>}
          {panelTone === 'cancelled' && <S.CancelIcon>-</S.CancelIcon>}
          <S.HeaderCopy>
            <S.HeaderText>Thinking</S.HeaderText>
            {statusLabel && <S.HeaderStatus>{statusLabel}</S.HeaderStatus>}
          </S.HeaderCopy>
        </S.HeaderGroup>
        <S.HeaderRight>
          {statusLabel && <S.HeaderStatus>{statusLabel}</S.HeaderStatus>}
          <S.ChevronIcon open={isOpen}>▼</S.ChevronIcon>
        </S.HeaderRight>
      </S.PanelHeader>

      {panelTone === 'live' && lastProgress > 0 && lastProgress < 100 && (
        <S.ProgressBar value={lastProgress} />
      )}

      {isOpen && (
        <S.StepList ref={listRef}>
          <S.SummaryText>{headerText}</S.SummaryText>
          {events.map((record, index) => {
            const evt = record.event;
            const isLast = index === events.length - 1;
            const stepActive = isLast && isActive;
            const message = 'message' in evt ? (evt as { message?: string }).message : undefined;
            const label = EVENT_LABEL[evt.type] || evt.type;
            const stepTone = isFailedEvent(evt.type)
              ? 'failed'
              : isPauseEvent(evt.type)
                ? 'paused'
                : stepActive
                  ? 'active'
                  : 'done';

            return (
              <S.StepItem key={record.sequence ?? `${evt.type}-${index}`} isActive={stepActive}>
                <S.StepDot status={stepTone} />
                <S.StepContent>
                  <S.StepMessage isActive={stepActive}>{message || label}</S.StepMessage>
                </S.StepContent>
              </S.StepItem>
            );
          })}

          {isLive && events.length === 0 && (
            <S.StepItem isActive>
              <S.StepDot status="active" />
              <S.StepContent>
                <S.StepMessage isActive>처리 중...</S.StepMessage>
              </S.StepContent>
            </S.StepItem>
          )}
        </S.StepList>
      )}
    </S.Panel>
  );
}
