import type { CSSProperties } from 'react';

interface SkeletonProps {
  height?: number | string;
  width?: number | string;
  radius?: number | string;
  style?: CSSProperties;
}

export function Skeleton({ height = 12, width = '100%', radius = 4, style }: SkeletonProps) {
  return <div className="skel" style={{ height, width, borderRadius: radius, ...style }} />;
}

export function IssuesListSkeleton() {
  return (
    <div>
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          style={{
            display: 'grid',
            gridTemplateColumns: '20px 60px 1fr 80px 80px 28px 60px',
            gap: 16,
            padding: '14px 20px',
            borderBottom: '1px solid var(--border)',
            alignItems: 'center',
          }}
        >
          <Skeleton height={14} width={14} radius="50%" />
          <Skeleton height={10} />
          <Skeleton height={12} width={`${40 + (i * 7) % 50}%`} />
          <Skeleton height={18} radius={9} />
          <Skeleton height={18} radius={9} />
          <Skeleton height={20} width={20} radius="50%" />
          <Skeleton height={10} />
        </div>
      ))}
    </div>
  );
}
