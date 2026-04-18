import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/UI/Button';
import { Dialog } from '@/components/UI/Dialog';
import { Icon } from '@/components/UI/Icon';
import { PriorityBadge } from '@/components/UI/Badge';
import { issueSchema, type IssueFormValues } from '@/lib/schemas';
import { SEVERITY_META } from '@/lib/constants';
import { useCreateIssue, useUpdateIssue } from '@/features/issues/hooks';
import {
  priorityApiToUi,
  severityApiToUi,
  type Issue,
} from '@/types/api';

interface CreateEditModalProps {
  issue?: Issue;
  onClose: () => void;
}

export function CreateEditModal({ issue, onClose }: CreateEditModalProps) {
  const isEdit = !!issue;
  const createMutation = useCreateIssue();
  const updateMutation = useUpdateIssue();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<IssueFormValues>({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      title: issue?.title ?? '',
      description: issue?.description ?? '',
      priority: issue?.priority ?? 'MEDIUM',
      severity: issue?.severity ?? 'MINOR',
    },
  });

  const watchedPriority = watch('priority');
  const watchedSeverity = watch('severity');

  const onSubmit = (values: IssueFormValues) => {
    if (isEdit && issue) {
      updateMutation.mutate(
        { id: issue.id, payload: values },
        { onSuccess: onClose },
      );
    } else {
      createMutation.mutate(values, { onSuccess: onClose });
    }
  };

  const pending =
    isSubmitting || createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open onClose={onClose} size="lg">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="dialog-header">
          <div className="row-sb">
            <div>
              <div className="dialog-title">
                {isEdit ? 'Edit issue' : 'Create new issue'}
              </div>
              <div className="dialog-desc">
                {isEdit
                  ? `Updating ${issue.id.slice(0, 8)}`
                  : 'Describe the bug, feature, or task. You can edit this later.'}
              </div>
            </div>
            <Button
              variant="ghost"
              icon={<Icon.X />}
              onClick={onClose}
              type="button"
            />
          </div>
        </div>

        <div className="dialog-body stack gap-3">
          <div>
            <label className="label">Title</label>
            <input
              className={`input ${errors.title ? 'input-error' : ''}`}
              autoFocus
              placeholder="Short, descriptive summary"
              {...register('title')}
            />
            {errors.title && (
              <div className="hint hint-error">{errors.title.message}</div>
            )}
          </div>

          <div>
            <label className="label">
              Description <span className="text-subtle">· Markdown supported</span>
            </label>
            <textarea
              className={`input textarea ${errors.description ? 'input-error' : ''}`}
              placeholder={'## What happened\n\nSteps to reproduce:\n1. …\n2. …\n\n```\nstack trace here\n```'}
              style={{
                minHeight: 160,
                fontFamily: 'var(--font-mono)',
                fontSize: 12.5,
              }}
              {...register('description')}
            />
            {errors.description && (
              <div className="hint hint-error">{errors.description.message}</div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="label">Priority</label>
              <select className="input select" {...register('priority')}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
            <div>
              <label className="label">Severity</label>
              <select className="input select" {...register('severity')}>
                <option value="TRIVIAL">Trivial</option>
                <option value="MINOR">Minor</option>
                <option value="MAJOR">Major</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
          </div>

          <div className="row gap-2" style={{ marginTop: 4 }}>
            <span className="text-xs text-subtle">Preview:</span>
            <PriorityBadge priority={priorityApiToUi[watchedPriority]} />
            <span className="badge-neutral">
              severity: {SEVERITY_META[severityApiToUi[watchedSeverity]]}
            </span>
          </div>
        </div>

        <div className="dialog-footer">
          <Button variant="ghost" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={pending}>
            {pending
              ? 'Saving…'
              : isEdit
                ? 'Save changes'
                : 'Create issue'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
