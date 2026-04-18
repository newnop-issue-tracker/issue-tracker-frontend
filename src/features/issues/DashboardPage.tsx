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
  accent: { bg: string; fg: string; bar: string };
  loading?: boolean;
}

function StatCard({ label, count, trend, icon, accent, loading }: StatCardProps) {
  return (
    <div
      className="card stat-card"
      style={{ borderTop: `3px solid ${accent.bar}` }}
    >
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
  const mine = useIssues({ page: 1, limit: 6, sortBy: 'updatedAt', sortOrder: 'desc' });

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);
  const firstName = user?.name.split(' ')[0] ?? 'there';
  const statData = stats.data;

  const myOpenIssues = (mine.data?.data ?? []).filter(
    (i) => i.authorId === user?.id && i.status === 'OPEN',
  );

  return (
    <div className="main-wrap">
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1
              style={{
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: '-0.02em',
                margin: 0,
                color: 'var(--fg)',
                fontFamily: 'var(--font-heading)',
              }}
            >
              {greeting},{' '}
              <span style={{ color: 'var(--accent)' }}>{firstName}</span>
            </h1>
            <p style={{ color: 'var(--fg-muted)', fontSize: 12, marginTop: 3, fontFamily: 'var(--font-sans)' }}>
              Here's what's happening across the project today.
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={onCreate} icon={<Icon.Plus size={13} />}>
            New issue
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="stat-grid">
        <StatCard
          label="Open"
          count={statData?.OPEN ?? 0}
          trend="active issues"
          loading={stats.isLoading}
          icon={<Icon.Inbox size={13} />}
          accent={{ bg: '#EFF4FF', fg: '#2563EB', bar: '#2563EB' }}
        />
        <StatCard
          label="In Progress"
          count={statData?.IN_PROGRESS ?? 0}
          trend="being worked on"
          loading={stats.isLoading}
          icon={<Icon.Bolt size={13} />}
          accent={{ bg: '#FEF5E7', fg: '#B45309', bar: '#F59E0B' }}
        />
        <StatCard
          label="Resolved"
          count={statData?.RESOLVED ?? 0}
          trend="completed"
          loading={stats.isLoading}
          icon={<Icon.CheckCircle size={13} />}
          accent={{ bg: '#ECFDF3', fg: '#15803D', bar: '#22C55E' }}
        />
        <StatCard
          label="Total"
          count={statData?.total ?? 0}
          trend="all time"
          loading={stats.isLoading}
          icon={<Icon.Hash size={13} />}
          accent={{ bg: 'var(--bg-muted)', fg: 'var(--fg-muted)', bar: 'var(--border-strong)' }}
        />
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16 }}>

        {/* Recent Activity */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: 'var(--fg)',
                fontFamily: 'var(--font-heading)',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Icon.Clock size={14} style={{ color: 'var(--fg-muted)' }} />
              Recent activity
            </div>
            <button
              onClick={() => navigate('/issues')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 12,
                color: 'var(--accent)',
                fontFamily: 'var(--font-heading)',
                fontWeight: 600,
                padding: '2px 6px',
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                gap: 3,
              }}
            >
              View all <Icon.ChevRight size={12} />
            </button>
          </div>

          <div className="card" style={{ overflow: 'hidden' }}>
            {recent.isLoading ? (
              <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--fg-subtle)', fontSize: 12 }}>
                Loading…
              </div>
            ) : (recent.data?.data ?? []).length === 0 ? (
              <div className="empty" style={{ padding: '48px 24px' }}>
                <Icon.Inbox size={32} style={{ color: 'var(--fg-subtle)', margin: '0 auto 10px' }} />
                <div className="empty-title" style={{ fontSize: 13 }}>No issues yet</div>
                <p style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 4 }}>
                  Create your first issue to get started
                </p>
                <Button variant="primary" size="sm" onClick={onCreate} style={{ marginTop: 14 }}>
                  Create the first one
                </Button>
              </div>
            ) : (
              <table className="table" style={{ fontSize: 12 }}>
                <thead>
                  <tr>
                    <th style={{ width: 24 }}></th>
                    <th style={{ width: 70 }}>ID</th>
                    <th>Title</th>
                    <th style={{ width: 85 }}>Priority</th>
                    <th style={{ width: 32 }}>By</th>
                    <th style={{ width: 72 }}>Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {(recent.data?.data ?? []).map((issue) => (
                    <tr key={issue.id} onClick={() => navigate(`/issues/${issue.id}`)}>
                      <td>
                        <StatusIcon status={statusApiToUi[issue.status]} size={13} />
                      </td>
                      <td className="mono text-xs text-subtle" style={{ fontSize: 11 }}>
                        {issue.id.slice(0, 7)}
                      </td>
                      <td>
                        <span
                          style={{
                            maxWidth: 280,
                            fontWeight: 500,
                            display: 'block',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            fontSize: 12,
                          }}
                        >
                          {truncate(issue.title, 55)}
                        </span>
                      </td>
                      <td>
                        <PriorityBadge priority={priorityApiToUi[issue.priority]} />
                      </td>
                      <td>
                        <Avatar user={issue.author} />
                      </td>
                      <td className="text-xs text-subtle mono" style={{ fontSize: 11 }}>
                        {timeAgo(issue.updatedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Quick Actions */}
          <div className="card" style={{ padding: '14px 16px' }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: 'var(--fg-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 10,
                fontFamily: 'var(--font-heading)',
              }}
            >
              Quick Actions
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <button
                onClick={onCreate}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 10px',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  background: 'var(--bg-subtle)',
                  cursor: 'pointer',
                  fontSize: 12,
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 600,
                  color: 'var(--fg)',
                  transition: 'all .12s',
                  width: '100%',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'var(--accent)';
                  (e.currentTarget as HTMLElement).style.color = '#fff';
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'var(--bg-subtle)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--fg)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                }}
              >
                <Icon.Plus size={13} />
                Create new issue
                <span style={{ marginLeft: 'auto', fontSize: 10, opacity: 0.5, fontFamily: 'var(--font-mono)' }}>C</span>
              </button>
              <button
                onClick={() => navigate('/issues')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 10px',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: 12,
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 500,
                  color: 'var(--fg-muted)',
                  transition: 'all .12s',
                  width: '100%',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'var(--bg-muted)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--fg)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = 'var(--fg-muted)';
                }}
              >
                <Icon.Filter size={13} />
                Browse all issues
              </button>
            </div>
          </div>

          {/* My Open Issues */}
          <div className="card" style={{ padding: '14px 16px', flex: 1 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: 'var(--fg-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 10,
                fontFamily: 'var(--font-heading)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              My open issues
              {myOpenIssues.length > 0 && (
                <span
                  style={{
                    background: 'var(--status-open-bg)',
                    color: 'var(--status-open)',
                    borderRadius: 999,
                    padding: '1px 7px',
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                >
                  {myOpenIssues.length}
                </span>
              )}
            </div>

            {mine.isLoading ? (
              <div style={{ fontSize: 12, color: 'var(--fg-subtle)', padding: '8px 0' }}>Loading…</div>
            ) : myOpenIssues.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <Icon.CheckCircle size={24} style={{ color: '#22C55E', margin: '0 auto 6px' }} />
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg)', fontFamily: 'var(--font-heading)' }}>
                  All clear!
                </div>
                <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 2 }}>No open issues assigned</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {myOpenIssues.map((issue) => (
                  <div
                    key={issue.id}
                    onClick={() => navigate(`/issues/${issue.id}`)}
                    style={{
                      padding: '8px 10px',
                      borderRadius: 8,
                      border: '1px solid var(--border)',
                      cursor: 'pointer',
                      transition: 'all .12s',
                      background: 'var(--bg-subtle)',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)';
                      (e.currentTarget as HTMLElement).style.background = 'var(--surface)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                      (e.currentTarget as HTMLElement).style.background = 'var(--bg-subtle)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                      <StatusIcon status={statusApiToUi[issue.status]} size={11} />
                      <span className="mono" style={{ fontSize: 10, color: 'var(--fg-subtle)' }}>
                        {issue.id.slice(0, 7)}
                      </span>
                      <PriorityBadge priority={priorityApiToUi[issue.priority]} />
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 500,
                        color: 'var(--fg)',
                        lineHeight: 1.35,
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {issue.title}
                    </div>
                    <div style={{ fontSize: 10.5, color: 'var(--fg-subtle)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
                      {timeAgo(issue.updatedAt)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
