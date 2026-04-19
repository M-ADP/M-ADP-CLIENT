'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useQueryClient } from '@tanstack/react-query';
import * as S from './style';
import ChatSection from '@/components/ui/Agent/ChatSection/ui';
import SearchSection from '@/components/ui/Agent/SearchSection/ui';

import { useChatStore } from '@/store/chatStore';
import { useStream } from '@/hooks/useStream';
import {
  useSession,
  useRequestEvents,
  chatopsKeys
} from '@/services/chatops/chatops.query';
import {
  usePostMessage,
  useApproveRequest,
  useRejectRequest,
  useCreateSession
} from '@/services/chatops/chatops.mutation';
import {
  ConversationMessage,
  isTerminalStatus,
  SSEEvent,
  SSEEventRecord,
} from '@/types/chatops';
import { normalizeSSEEvent } from '@/services/chatops/chatops.sse';

export default function AgentPage() {
  const queryClient = useQueryClient();

  const {
    activeSessionId,
    setActiveSessionId,
    pendingRequestId,
    setPendingRequestId,
    streamingText,
    clearStreamingText,
    resetRequest,
    // SSE 계약 추가 상태
    currentTask,
    requestStatus,
    finalResponse,
    isApprovalPending,
    setIsApprovalPending,
    bootstrapRequest,
    supersededBy,
    sseEventLog,
  } = useChatStore();

  const [inputValue, setInputValue] = useState("");
  const [optimisticMessage, setOptimisticMessage] = useState<ConversationMessage | null>(null);
  const [displayedStreamingText, setDisplayedStreamingText] = useState('');
  const [composerAssistMode, setComposerAssistMode] = useState<'default' | 'edit'>('default');
  const [scrollToLatestToken, setScrollToLatestToken] = useState(0);
  const animationFrameRef = useRef<number | null>(null);
  const { data: sessionDetail } = useSession(activeSessionId);

  const createSessionMutation = useCreateSession();
  const postMessageMutation = usePostMessage();
  const approveMutation = useApproveRequest();
  const rejectMutation = useRejectRequest();
  const isSubmittingMessage =
    createSessionMutation.isPending ||
    postMessageMutation.isPending;
  const isRequestActive =
    isSubmittingMessage ||
    pendingRequestId !== null;

  // SSE Stream 훅
  useStream(activeSessionId || 0, pendingRequestId);

  const sendUserMessage = async (rawMessage: string, options?: { clearComposer?: boolean }) => {
    const inputText = rawMessage.trim();
    if (!inputText || isSubmittingMessage) return;

    let targetSessionId = activeSessionId;

    if (options?.clearComposer) {
      setInputValue("");
    }

    setScrollToLatestToken((value) => value + 1);
    setComposerAssistMode('default');
    resetRequest();

    setOptimisticMessage({
      message_id: 'temp-' + Date.now(),
      request_id: null,
      role: 'user',
      type: 'text',
      text: inputText,
      task: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    try {
      if (!targetSessionId) {
        const newSession = await createSessionMutation.mutateAsync({ title: inputText.slice(0, 20) });
        targetSessionId = newSession.session_id;
        setActiveSessionId(targetSessionId);
      }

      postMessageMutation.mutate(
        { sessionId: targetSessionId, message: inputText },
        {
          onSuccess: async (res) => {
            const msgsWithReqId = res.messages.filter((message) => message.request_id !== null);
            const targetMsg = msgsWithReqId[msgsWithReqId.length - 1];
            const resolvedRequestId = res.request_id ?? targetMsg?.request_id ?? null;

            bootstrapRequest({
              request_id: resolvedRequestId,
              request_status: res.request_status ?? null,
              final_response: res.final_response ?? null,
              task: res.task ?? null,
            });

            if (resolvedRequestId !== null) {
              setPendingRequestId(resolvedRequestId);
            }

            clearStreamingText();
            await queryClient.invalidateQueries({ queryKey: chatopsKeys.sessionDetail(targetSessionId) });
            setOptimisticMessage(null);
            queryClient.invalidateQueries({ queryKey: chatopsKeys.sessions() });
          },
          onError: (error) => {
            console.error('[ChatOps] POST message error:', error);
            setOptimisticMessage(null);
          }
        }
      );
    } catch (error) {
      console.error('[ChatOps] Failed to create session or send message', error);
      setOptimisticMessage(null);
    }
  };

  // 스트리밍/terminal 종료 시 처리
  useEffect(() => {
    const targetText = finalResponse ?? streamingText ?? '';
    const hasFinishedAnimation = displayedStreamingText === targetText;
    const isTerminal = pendingRequestId && requestStatus && isTerminalStatus(requestStatus);
    // not_ready 상태면 사용자 입력이 필요한 상태 → pendingRequestId 유지
    const needsUserInput = currentTask?.approval_state === 'not_ready';

    if (isTerminal && hasFinishedAnimation && !needsUserInput) {
      if (activeSessionId) {
        queryClient.invalidateQueries({ queryKey: chatopsKeys.sessionDetail(activeSessionId) });
      }
      setPendingRequestId(null);
    }
  }, [requestStatus, pendingRequestId, activeSessionId, queryClient, setPendingRequestId, displayedStreamingText, finalResponse, streamingText, currentTask]);

  // 텍스트 타이핑 애니메이션
  useEffect(() => {
    const targetText = finalResponse ?? streamingText ?? '';

    // 애니메이션이 이미 목표에 도달했거나 진행할 텍스트가 없는 경우
    if (!pendingRequestId || displayedStreamingText === targetText) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setDisplayedStreamingText((current) => {
        if (!targetText.startsWith(current)) {
          // 동기화가 깨졌을 때 (예: SSE 이벤트 재연결 등으로 인한 재시작)
          // 혹은 \r\n 차이 등. 바로 targetText로 맞춘다.
          return targetText;
        }

        const remaining = targetText.length - current.length;
        if (remaining <= 0) {
          return current;
        }

        // 남은 텍스트가 많으면 한 번에 여러 글자를 추가하여 속도 향상
        const advance = Math.max(1, Math.floor(remaining / 10));
        return targetText.slice(0, current.length + advance);
      });
    }, 15);

    return () => window.clearTimeout(timeoutId);
  }, [displayedStreamingText, finalResponse, pendingRequestId, streamingText]);

  // 전송 핸들러
  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    await sendUserMessage(inputValue, { clearComposer: true });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      handleSearch();
    }
  };

  const handleApprove = (requestId: number) => {
    if (activeSessionId === null || activeSessionId === undefined) return;
    setComposerAssistMode('default');
    setIsApprovalPending(true);
    approveMutation.mutate(
      { sessionId: activeSessionId, requestId },
      {
        onSuccess: () => {
          // approval pending UX 유지 → SSE execution.completed/failed 에서 해제됨
          queryClient.invalidateQueries({ queryKey: chatopsKeys.sessionDetail(activeSessionId) });
          // SSE에서 terminal 이벤트를 받기 위해 pendingRequestId 유지
          setPendingRequestId(requestId);
        },
        onError: () => {
          setIsApprovalPending(false);
        }
      }
    );
  };

  const handleReject = (requestId: number) => {
    if (activeSessionId === null || activeSessionId === undefined) return;
    setComposerAssistMode('default');
    rejectMutation.mutate(
      { sessionId: activeSessionId, requestId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: chatopsKeys.sessionDetail(activeSessionId) });
        }
      }
    );
  };

  const handleSubmitMissingInputs = (requestId: number, message: string) => {
    if (requestId <= 0) return;
    setComposerAssistMode('default');
    void sendUserMessage(message);
  };

  const handleEditTask = (requestId: number) => {
    if (!pendingRequestId || requestId !== pendingRequestId) return;
    setComposerAssistMode('edit');
  };

  // --- 메시지 리스트 조합 ---
  const rawServerMessages = sessionDetail?.messages || [];
  const serverMessages =
    pendingRequestId !== null
      ? rawServerMessages.filter(
          (message) => !(message.request_id === pendingRequestId && message.role === 'assistant')
        )
      : rawServerMessages;
  const messages = [...serverMessages];
  const { data: requestEvents } = useRequestEvents(activeSessionId, pendingRequestId);

  const historyEventLog: SSEEventRecord[] =
    requestEvents?.items
      .reduce<SSEEventRecord[]>((acc, item) => {
        const event = normalizeSSEEvent(item.data, item.type);
        if (!event || event.type === 'response.delta') {
          return acc;
        }

        acc.push({
          sequence: item.sequence,
          event: event as SSEEvent,
        });

        return acc;
      }, []) ?? [];

  const thinkingEventLog =
    pendingRequestId !== null
      ? (sseEventLog.length > 0 ? sseEventLog : historyEventLog)
      : [];

  // 1. optimistic user message (전송 중)
  if (optimisticMessage) {
    messages.push(optimisticMessage);
  }

  // 2. SSE 실시간 응답 합성 메시지
  //    서버 refetch 전에도 응답이 바로 보이게 한다
  if (pendingRequestId) {
    const liveText = displayedStreamingText;

    messages.push({
      message_id: `sse-live-${pendingRequestId}`,
      request_id: pendingRequestId,
      role: 'assistant' as const,
      type: (currentTask ? 'task' : 'text') as 'text' | 'task',
      text: liveText || null,
      task: currentTask,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }

  if ((createSessionMutation.isPending || postMessageMutation.isPending) && pendingRequestId === null) {
    messages.push({
      message_id: 'sse-live-pending',
      request_id: null,
      role: 'assistant',
      type: 'text',
      text: null,
      task: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }

  const hasMessages = messages.length > 0;

  return (
    <S.Container isChat={hasMessages || isRequestActive}>
      {hasMessages ? (
        <ChatSection
          messages={messages}
          isThinking={isRequestActive}
          currentTask={currentTask}
          isApprovalPending={isApprovalPending}
          supersededBy={supersededBy}
          sseEventLog={thinkingEventLog}
          activeRequestId={pendingRequestId}
          scrollToLatestToken={scrollToLatestToken}
          onEditTask={handleEditTask}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      ) : (
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

      <SearchSection
        key={`${pendingRequestId ?? 'composer'}:${composerAssistMode}:${currentTask?.approval_state ?? 'none'}:${Object.keys(currentTask?.filled_inputs ?? {}).length}:${(currentTask?.missing_inputs ?? []).length}`}
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSearch={handleSearch}
        handleKeyDown={handleKeyDown}
        disabled={isSubmittingMessage}
        activeTask={currentTask}
        activeRequestId={pendingRequestId}
        assistMode={composerAssistMode}
        onSubmitMissingInputs={handleSubmitMissingInputs}
        onDismissAssist={() => setComposerAssistMode('default')}
        onRejectRequest={handleReject}
      />
    </S.Container>
  );
}
