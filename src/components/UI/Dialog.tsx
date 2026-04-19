import { useEffect, type ReactNode } from 'react';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: 'md' | 'lg';
  disableOutsideClose?: boolean;
}

export function Dialog({
  open,
  onClose,
  children,
  size = 'md',
  disableOutsideClose = false,
}: DialogProps) {
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);

    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="scrim"
      onClick={disableOutsideClose ? undefined : onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`dialog ${size === 'lg' ? 'dialog-lg' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
