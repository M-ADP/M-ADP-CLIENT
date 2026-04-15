'use client';

import { useState, useEffect } from 'react';
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
    supersededBy,
    sseEventLog,
  } = useChatStore();

  const [inputValue, setInputValue] = useState("");
  const [optimisticMessage, setOptimisticMessage] = useState<ConversationMessage | null>(null);
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

            if (targetMsg?.request_id) {
              setPendingRequestId(targetMsg.request_id);
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
    if (pendingRequestId && requestStatus && isTerminalStatus(requestStatus)) {
      if (activeSessionId) {
        queryClient.invalidateQueries({ queryKey: chatopsKeys.sessionDetail(activeSessionId) });
      }
      setPendingRequestId(null);
    }
  }, [requestStatus, pendingRequestId, activeSessionId, queryClient, setPendingRequestId]);

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
    void sendUserMessage(message);
  };

  // --- 메시지 리스트 조합 ---
  const serverMessages = sessionDetail?.messages || [];
  const messages = [...serverMessages];
  const { data: requestEvents } = useRequestEvents(activeSessionId, pendingRequestId);

  const historyEventLog: SSEEventRecord[] =
    requestEvents?.items
      .filter((item) => item.type !== 'response.delta')
      .map((item) => ({
        sequence: item.sequence,
        event: item.data as unknown as SSEEvent,
      })) ?? [];

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
    const hasServerResponse = serverMessages.some(
      (m) => m.request_id === pendingRequestId && m.role === 'assistant'
    );
    const liveText = finalResponse || streamingText;

    if (!hasServerResponse) {
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
          isMessageSubmitting={isSubmittingMessage}
          currentTask={currentTask}
          isApprovalPending={isApprovalPending}
          supersededBy={supersededBy}
          sseEventLog={thinkingEventLog}
          onSubmitMissingInputs={handleSubmitMissingInputs}
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
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSearch={handleSearch}
        handleKeyDown={handleKeyDown}
        disabled={isSubmittingMessage}
      />
    </S.Container>
  );
}
