import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authApi, type LoginPayload, type RegisterPayload } from '@/api/auth.api';
import { getErrorMessage } from '@/api/client';
import { useAuthStore } from '@/store/authStore';
import { queryClient } from '@/lib/queryClient';

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      toast.success('Signed in', { description: `Welcome back, ${data.user.name}` });
      navigate('/dashboard');
    },
    onError: (err) => {
      toast.error('Sign in failed', { description: getErrorMessage(err) });
    },
  });
}

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      toast.success('Account created', { description: 'Welcome to IssueFlow' });
      navigate('/dashboard');
    },
    onError: (err) => {
      toast.error('Registration failed', { description: getErrorMessage(err) });
    },
  });
}

export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      navigate('/');
      toast.success('Signed out');
    },
  });
}
