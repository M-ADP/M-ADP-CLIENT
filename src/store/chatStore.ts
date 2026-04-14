import { create } from 'zustand';

interface ChatState {
  activeSessionId: number | null;
  streamingText: string;
  isStreaming: boolean;
  pendingRequestId: number | null;
  setActiveSessionId: (id: number | null) => void;
  setPendingRequestId: (id: number | null) => void;
  appendStreamingText: (text: string) => void;
  clearStreamingText: () => void;
  setIsStreaming: (v: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  activeSessionId: null,
  streamingText: '',
  isStreaming: false,
  pendingRequestId: null,
  setActiveSessionId: (id) => set({ activeSessionId: id }),
  setPendingRequestId: (id) => set({ pendingRequestId: id }),
  appendStreamingText: (text) =>
    set((state) => ({ streamingText: state.streamingText + text })),
  clearStreamingText: () => set({ streamingText: '' }),
  setIsStreaming: (v) => set({ isStreaming: v }),
}));
