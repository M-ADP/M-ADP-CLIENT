import { create } from 'zustand';
import {
  TaskSnapshot,
  SSEPhase,
  SSEEvent,
  isTerminalStatus,
} from '@/types/chatops';

interface ChatState {
  // --- 기존 ---
  activeSessionId: number | null;
  streamingText: string;
  isStreaming: boolean;
  pendingRequestId: number | null;

  // --- SSE 계약 추가 ---
  currentTask: TaskSnapshot | null;
  requestStatus: string | null;
  phase: SSEPhase | null;
  finalResponse: string | null;
  lastSequence: number | null;
  supersededBy: number | null;
  isApprovalPending: boolean;

  // --- 액션 ---
  setActiveSessionId: (id: number | null) => void;
  setPendingRequestId: (id: number | null) => void;
  appendStreamingText: (text: string) => void;
  clearStreamingText: () => void;
  setIsStreaming: (v: boolean) => void;
  setLastSequence: (seq: number) => void;
  setIsApprovalPending: (v: boolean) => void;
  updateFromSSE: (event: SSEEvent) => void;
  resetRequest: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  // --- 기존 ---
  activeSessionId: null,
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

  // --- 기존 액션 ---
  setActiveSessionId: (id) => set({ activeSessionId: id }),
  setPendingRequestId: (id) => set({ pendingRequestId: id }),
  appendStreamingText: (text) =>
    set((state) => ({ streamingText: state.streamingText + text })),
  clearStreamingText: () => set({ streamingText: '' }),
  setIsStreaming: (v) => set({ isStreaming: v }),
  setLastSequence: (seq) => set({ lastSequence: seq }),
  setIsApprovalPending: (v) => set({ isApprovalPending: v }),

  // --- SSE 이벤트 기반 상태 갱신 ---
  updateFromSSE: (event) =>
    set((state) => {
      const eventType = event.type;

      // response.delta: 텍스트 누적만
      if (eventType === 'response.delta') {
        return {
          streamingText: state.streamingText + (event as { text: string }).text,
        };
      }

      const patch: Partial<ChatState> = {};

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
          patch.isStreaming = true;
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
            patch.supersededBy = (event as { superseded_by: number }).superseded_by;
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
    }),
}));
