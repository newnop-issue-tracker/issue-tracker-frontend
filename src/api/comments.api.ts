import { api } from './client';
import type { Comment } from '@/types/api';

export interface CreateCommentPayload {
  body: string;
  parentId?: string;
}

export const commentsApi = {
  async list(issueId: string): Promise<Comment[]> {
    const res = await api.get<{ data: Comment[] }>(`/api/issues/${issueId}/comments`);
    return res.data.data;
  },

  async create(issueId: string, payload: CreateCommentPayload): Promise<Comment> {
    const res = await api.post<{ data: Comment }>(`/api/issues/${issueId}/comments`, payload);
    return res.data.data;
  },

  async delete(issueId: string, commentId: string): Promise<void> {
    await api.delete(`/api/issues/${issueId}/comments/${commentId}`);
  },
};
