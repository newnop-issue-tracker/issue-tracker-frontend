import { useEffect } from 'react';

export interface Shortcut {
  key: string;
  mod?: boolean;
  handler: (e: KeyboardEvent) => void;
}

export function useKeyboardShortcuts(shortcuts: Shortcut[]): void {
  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      const target = e.target as HTMLElement | null;
      const inField =
        target?.matches('input, textarea, select, [contenteditable="true"]') ?? false;

      for (const s of shortcuts) {
        const modMatch = s.mod ? e.metaKey || e.ctrlKey : !e.metaKey && !e.ctrlKey;
        const keyMatch = e.key.toLowerCase() === s.key.toLowerCase();
        if (modMatch && keyMatch) {
          if (!s.mod && inField) continue;
          s.handler(e);
          return;
        }
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [shortcuts]);
}
