import { create } from 'zustand';

interface NavigationState {
  pendingCount: number;
  start: () => void;
  finish: () => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  pendingCount: 0,
  start: () => set((state) => ({ pendingCount: state.pendingCount + 1 })),
  finish: () => set((state) => ({ pendingCount: Math.max(0, state.pendingCount - 1) })),
}));
