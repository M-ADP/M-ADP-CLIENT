import { useMemo } from 'react';
import {
  ConversationMessage,
  RequestEventsResponse,
  SSEEvent,
  SSEEventRecord,
  TaskSnapshot,
} from '@/types/chatops';
import { normalizeSSEEvent } from '@/services/chatops/chatops.sse';
import {
  createFallbackTask,
  getLatestAssistantMessage,
  getLatestTaskFromEvents,
  getLatestTaskFromMessages,
  isTerminalApprovalState,
  taskNeedsUserAction,
} from '@/utils/chatops';

interface UseChatMessagesParams {
  rawServerMessages: ConversationMessage[];
  pendingRequestId: string | null;
  sseEventLog: SSEEventRecord[];
  requestEvents: RequestEventsResponse | undefined;
  currentTask: TaskSnapshot | null;
  requestStatus: string | null;
  finalResponse: string | null;
  displayedStreamingText: string;
  optimisticMessage: ConversationMessage | null;
  isCreatingOrPosting: boolean;
}

interface UseChatMessagesResult {
  messages: ConversationMessage[];
  effectiveTask: TaskSnapshot | null;
  thinkingEventLog: SSEEventRecord[];
  hasServerSettledMessage: boolean;
  lastThinkingEventType: string | null;
}

export function useChatMessages({
  rawServerMessages,
  pendingRequestId,
  sseEventLog,
  requestEvents,
  currentTask,
  requestStatus,
  finalResponse,
  displayedStreamingText,
  optimisticMessage,
  isCreatingOrPosting,
}: UseChatMessagesParams): UseChatMessagesResult {
  return useMemo(() => {
    const latestServerAssistantMessage =
      pendingRequestId !== null
        ? getLatestAssistantMessage(rawServerMessages, pendingRequestId)
        : null;
    const hasServerSettledMessage =
      latestServerAssistantMessage !== null &&
      !taskNeedsUserAction(latestServerAssistantMessage.task) &&
      (
        Boolean(latestServerAssistantMessage.text?.trim()) ||
        isTerminalApprovalState(latestServerAssistantMessage.task)
      );

    const serverMessages =
      pendingRequestId !== null
        ? rawServerMessages.filter(
            (message) => !(message.request_id === pendingRequestId && message.role === 'assistant')
          )
        : rawServerMessages;

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
    const lastThinkingEvent = thinkingEventLog.at(-1)?.event ?? null;
    const lastThinkingEventType = lastThinkingEvent?.type ?? null;

    const shouldPreferAssistantMessage =
      requestStatus === 'interrupted' &&
      Boolean(finalResponse) &&
      currentTask === null;
    const taskFromSources =
      shouldPreferAssistantMessage
        ? null
        : currentTask
          ?? getLatestTaskFromEvents(sseEventLog, pendingRequestId)
          ?? getLatestTaskFromEvents(historyEventLog, pendingRequestId)
          ?? getLatestTaskFromMessages(rawServerMessages, pendingRequestId);
    const effectiveTask =
      taskFromSources
      ?? createFallbackTask(
        lastThinkingEventType,
        lastThinkingEvent && 'message' in lastThinkingEvent ? lastThinkingEvent.message ?? null : null
      );

    const messages: ConversationMessage[] = [...serverMessages];

    if (optimisticMessage) {
      messages.push(optimisticMessage);
    }

    if (pendingRequestId) {
      const liveText = displayedStreamingText;

      messages.push({
        message_id: `sse-live-${pendingRequestId}`,
        request_id: pendingRequestId,
        role: 'assistant' as const,
        type: (effectiveTask ? 'task' : 'text') as 'text' | 'task',
        text: liveText || null,
        task: effectiveTask,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    if (isCreatingOrPosting && pendingRequestId === null) {
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

    return {
      messages,
      effectiveTask,
      thinkingEventLog,
      hasServerSettledMessage,
      lastThinkingEventType,
    };
  }, [
    rawServerMessages,
    pendingRequestId,
    sseEventLog,
    requestEvents,
    currentTask,
    requestStatus,
    finalResponse,
    displayedStreamingText,
    optimisticMessage,
    isCreatingOrPosting,
  ]);
}
