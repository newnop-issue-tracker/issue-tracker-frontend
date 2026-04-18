import { useNavigate } from 'react-router-dom';
import { useMemo, type ReactNode } from 'react';
import { Avatar } from '@/components/UI/Avatar';
import { Button } from '@/components/UI/Button';
import { Icon } from '@/components/UI/Icon';
import { PriorityBadge, StatusIcon } from '@/components/UI/Badge';
import { useIssues, useIssueStats } from '@/features/issues/hooks';
import { useAuthStore } from '@/store/authStore';
import { useTicker } from '@/hooks/useTicker';
import { timeAgo, truncate } from '@/lib/formatters';
import { priorityApiToUi, statusApiToUi } from '@/types/api';

interface StatCardProps {
  label: string;
  count: number;
  trend: string;
  icon: ReactNode;
  accent: { bg: string; fg: string };
  loading?: boolean;
}

function StatCard({ label, count, trend, icon, accent, loading }: StatCardProps) {
  return (
    <div className="card stat-card">
      <div className="stat-label">
        <span className="stat-icon" style={{ background: accent.bg, color: accent.fg }}>
          {icon}
        </span>
        {label}
      </div>
      <div className="stat-num">{loading ? '—' : count}</div>
      <div className="stat-trend">{trend}</div>
    </div>
  );
}

interface DashboardPageProps {
  onCreate: () => void;
}

export function DashboardPage({ onCreate }: DashboardPageProps) {
  useTicker(20_000);
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const stats = useIssueStats(false);
  const recent = useIssues({ page: 1, limit: 6, sortBy: 'updatedAt', sortOrder: 'desc' });
  const mine = useIssues({ page: 1, limit: 3, sortBy: 'updatedAt', sortOrder: 'desc' });

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);
  const firstName = user?.name.split(' ')[0] ?? 'there';

  const statData = stats.data;

  return (
    <div className="main-wrap">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            {greeting}, {firstName}
          </h1>
          <p className="page-subtitle">Here's what's happening across the project.</p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={onCreate}
          icon={<Icon.Plus size={14} />}
        >
          New issue
        </Button>
      </div>

      <div className="stat-grid">
        <StatCard
          label="Open"
          count={statData?.OPEN ?? 0}
          trend="active issues"
          loading={stats.isLoading}
          icon={<Icon.Inbox size={14} />}
          accent={{ bg: 'var(--status-open-bg)', fg: 'var(--status-open)' }}
        />
        <StatCard
          label="In Progress"
          count={statData?.IN_PROGRESS ?? 0}
          trend="being worked on"
          loading={stats.isLoading}
          icon={<Icon.Bolt size={14} />}
          accent={{ bg: 'var(--status-prog-bg)', fg: 'var(--status-prog)' }}
        />
        <StatCard
          label="Resolved"
          count={statData?.RESOLVED ?? 0}
          trend="fixed"
          loading={stats.isLoading}
          icon={<Icon.CheckCircle size={14} />}
          accent={{ bg: 'var(--status-resolved-bg)', fg: 'var(--status-resolved)' }}
        />
        <StatCard
          label="Total"
          count={statData?.total ?? 0}
          trend="all time"
          loading={stats.isLoading}
          icon={<Icon.Hash size={14} />}
          accent={{ bg: 'var(--bg-muted)', fg: 'var(--fg-muted)' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
        <div>
          <div
            className="row-sb"
            style={{ marginBottom: 12 }}
          >
            <div style={{ fontWeight: 600, fontSize: 14 }}>Recent activity</div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/issues')}
            >
              View all →
            </Button>
          </div>

          <div className="card" style={{ overflow: 'hidden' }}>
            {recent.isLoading ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--fg-subtle)' }}>
                Loading…
              </div>
            ) : (recent.data?.data ?? []).length === 0 ? (
              <div className="empty">
                <Icon.Inbox size={36} />
                <div className="empty-title" style={{ marginTop: 8 }}>
                  No issues yet
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onCreate}
                  style={{ marginTop: 12 }}
                >
                  Create the first one
                </Button>
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ width: 28 }}></th>
                    <th style={{ width: 80 }}>ID</th>
                    <th>Title</th>
                    <th style={{ width: 90 }}>Priority</th>
                    <th style={{ width: 36 }}>By</th>
                    <th style={{ width: 80 }}>Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {(recent.data?.data ?? []).map((issue) => (
                    <tr
                      key={issue.id}
                      onClick={() => navigate(`/issues/${issue.id}`)}
                    >
                      <td>
                        <StatusIcon status={statusApiToUi[issue.status]} />
                      </td>
                      <td className="mono text-xs text-subtle">
                        {issue.id.slice(0, 8)}
                      </td>
                      <td>
                        <span className="truncate" style={{ maxWidth: 300, fontWeight: 500, display: 'block' }}>
                          {truncate(issue.title, 60)}
                        </span>
                      </td>
                      <td>
                        <PriorityBadge priority={priorityApiToUi[issue.priority]} />
                      </td>
                      <td>
                        <Avatar user={issue.author} />
                      </td>
                      <td className="text-xs text-subtle mono">
                        {timeAgo(issue.updatedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>
            My open issues
          </div>
          <div className="stack gap-3">
            {mine.isLoading ? (
              <div className="card" style={{ padding: 20, color: 'var(--fg-subtle)', fontSize: 13 }}>
                Loading…
              </div>
            ) : (mine.data?.data ?? []).filter((i) => i.authorId === user?.id && i.status === 'OPEN').length === 0 ? (
              <div className="card" style={{ padding: 20 }}>
                <div className="empty" style={{ padding: '16px 0' }}>
                  <Icon.CheckCircle size={28} />
                  <div className="empty-title" style={{ fontSize: 13, marginTop: 6 }}>
                    All clear!
                  </div>
                </div>
              </div>
            ) : (
              (mine.data?.data ?? [])
                .filter((i) => i.authorId === user?.id && i.status === 'OPEN')
                .map((issue) => (
                  <div
                    key={issue.id}
                    className="card"
                    style={{ padding: '14px 16px', cursor: 'pointer' }}
                    onClick={() => navigate(`/issues/${issue.id}`)}
                  >
                    <div className="row gap-2 mb-2">
                      <StatusIcon status={statusApiToUi[issue.status]} size={12} />
                      <span className="mono text-xs text-subtle">{issue.id.slice(0, 8)}</span>
                      <PriorityBadge priority={priorityApiToUi[issue.priority]} />
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.4 }}>
                      {truncate(issue.title, 60)}
                    </div>
                    <div className="text-xs text-subtle mt-2">
                      {timeAgo(issue.updatedAt)}
                    </div>
                  </div>
                ))
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/issues')}
              style={{ width: '100%' }}
            >
              Browse all issues →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
