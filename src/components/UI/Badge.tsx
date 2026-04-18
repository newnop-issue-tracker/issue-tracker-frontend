import type { ReactNode } from 'react';
import type { PriorityKey, StatusKey } from '@/types/api';
import { PRIORITY_META, STATUS_META } from '@/lib/constants';

interface BadgeProps {
  variant: string;
  children: ReactNode;
  icon?: ReactNode;
}

export function Badge({ variant, children, icon }: BadgeProps) {
  return (
    <span className={`badge badge-${variant}`}>
      <span className="badge-dot-indicator" />
      {icon}
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: StatusKey }) {
  return <Badge variant={status}>{STATUS_META[status].label}</Badge>;
}

export function PriorityBadge({ priority }: { priority: PriorityKey }) {
  return <Badge variant={priority}>{PRIORITY_META[priority]}</Badge>;
}

export function StatusIcon({ status, size = 16 }: { status: StatusKey; size?: number }) {
  const colorMap: Record<StatusKey, string> = {
    open: 'var(--status-open)',
    progress: 'var(--status-prog)',
    resolved: 'var(--status-resolved)',
    closed: 'var(--status-closed)',
  };
  const color = colorMap[status];

  return (
    <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden>
      <circle cx="8" cy="8" r="6" fill="none" stroke={color} strokeWidth="1.5" />
      {status === 'progress' && (
        <path d="M 8 8 L 8 3 A 5 5 0 0 1 13 8 Z" fill={color} />
      )}
      {status === 'resolved' && (
        <path
          d="M5 8l2 2 4-4"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {status === 'closed' && (
        <path
          d="M5 5l6 6M11 5l-6 6"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      )}
      {status === 'open' && <circle cx="8" cy="8" r="2" fill={color} />}
    </svg>
  );
}
