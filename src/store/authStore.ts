import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
    step: 'google' | 'github';
    setStep: (step: 'google' | 'github') => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            step: 'google',
            setStep: (step: 'google' | 'github') => set({ step }),
        }),
        {
            name: 'auth-storage',
        }
    )
);