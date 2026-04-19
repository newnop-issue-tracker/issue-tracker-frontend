import { api } from './client';
import type {
  Issue,
  IssueStats,
  PaginatedResponse,
  Priority,
  Severity,
  SingleResponse,
  Status,
} from '@/types/api';

export interface ListIssuesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: Status;
  priority?: Priority;
  severity?: Severity;
  sortBy?: 'createdAt' | 'updatedAt' | 'priority' | 'status';
  sortOrder?: 'asc' | 'desc';
  assignedToMe?: boolean;
}

export interface CreateIssuePayload {
  title: string;
  description: string;
  priority?: Priority;
  severity?: Severity;
  status?: Status;
  assigneeId?: string | null;
}

export type UpdateIssuePayload = Partial<CreateIssuePayload>;

export const issuesApi = {
  async list(
    params: ListIssuesParams,
    signal?: AbortSignal,
  ): Promise<PaginatedResponse<Issue>> {
    const res = await api.get<PaginatedResponse<Issue>>('/api/issues', {
      params,
      signal,
    });
    return res.data;
  },

  async getById(id: string): Promise<Issue> {
    const res = await api.get<SingleResponse<Issue>>(`/api/issues/${id}`);
    return res.data.data;
  },

  async create(payload: CreateIssuePayload): Promise<Issue> {
    const res = await api.post<SingleResponse<Issue>>('/api/issues', payload);
    return res.data.data;
  },

  async update(id: string, payload: UpdateIssuePayload): Promise<Issue> {
    const res = await api.patch<SingleResponse<Issue>>(`/api/issues/${id}`, payload);
    return res.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/api/issues/${id}`);
  },

  async stats(mineOnly = false): Promise<IssueStats> {
    const res = await api.get<SingleResponse<IssueStats>>('/api/issues/stats', {
      params: { mine: mineOnly ? 'true' : undefined },
    });
    return res.data.data;
  },
};
