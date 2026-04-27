'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useQueryClient } from '@tanstack/react-query';
import * as S from './style';
import ChatSection from '@/components/ui/Agent/ChatSection/ui';
import SearchSection from '@/components/ui/Agent/SearchSection/ui';

import { useChatStore } from '@/store/chatStore';
import { useStream } from '@/hooks/chatops/useStream';
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
} from '@/types/chatops';
import { PAUSE_EVENT_TYPES } from '@/utils/chatops';
import { useTypingAnimation } from '@/hooks/chatops/useTypingAnimation';
import { useChatMessages } from '@/hooks/chatops/useChatMessages';

interface AgentClientProps {
  sessionId: number | null;
}

export default function AgentClient({ sessionId }: AgentClientProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    pendingRequestId,
    setPendingRequestId,
    streamingText,
    clearStreamingText,
    resetRequest,
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
  const [composerAssistMode, setComposerAssistMode] = useState<'default' | 'edit'>('default');
  const [scrollToLatestToken, setScrollToLatestToken] = useState(0);
  const { data: sessionDetail } = useSession(sessionId);

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

  useStream(sessionId || 0, pendingRequestId);

  const displayedStreamingText = useTypingAnimation({
    pendingRequestId,
    finalResponse,
    streamingText,
  });

  const { data: requestEvents } = useRequestEvents(sessionId, pendingRequestId);

  const {
    messages,
    effectiveTask,
    thinkingEventLog,
    hasServerSettledMessage,
    lastThinkingEventType,
  } = useChatMessages({
    rawServerMessages: sessionDetail?.messages || [],
    pendingRequestId,
    sseEventLog,
    requestEvents,
    currentTask,
    requestStatus,
    finalResponse,
    displayedStreamingText,
    optimisticMessage,
    isCreatingOrPosting: createSessionMutation.isPending || postMessageMutation.isPending,
  });

  const sendUserMessage = async (rawMessage: string, options?: { clearComposer?: boolean }) => {
    const inputText = rawMessage.trim();
    if (!inputText || isSubmittingMessage) return;

    let targetSessionId = sessionId;

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
        router.replace(`/agent/${targetSessionId}`);
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
      if (sessionId) {
        queryClient.invalidateQueries({ queryKey: chatopsKeys.sessionDetail(sessionId) });
      }
      setPendingRequestId(null);
    }
  }, [requestStatus, pendingRequestId, sessionId, queryClient, setPendingRequestId, displayedStreamingText, finalResponse, streamingText, currentTask]);

  useEffect(() => {
    if (!pendingRequestId || !hasServerSettledMessage) {
      return;
    }

    setIsApprovalPending(false);
    setPendingRequestId(null);
  }, [hasServerSettledMessage, pendingRequestId, setIsApprovalPending, setPendingRequestId]);

  useEffect(() => {
    if (sessionId === null || pendingRequestId === null || !lastThinkingEventType) {
      return;
    }

    if (!PAUSE_EVENT_TYPES.has(lastThinkingEventType)) {
      return;
    }

    void queryClient.invalidateQueries({ queryKey: chatopsKeys.sessionDetail(sessionId) });
    void queryClient.invalidateQueries({
      queryKey: chatopsKeys.requestEvents(sessionId, pendingRequestId),
    });
  }, [sessionId, lastThinkingEventType, pendingRequestId, queryClient]);

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
    if (sessionId === null) return;
    setComposerAssistMode('default');
    setIsApprovalPending(true);
    approveMutation.mutate(
      { sessionId, requestId },
      {
        onSuccess: (response) => {
          const pausedAfterApproval =
            response.status === 'interrupted' ||
            response.task?.approval_state === 'not_ready';
          const completedWithoutStream = isTerminalStatus(response.status);

          bootstrapRequest({
            request_id: response.request_id,
            request_status: response.status,
            final_response: response.assistant_message,
            task: response.task,
          });

          setIsApprovalPending(!(pausedAfterApproval || completedWithoutStream));
          queryClient.invalidateQueries({ queryKey: chatopsKeys.sessionDetail(sessionId) });
          queryClient.invalidateQueries({
            queryKey: chatopsKeys.requestEvents(sessionId, requestId),
          });
          setPendingRequestId(response.request_id);
        },
        onError: () => {
          setIsApprovalPending(false);
        }
      }
    );
  };

  const handleReject = (requestId: number) => {
    if (sessionId === null) return;
    setComposerAssistMode('default');
    rejectMutation.mutate(
      { sessionId, requestId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: chatopsKeys.sessionDetail(sessionId) });
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

  const hasMessages = messages.length > 0;

  return (
    <S.Container isChat={hasMessages || isRequestActive}>
      {hasMessages ? (
        <ChatSection
          messages={messages}
          isThinking={isRequestActive}
          currentTask={effectiveTask}
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
        key={`${pendingRequestId ?? 'composer'}:${composerAssistMode}:${effectiveTask?.approval_state ?? 'none'}:${Object.keys(effectiveTask?.filled_inputs ?? {}).length}:${(effectiveTask?.missing_inputs ?? []).length}`}
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSearch={handleSearch}
        handleKeyDown={handleKeyDown}
        disabled={isSubmittingMessage}
        activeTask={effectiveTask}
        activeRequestId={pendingRequestId}
        assistMode={composerAssistMode}
        onSubmitMissingInputs={handleSubmitMissingInputs}
        onDismissAssist={() => setComposerAssistMode('default')}
        onRejectRequest={handleReject}
      />
    </S.Container>
  );
}
