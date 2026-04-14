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
  } = useChatStore();

  const [inputValue, setInputValue] = useState("");

  const { data: sessionList, isLoading: isSessionsLoading, isError: isSessionsError, error: sessionsError } = useSessions();
  const { data: sessionDetail, isLoading: isDetailLoading, isError: isDetailError } = useSession(activeSessionId);

  const createSessionMutation = useCreateSession();
  const postMessageMutation = usePostMessage();
  const approveMutation = useApproveRequest();
  const rejectMutation = useRejectRequest();

  // 1. 초기 세션 설정
  useEffect(() => {
    if (sessionList && activeSessionId === null) {
      if (sessionList.sessions.length > 0) {
        setActiveSessionId(sessionList.sessions[0].session_id);
      }
      // 세션이 없으면 이제 첫 메시지 전송 시 생성합니다.
    }
  }, [sessionList, activeSessionId, setActiveSessionId]);

  // 4. SSE Stream 훅
  useStream(activeSessionId || 0, pendingRequestId);

  // 5. 스트리밍 종료 시 처리
  useEffect(() => {
    if (!isStreaming && pendingRequestId) {
      if (activeSessionId) {
        queryClient.invalidateQueries({ queryKey: chatopsKeys.sessionDetail(activeSessionId) });
      }
      setPendingRequestId(null);
    }
  }, [isStreaming, pendingRequestId, activeSessionId, queryClient, setPendingRequestId]);

  // 전송 핸들러
  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isStreaming) return;

    let targetSessionId = activeSessionId;

    try {
      // 세션이 없으면 메시지 전송 직전에 새로 생성
      if (!targetSessionId) {
        const newSession = await createSessionMutation.mutateAsync({ title: inputValue.slice(0, 20) });
        targetSessionId = newSession.session_id;
        setActiveSessionId(targetSessionId);
      }

      postMessageMutation.mutate(
        { sessionId: targetSessionId, message: inputValue.trim() },
        {
          onSuccess: (res) => {
            const msgsWithReqId = res.messages.filter((m) => m.request_id !== null);
            const targetMsg = msgsWithReqId[msgsWithReqId.length - 1];
            
            if (targetMsg?.request_id) {
              setPendingRequestId(targetMsg.request_id);
            }
            
            clearStreamingText();
            queryClient.invalidateQueries({ queryKey: chatopsKeys.sessionDetail(targetSessionId) });
            queryClient.invalidateQueries({ queryKey: chatopsKeys.sessions() });
          },
          onError: (error) => {
            console.error('[ChatOps] POST message error:', error);
          }
        }
      );
      setInputValue("");
    } catch (error) {
      console.error('[ChatOps] Failed to create session or send message', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      handleSearch();
    }
  };

  const handleApprove = (requestId: number) => {
    if (activeSessionId === null || activeSessionId === undefined) return;
    approveMutation.mutate(
      { sessionId: activeSessionId, requestId },
      {
        onSuccess: () => {
           queryClient.invalidateQueries({ queryKey: chatopsKeys.sessionDetail(activeSessionId) });
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

  const messages = sessionDetail?.messages || [];
  const hasMessages = messages.length > 0;

  return (
    <S.Container isChat={hasMessages || isStreaming}>
      {hasMessages ? (
        <ChatSection
          messages={messages}
          streamingText={streamingText}
          isStreaming={isStreaming}
          activeSessionId={activeSessionId || 0}
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
          {isLoading && <div style={{ marginTop: '20px', color: '#64748b' }}>로딩 중...</div>}
          {isSessionsError && <div style={{ marginTop: '20px', color: '#ef4444' }}>세션 목록 통신 실패 (API 백엔드를 확인해주세요)</div>}
          {createSessionMutation.isError && <div style={{ marginTop: '20px', color: '#ef4444' }}>새 세션 생성 실패 (API 백엔드를 확인해주세요)</div>}
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
