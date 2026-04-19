import { type ReactNode, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Avatar } from '@/components/UI/Avatar';
import { Button } from '@/components/UI/Button';
import { Icon } from '@/components/UI/Icon';
import { PriorityBadge, StatusBadge } from '@/components/UI/Badge';
import { useDeleteIssue, useIssue, useUpdateIssue, useUsers } from '@/features/issues/hooks';
import { useAuthStore } from '@/store/authStore';
import { useTicker } from '@/hooks/useTicker';
import { renderMarkdown } from '@/lib/markdown';
import { timeAgo } from '@/lib/formatters';
import { SEVERITY_META } from '@/lib/constants';
import { priorityApiToUi, severityApiToUi, statusApiToUi } from '@/types/api';
import { CreateEditModal } from '@/components/issues/CreateEditModal';
import { ConfirmDialog } from '@/components/issues/ConfirmDialog';
import { CommentsSection } from '@/components/issues/CommentsSection';

const MetaRow = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="meta-row">
    <div className="meta-key">{label}</div>
    <div className="meta-val">{children}</div>
  </div>
);

export function IssueDetailPage() {
  useTicker(20_000);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const me = useAuthStore((s) => s.user);

  const { data: issue, isLoading, isError } = useIssue(id);
  const updateMutation = useUpdateIssue();
  const deleteMutation = useDeleteIssue();
  const { data: users = [] } = useUsers();

  const [editOpen, setEditOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (isLoading) {
    return (
      <div className="main-wrap">
        <div className="empty">
          <span className="text-sm text-subtle">Loading…</span>
        </div>
      </div>
    );
  }

  if (isError || !issue) {
    return (
      <div className="main-wrap">
        <div className="empty">
          <Icon.Inbox size={40} />
          <div className="empty-title">Issue not found</div>
          <Button
            variant="secondary"
            size="sm"
            style={{ marginTop: 12 }}
            onClick={() => navigate('/issues')}
          >
            Back to issues
          </Button>
        </div>
      </div>
    );
  }

  const isAuthor = me?.id === issue.authorId;
  const status = statusApiToUi[issue.status];
  const priority = priorityApiToUi[issue.priority];
  const severity = severityApiToUi[issue.severity];

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateMutation.mutate({ id: issue.id, payload: { status: e.target.value as 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' } });
  };

  const handleDelete = () => {
    deleteMutation.mutate(issue.id, {
      onSuccess: () => navigate('/issues'),
    });
    setConfirmDelete(false);
  };

  return (
    <>
      <div className="main-wrap">
        <div className="breadcrumb">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate('/issues');
            }}
          >
            issueflow
          </a>
          <span className="sep">/</span>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate('/issues');
            }}
          >
            issues
          </a>
          <span className="sep">/</span>
          <span style={{ color: 'var(--fg)' }}>{issue.id.slice(0, 8)}</span>
        </div>

        <div className="detail-layout">
          <div>
            <div className="row gap-2 mb-3">
              <StatusBadge status={status} />
              <PriorityBadge priority={priority} />
              <span className="badge-neutral">severity: {SEVERITY_META[severity]}</span>
            </div>
            <h1 className="detail-title">{issue.title}</h1>
            <div className="row gap-3 text-sm text-muted mb-4">
              <span className="row gap-2">
                <Avatar user={issue.author} />
                <b style={{ color: 'var(--fg)', fontWeight: 500 }}>
                  {issue.author.name}
                </b>{' '}
                opened this issue
              </span>
              <span className="text-subtle">·</span>
              <span className="mono text-xs">{timeAgo(issue.createdAt)}</span>
            </div>

            {isAuthor && (
              <div className="row gap-2 mb-4">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setEditOpen(true)}
                  icon={<Icon.Edit size={14} />}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setConfirmDelete(true)}
                  icon={<Icon.Trash size={14} />}
                >
                  Delete
                </Button>
              </div>
            )}

            <div className="card" style={{ padding: '20px 24px' }}>
              <div
                className="row-sb mb-3"
                style={{ paddingBottom: 10, borderBottom: '1px solid var(--border)' }}
              >
                <div style={{ fontWeight: 600, fontSize: 13 }}>Description</div>
                <span className="text-xs text-subtle mono">markdown</span>
              </div>
              <div className="prose">
                {renderMarkdown(issue.description || '_No description provided._')}
              </div>
            </div>

            <CommentsSection issueId={issue.id} />
          </div>

          <aside className="card meta-card" style={{ position: 'sticky', top: 80 }}>
            <MetaRow label="Status">
              {me ? (
                <select
                  className="input select"
                  value={issue.status}
                  disabled={updateMutation.isPending}
                  onChange={handleStatusChange}
                  style={{ fontSize: 12, padding: '2px 6px', height: 'auto' }}
                >
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                </select>
              ) : (
                <StatusBadge status={status} />
              )}
            </MetaRow>
            <MetaRow label="Priority">
              <PriorityBadge priority={priority} />
            </MetaRow>
            <MetaRow label="Severity">
              <span className="badge-neutral">{SEVERITY_META[severity]}</span>
            </MetaRow>
            <MetaRow label="Assignee">
              {isAuthor ? (
                <select
                  className="input select"
                  value={issue.assigneeId ?? ''}
                  disabled={updateMutation.isPending}
                  onChange={(e) =>
                    updateMutation.mutate({
                      id: issue.id,
                      payload: { assigneeId: e.target.value || null },
                    })
                  }
                  style={{ fontSize: 12, padding: '2px 6px', height: 'auto' }}
                >
                  <option value="">Unassigned</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              ) : issue.assignee ? (
                <div className="row gap-2">
                  <Avatar user={issue.assignee} />
                  <span className="text-sm">{issue.assignee.name}</span>
                </div>
              ) : (
                <span className="text-sm text-subtle">Unassigned</span>
              )}
            </MetaRow>
            <MetaRow label="Author">
              <div className="row gap-2">
                <Avatar user={issue.author} />
                <span className="text-sm">{issue.author.name}</span>
              </div>
            </MetaRow>
            <MetaRow label="Created">
              <span className="text-sm mono">{timeAgo(issue.createdAt)}</span>
            </MetaRow>
            <MetaRow label="Last updated">
              <div className="stack" style={{ gap: 2 }}>
                <span className="text-sm mono">{timeAgo(issue.updatedAt)}</span>
                {issue.updatedBy && (
                  <div className="row gap-2">
                    <Avatar user={issue.updatedBy} />
                    <span className="text-xs text-subtle">{issue.updatedBy.name}</span>
                  </div>
                )}
              </div>
            </MetaRow>
            {issue.resolvedBy && (
              <MetaRow label="Resolved by">
                <div className="row gap-2">
                  <Avatar user={issue.resolvedBy} />
                  <span className="text-sm">{issue.resolvedBy.name}</span>
                </div>
              </MetaRow>
            )}
          </aside>
        </div>
      </div>

      {editOpen && (
        <CreateEditModal issue={issue} onClose={() => setEditOpen(false)} />
      )}

      {confirmDelete && (
        <ConfirmDialog
          danger
          title="Delete this issue?"
          description={`"${issue.title}" will be permanently removed. This cannot be undone.`}
          confirmLabel="Delete issue"
          icon={<Icon.AlertTri size={20} />}
          onClose={() => setConfirmDelete(false)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}
