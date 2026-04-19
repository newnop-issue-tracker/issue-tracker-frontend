import type { ReactNode } from 'react';
import { Button } from '@/components/UI/Button';
import { Dialog } from '@/components/UI/Dialog';

interface ConfirmDialogProps {
  title: string;
  description: string;
  confirmLabel: string;
  icon: ReactNode;
  danger?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmDialog({
  title,
  description,
  confirmLabel,
  icon,
  danger,
  onClose,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog open onClose={onClose}>
      <div className="dialog-header">
        <div className="row gap-3" style={{ alignItems: 'flex-start' }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: danger ? '#FEECEC' : 'var(--status-resolved-bg)',
              color: danger ? '#DC2626' : 'var(--status-resolved)',
              display: 'grid',
              placeItems: 'center',
              flex: '0 0 auto',
            }}
          >
            {icon}
          </div>
          <div>
            <div className="dialog-title">{title}</div>
            <div className="dialog-desc">{description}</div>
          </div>
        </div>
      </div>
      <div className="dialog-footer">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Dialog>
  );
}
