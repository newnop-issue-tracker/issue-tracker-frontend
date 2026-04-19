import { api } from './client';
import type { Author } from '@/types/api';

export const usersApi = {
  async list(): Promise<Author[]> {
    const res = await api.get<{ data: Author[] }>('/api/users');
    return res.data.data;
  },
};
