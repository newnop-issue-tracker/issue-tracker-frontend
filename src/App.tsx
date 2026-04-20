import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import { router } from '@/router';
import { queryClient } from '@/lib/queryClient';
import { useAuthInitializer } from '@/hooks/useAuthInitializer';

function AppContent() {
  useAuthInitializer();
  return <RouterProvider router={router} />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#ffffff',
            color: '#1e293b',
            border: '1px solid #e2e8f0',
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
