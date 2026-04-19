import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { issuesApi, type CreateIssuePayload, type ListIssuesParams, type UpdateIssuePayload } from '@/api/issues.api';
import { commentsApi, type CreateCommentPayload } from '@/api/comments.api';
import { usersApi } from '@/api/users.api';
import { getErrorMessage } from '@/api/client';
import { QUERY_KEYS } from '@/lib/constants';

export function useIssues(params: ListIssuesParams) {
  return useQuery({
    queryKey: QUERY_KEYS.issuesList(params),
    queryFn: ({ signal }) => issuesApi.list(params, signal),
    placeholderData: (prev) => prev,
  });
}

export function useIssue(id: string | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.issue(id ?? ''),
    queryFn: () => issuesApi.getById(id!),
    enabled: !!id,
  });
}

export function useIssueStats(mineOnly: boolean) {
  return useQuery({
    queryKey: QUERY_KEYS.stats(mineOnly),
    queryFn: () => issuesApi.stats(mineOnly),
    staleTime: 60_000,
  });
}

export function useCreateIssue() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateIssuePayload) => issuesApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.issues });
      toast.success('Issue created');
    },
    onError: (err) => {
      toast.error('Failed to create issue', { description: getErrorMessage(err) });
    },
  });
}

export function useUpdateIssue() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateIssuePayload }) =>
      issuesApi.update(id, payload),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.issues });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.issue(id) });
      toast.success('Issue updated');
    },
    onError: (err) => {
      toast.error('Failed to update issue', { description: getErrorMessage(err) });
    },
  });
}

export function useDeleteIssue() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => issuesApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.issues });
      toast.success('Issue deleted');
    },
    onError: (err) => {
      toast.error('Failed to delete issue', { description: getErrorMessage(err) });
    },
  });
}

export function useComments(issueId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.comments(issueId),
    queryFn: () => commentsApi.list(issueId),
    enabled: !!issueId,
  });
}

export function useCreateComment(issueId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCommentPayload) => commentsApi.create(issueId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.comments(issueId) });
    },
    onError: (err) => {
      toast.error('Failed to post comment', { description: getErrorMessage(err) });
    },
  });
}

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.list(),
    staleTime: 5 * 60_000,
  });
}

export function useDeleteComment(issueId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => commentsApi.delete(issueId, commentId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.comments(issueId) });
    },
    onError: (err) => {
      toast.error('Failed to delete comment', { description: getErrorMessage(err) });
    },
  });
}
