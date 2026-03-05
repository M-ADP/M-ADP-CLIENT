import { create } from 'zustand';

interface AuthState {
    step: 'google' | 'github';
    setStep: (step: 'google' | 'github') => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    step: 'google',
    setStep: (step: 'google' | 'github') => set({ step }),
}));