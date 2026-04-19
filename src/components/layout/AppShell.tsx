import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { CreateEditModal } from '@/components/issues/CreateEditModal';
import { CommandPalette } from '@/components/issues/CommandPalette';
import { useUiStore } from '@/store/uiStore';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

export function AppShell() {
  const [createOpen, setCreateOpen] = useState(false);
  const openCmd = useUiStore((s) => s.openCommandPalette);

  useKeyboardShortcuts([
    { key: 'k', mod: true, handler: openCmd },
    { key: 'c', handler: () => setCreateOpen(true) },
  ]);

  const openCreate = () => setCreateOpen(true);
  const closeCreate = () => setCreateOpen(false);

  return (
    <div className="app-shell">
      <Navbar onCreate={openCreate} />
      <Outlet context={{ openCreate }} />

      {createOpen && <CreateEditModal onClose={closeCreate} />}
      <CommandPalette onCreate={openCreate} />
    </div>
  );
}
