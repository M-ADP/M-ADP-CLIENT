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
  useSessions,
  useSession,
  chatopsKeys
} from '@/services/chatops/chatops.query';
import {
  usePostMessage,
  useApproveRequest,
  useRejectRequest,
  useCreateSession
} from '@/services/chatops/chatops.mutation';
import { isTerminalStatus } from '@/types/chatops';

export default function AgentPage() {
  const queryClient = useQueryClient();

  const {
    activeSessionId,
    setActiveSessionId,
    pendingRequestId,
    setPendingRequestId,
    isStreaming,
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
  } = useChatStore();

  const [inputValue, setInputValue] = useState("");
  const [optimisticMessage, setOptimisticMessage] = useState<any>(null);

  const { data: sessionList, isLoading: isSessionsLoading, isError: isSessionsError } = useSessions();
  const { data: sessionDetail, isLoading: isDetailLoading } = useSession(activeSessionId);

  const createSessionMutation = useCreateSession();
  const postMessageMutation = usePostMessage();
  const approveMutation = useApproveRequest();
  const rejectMutation = useRejectRequest();

  // SSE Stream 훅
  useStream(activeSessionId || 0, pendingRequestId);

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
    const inputText = inputValue.trim();
    if (!inputText || isStreaming) return;

    let targetSessionId = activeSessionId;

    // 입력창 즉시 초기화 (빠른 반응성)
    setInputValue("");

    // 이전 요청 상태 초기화
    resetRequest();

    // 로컬 상태로 즉시 화면에 노출 (안전하고 빠름)
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
      // 세션이 없으면 메시지 전송 직전에 새로 생성
      if (!targetSessionId) {
        const newSession = await createSessionMutation.mutateAsync({ title: inputText.slice(0, 20) });
        targetSessionId = newSession.session_id;
        setActiveSessionId(targetSessionId);
      }

      postMessageMutation.mutate(
        { sessionId: targetSessionId, message: inputText },
        {
          onSuccess: async (res) => {
            const msgsWithReqId = res.messages.filter((m: any) => m.request_id !== null);
            const targetMsg = msgsWithReqId[msgsWithReqId.length - 1];

            if (targetMsg?.request_id) {
              setPendingRequestId(targetMsg.request_id);
            }

            clearStreamingText();
            // 서버 데이터가 도착한 뒤에 optimistic 메시지를 제거해야 깜빡임이 없다
            await queryClient.invalidateQueries({ queryKey: chatopsKeys.sessionDetail(targetSessionId) });
            setOptimisticMessage(null);
            queryClient.invalidateQueries({ queryKey: chatopsKeys.sessions() });
          },
          onError: (error) => {
            console.error('[ChatOps] POST message error:', error);
            setOptimisticMessage(null); // 실패 시 가짜 메시지 롤백
          }
        }
      );
    } catch (error) {
      console.error('[ChatOps] Failed to create session or send message', error);
      setOptimisticMessage(null); // 통신 에러 시 가짜 메시지 롤백
    }
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

  const isLoading =
    isSessionsLoading ||
    (activeSessionId && isDetailLoading) ||
    (sessionList && sessionList.sessions.length === 0 && createSessionMutation.isPending) ||
    (!isSessionsError && !createSessionMutation.isError && (activeSessionId === null || activeSessionId === undefined));

  // --- 메시지 리스트 조합 ---
  const serverMessages = sessionDetail?.messages || [];
  const messages = [...serverMessages];

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

    if (!hasServerResponse && (liveText || isStreaming)) {
      messages.push({
        message_id: `sse-live-${pendingRequestId}`,
        request_id: pendingRequestId,
        role: 'assistant' as const,
        type: (currentTask ? 'task' : 'text') as 'text' | 'task',
        text: liveText || '...',
        task: currentTask,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
  }

  const hasMessages = messages.length > 0;

  return (
    <S.Container isChat={hasMessages || isStreaming}>
      {hasMessages ? (
        <ChatSection
          messages={messages}
          streamingText={streamingText}
          isStreaming={isStreaming}
          activeSessionId={activeSessionId || 0}
          currentTask={currentTask}
          finalResponse={finalResponse}
          isApprovalPending={isApprovalPending}
          supersededBy={supersededBy}
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
        disabled={isStreaming}
      />
    </S.Container>
  );
}
