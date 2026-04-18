import { type ReactNode, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Avatar } from '@/components/UI/Avatar';
import { Button } from '@/components/UI/Button';
import { Icon } from '@/components/UI/Icon';
import { PriorityBadge, StatusBadge } from '@/components/UI/Badge';
import { useDeleteIssue, useIssue, useUpdateIssue } from '@/features/issues/hooks';
import { useAuthStore } from '@/store/authStore';
import { useTicker } from '@/hooks/useTicker';
import { renderMarkdown } from '@/lib/markdown';
import { timeAgo } from '@/lib/formatters';
import { SEVERITY_META } from '@/lib/constants';
import { priorityApiToUi, severityApiToUi, statusApiToUi } from '@/types/api';
import { CreateEditModal } from '@/components/issues/CreateEditModal';
import { ConfirmDialog } from '@/components/issues/ConfirmDialog';

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

  const [editOpen, setEditOpen] = useState(false);
  const [confirmResolve, setConfirmResolve] = useState(false);
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

  const handleResolve = () => {
    updateMutation.mutate({ id: issue.id, payload: { status: 'RESOLVED' } });
    setConfirmResolve(false);
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
                {issue.status !== 'RESOLVED' && issue.status !== 'CLOSED' && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setConfirmResolve(true)}
                    icon={<Icon.CheckCircle size={14} />}
                  >
                    Mark resolved
                  </Button>
                )}
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
          </div>

          <aside className="card meta-card" style={{ position: 'sticky', top: 80 }}>
            <MetaRow label="Status">
              <StatusBadge status={status} />
            </MetaRow>
            <MetaRow label="Priority">
              <PriorityBadge priority={priority} />
            </MetaRow>
            <MetaRow label="Severity">
              <span className="badge-neutral">{SEVERITY_META[severity]}</span>
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
              <span className="text-sm mono">{timeAgo(issue.updatedAt)}</span>
            </MetaRow>
          </aside>
        </div>
      </div>

      {editOpen && (
        <CreateEditModal issue={issue} onClose={() => setEditOpen(false)} />
      )}

      {confirmResolve && (
        <ConfirmDialog
          title="Mark this issue as resolved?"
          description="This issue will move to Resolved. You can reopen it later from the detail page."
          confirmLabel="Yes, mark resolved"
          icon={<Icon.CheckCircle size={20} />}
          onClose={() => setConfirmResolve(false)}
          onConfirm={handleResolve}
        />
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
