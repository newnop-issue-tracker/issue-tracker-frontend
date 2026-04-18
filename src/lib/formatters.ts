import { formatDistanceToNow } from 'date-fns';

export function timeAgo(iso: string | number | Date): string {
  const date = typeof iso === 'string' || typeof iso === 'number' ? new Date(iso) : iso;
  const full = formatDistanceToNow(date, { addSuffix: true });
  return full
    .replace(/about /, '')
    .replace(/less than a minute ago/, 'just now')
    .replace(/ minutes?/, 'm')
    .replace(/ hours?/, 'h')
    .replace(/ days?/, 'd')
    .replace(/ months?/, 'mo')
    .replace(/ years?/, 'y')
    .replace(/ ago/, ' ago');
}

export function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

const AVATAR_COLORS = [
  '#4F46E5', '#0EA5E9', '#D946EF', '#F59E0B',
  '#10B981', '#EF4444', '#8B5CF6', '#EC4899',
];
export function colorForUser(idOrEmail: string): string {
  let hash = 0;
  for (let i = 0; i < idOrEmail.length; i++) {
    hash = (hash * 31 + idOrEmail.charCodeAt(i)) | 0;
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]!;
}

export function truncate(s: string, n: number): string {
  return s.length <= n ? s : s.slice(0, n - 1) + '…';
}
