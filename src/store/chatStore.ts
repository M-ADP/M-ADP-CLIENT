import { create } from 'zustand';
import {
  TaskSnapshot,
  SSEPhase,
  SSEEvent,
  SSEEventRecord,
  CreateSessionMessageResponse,
} from '@/types/chatops';

interface ChatState {
  // --- 기존 ---
  hiddenDeletedSessionIds: string[];
  streamingText: string;
  isStreaming: boolean;
  pendingRequestId: string | null;

  // --- SSE 계약 추가 ---
  currentTask: TaskSnapshot | null;
  requestStatus: string | null;
  phase: SSEPhase | null;
  finalResponse: string | null;
  lastSequence: string | null;
  supersededBy: string | null;
  isApprovalPending: boolean;

  // --- SSE 이벤트 로그 (ThinkingPanel용) ---
  sseEventLog: SSEEventRecord[];

  // --- 액션 ---
  hideDeletedSession: (id: string) => void;
  restoreDeletedSession: (id: string) => void;
  setPendingRequestId: (id: string | null) => void;
  appendStreamingText: (text: string) => void;
  clearStreamingText: () => void;
  setIsStreaming: (v: boolean) => void;
  setIsApprovalPending: (v: boolean) => void;
  bootstrapRequest: (payload: Pick<CreateSessionMessageResponse, 'request_id' | 'request_status' | 'final_response' | 'task'>) => void;
  updateFromSSE: (event: SSEEvent, sequence?: string | null) => void;
  resetRequest: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  // --- 기존 ---
  hiddenDeletedSessionIds: [],
  streamingText: '',
  isStreaming: false,
  pendingRequestId: null,

  // --- SSE 계약 추가 ---
  currentTask: null,
  requestStatus: null,
  phase: null,
  finalResponse: null,
  lastSequence: null,
  supersededBy: null,
  isApprovalPending: false,

  // --- SSE 이벤트 로그 ---
  sseEventLog: [],

  // --- 기존 액션 ---
  hideDeletedSession: (id) =>
    set((state) => ({
      hiddenDeletedSessionIds: state.hiddenDeletedSessionIds.includes(id)
        ? state.hiddenDeletedSessionIds
        : [...state.hiddenDeletedSessionIds, id],
    })),
  restoreDeletedSession: (id) =>
    set((state) => ({
      hiddenDeletedSessionIds: state.hiddenDeletedSessionIds.filter((sessionId) => sessionId !== id),
    })),
  setPendingRequestId: (id) => set({ pendingRequestId: id }),
  appendStreamingText: (text) =>
    set((state) => ({ streamingText: state.streamingText + text })),
  clearStreamingText: () => set({ streamingText: '' }),
  setIsStreaming: (v) => set({ isStreaming: v }),
  setIsApprovalPending: (v) => set({ isApprovalPending: v }),
  bootstrapRequest: (payload) =>
    set((state) => ({
      pendingRequestId:
        Object.prototype.hasOwnProperty.call(payload, 'request_id')
          ? payload.request_id ?? null
          : state.pendingRequestId,
      requestStatus:
        Object.prototype.hasOwnProperty.call(payload, 'request_status')
          ? payload.request_status ?? null
          : state.requestStatus,
      finalResponse:
        Object.prototype.hasOwnProperty.call(payload, 'final_response')
          ? payload.final_response ?? null
          : state.finalResponse,
      currentTask:
        Object.prototype.hasOwnProperty.call(payload, 'task')
          ? payload.task ?? null
          : state.currentTask,
    })),

  // --- SSE 이벤트 기반 상태 갱신 ---
  updateFromSSE: (event, sequence) =>
    set((state) => {
      const eventType = event.type;
      const normalizedSequence = sequence ?? null;

      if (
        normalizedSequence !== null &&
        state.lastSequence !== null &&
        BigInt(normalizedSequence) <= BigInt(state.lastSequence)
      ) {
        return state;
      }

      const patch: Partial<ChatState> = {
        lastSequence: normalizedSequence ?? state.lastSequence,
      };

      // response.delta: 텍스트만 누적하고 패널 로그에는 남기지 않는다.
      if (eventType === 'response.delta' || eventType === 'response_delta') {
        return {
          ...patch,
          streamingText: state.streamingText + (event as { text: string }).text,
        };
      }

      patch.sseEventLog = [
        ...state.sseEventLog,
        { sequence: normalizedSequence, event },
      ];

      // task가 있으면 merge
      if ('task' in event && event.task) {
        patch.currentTask = event.task;
      }

      // 구조화 이벤트 공통 필드
      if ('status' in event && event.status) {
        patch.requestStatus = event.status;
      }
      if ('phase' in event && event.phase) {
        patch.phase = event.phase as SSEPhase;
      }
      if ('final_response' in event && event.final_response) {
        patch.finalResponse = event.final_response;
      }

      // 이벤트별 특수 처리
      switch (eventType) {
        case 'response.started':
        case 'response_stream_start':
          patch.isStreaming = true;
          break;

        case 'approval.required':
        case 'request.ambiguous':
        case 'request.input_required':
          patch.isStreaming = false;
          break;

        case 'execution.started':
          patch.isApprovalPending = true;
          break;

        case 'response.completed':
          patch.isStreaming = false;
          // final_response로 streamingText 치환
          if ('final_response' in event && event.final_response) {
            patch.streamingText = event.final_response;
          }
          break;

        case 'request.failed':
          patch.isStreaming = false;
          break;

        case 'execution.completed':
        case 'execution.failed':
          patch.isApprovalPending = false;
          patch.isStreaming = false;
          break;

        case 'approval.rejected':
          patch.isApprovalPending = false;
          break;

        case 'approval.superseded':
          if ('superseded_by' in event) {
            patch.supersededBy = String((event as { superseded_by: string }).superseded_by);
          }
          break;
      }

      return patch;
    }),

  // --- 요청 전환 시 초기화 ---
  resetRequest: () =>
    set({
      streamingText: '',
      isStreaming: false,
      pendingRequestId: null,
      currentTask: null,
      requestStatus: null,
      phase: null,
      finalResponse: null,
      lastSequence: null,
      supersededBy: null,
      isApprovalPending: false,
      sseEventLog: [],
    }),
}));
