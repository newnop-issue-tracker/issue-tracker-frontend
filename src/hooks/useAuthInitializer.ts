import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { onSessionLost } from '@/api/client';
import { authApi } from '@/api/auth.api';

export function useAuthInitializer(): void {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const markInitialized = useAuthStore((s) => s.markInitialized);

  useEffect(() => {
    onSessionLost(() => {
      clearAuth();
    });

    (async () => {
      try {
        const { user } = await authApi.me();
        useAuthStore.setState({ user });
      } catch {
        // No valid session
      } finally {
        markInitialized();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
