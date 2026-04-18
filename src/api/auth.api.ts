import { api, setAccessToken } from './client';
import type { AuthResponse, User } from '@/types/api';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
}

export const authApi = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/api/auth/login', payload);
    setAccessToken(res.data.accessToken);
    return res.data;
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/api/auth/register', payload);
    setAccessToken(res.data.accessToken);
    return res.data;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/api/auth/logout');
    } finally {
      setAccessToken(null);
    }
  },

  async me(): Promise<{ user: User }> {
    const res = await api.get<{ user: User }>('/api/auth/me');
    return res.data;
  },
};
