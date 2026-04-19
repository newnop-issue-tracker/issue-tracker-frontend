import { useOutletContext } from 'react-router-dom';
import { DashboardPage } from '@/features/issues/DashboardPage';
import { IssuesListPage } from '@/features/issues/IssuesListPage';

interface ShellContext {
  openCreate: () => void;
}

export function DashboardRoute() {
  const { openCreate } = useOutletContext<ShellContext>();
  return <DashboardPage onCreate={openCreate} />;
}

export function IssuesListRoute() {
  const { openCreate } = useOutletContext<ShellContext>();
  return <IssuesListPage onCreate={openCreate} />;
}
