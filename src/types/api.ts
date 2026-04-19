export type Status = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type Severity = 'TRIVIAL' | 'MINOR' | 'MAJOR' | 'CRITICAL';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Author {
  id: string;
  name: string;
  email: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  severity: Severity;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  assigneeId: string | null;
  author: Author;
  assignee: Author | null;
  resolvedBy: Author | null;
  updatedBy: Author | null;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

export interface SingleResponse<T> {
  data: T;
}

export interface IssueStats {
  OPEN: number;
  IN_PROGRESS: number;
  RESOLVED: number;
  CLOSED: number;
  total: number;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface Comment {
  id: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  parentId: string | null;
  author: Author;
  replies: Omit<Comment, 'replies'>[];
}

export interface ApiError {
  error: string;
  code: string;
  details?: Array<{ path: string; message: string }>;
}

export type StatusKey = 'open' | 'progress' | 'resolved' | 'closed';
export type PriorityKey = 'low' | 'medium' | 'high' | 'urgent';
export type SeverityKey = 'trivial' | 'minor' | 'major' | 'critical';

export const statusApiToUi: Record<Status, StatusKey> = {
  OPEN: 'open',
  IN_PROGRESS: 'progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
};
export const statusUiToApi: Record<StatusKey, Status> = {
  open: 'OPEN',
  progress: 'IN_PROGRESS',
  resolved: 'RESOLVED',
  closed: 'CLOSED',
};

export const priorityApiToUi: Record<Priority, PriorityKey> = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
};
export const priorityUiToApi: Record<PriorityKey, Priority> = {
  low: 'LOW',
  medium: 'MEDIUM',
  high: 'HIGH',
  urgent: 'URGENT',
};

export const severityApiToUi: Record<Severity, SeverityKey> = {
  TRIVIAL: 'trivial',
  MINOR: 'minor',
  MAJOR: 'major',
  CRITICAL: 'critical',
};
export const severityUiToApi: Record<SeverityKey, Severity> = {
  trivial: 'TRIVIAL',
  minor: 'MINOR',
  major: 'MAJOR',
  critical: 'CRITICAL',
};
