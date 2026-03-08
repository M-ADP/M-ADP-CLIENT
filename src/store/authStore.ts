import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
    step: 'google' | 'github';
    token: string | null;
    setStep: (step: 'google' | 'github') => void;
    setToken: (token: string) => void;
    clearToken: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            step: 'google',
            token: null,
            setStep: (step: 'google' | 'github') => set({ step }),
            setToken: (token: string) => set({ token }),
            clearToken: () => set({ token: null }),
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ step: state.step }),
        }
    )
);