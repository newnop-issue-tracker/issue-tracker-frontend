import { create } from 'zustand';
import type { User } from '@/types/api';
import { setAccessToken } from '@/api/client';

interface AuthState {
  user: User | null;
  isInitialized: boolean;
  setAuth: (user: User, accessToken: string) => void;
  setUser: (user: User | null) => void;
  clearAuth: () => void;
  markInitialized: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isInitialized: false,

  setAuth: (user, accessToken) => {
    setAccessToken(accessToken);
    set({ user });
  },

  setUser: (user) => set({ user }),

  clearAuth: () => {
    setAccessToken(null);
    set({ user: null });
  },

  markInitialized: () => set({ isInitialized: true }),
}));

export const useIsAuthenticated = () => useAuthStore((s) => s.user !== null);
