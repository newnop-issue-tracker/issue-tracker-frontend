import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { RequireAuth, RedirectIfAuth } from '@/components/layout/RequireAuth';
import { IssueDetailPage } from '@/features/issues/IssueDetailPage';
import { DashboardRoute, IssuesListRoute } from '@/features/issues/routes';
import NavComponent from '@/components/UI/NavComponent';
import Home from '@/pages/Home';
import SignIn from '@/pages/SignIn';
import SignUp from '@/pages/SignUp';
import { Outlet } from 'react-router-dom';

function PublicLayout() {
  return (
    <>
      <NavComponent />
      <Outlet />
    </>
  );
}

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <Home /> },
      {
        element: <RedirectIfAuth />,
        children: [
          { path: '/signin', element: <SignIn /> },
          { path: '/signup', element: <SignUp /> },
        ],
      },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: '/dashboard', element: <DashboardRoute /> },
          { path: '/issues', element: <IssuesListRoute /> },
          { path: '/issues/:id', element: <IssueDetailPage /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
