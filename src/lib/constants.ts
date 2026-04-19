import type { StatusKey, PriorityKey, SeverityKey } from '@/types/api';

export const STATUS_META: Record<StatusKey, { label: string }> = {
  open: { label: 'Open' },
  progress: { label: 'In Progress' },
  resolved: { label: 'Resolved' },
  closed: { label: 'Closed' },
};

export const PRIORITY_META: Record<PriorityKey, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

export const SEVERITY_META: Record<SeverityKey, string> = {
  trivial: 'Trivial',
  minor: 'Minor',
  major: 'Major',
  critical: 'Critical',
};

export const STATUS_OPTIONS: StatusKey[] = ['open', 'progress', 'resolved', 'closed'];
export const PRIORITY_OPTIONS: PriorityKey[] = ['urgent', 'high', 'medium', 'low'];
export const SEVERITY_OPTIONS: SeverityKey[] = ['critical', 'major', 'minor', 'trivial'];

export const QUERY_KEYS = {
  auth: ['auth'] as const,
  me: ['auth', 'me'] as const,
  issues: ['issues'] as const,
  issuesList: (filters: unknown) => ['issues', 'list', filters] as const,
  issue: (id: string) => ['issues', 'detail', id] as const,
  stats: (mine: boolean) => ['issues', 'stats', { mine }] as const,
  comments: (issueId: string) => ['comments', issueId] as const,
};
