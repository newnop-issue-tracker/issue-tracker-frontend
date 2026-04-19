import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import type { AuthResponse, ApiError } from "@/types/api";

const API_URL = import.meta.env.VITE_API_URL || "";

let accessToken: string | null = null;
export const getAccessToken = () => accessToken;
export const setAccessToken = (t: string | null) => {
  accessToken = t;
};

type SessionLostHandler = () => void;
let sessionLostHandler: SessionLostHandler | null = null;
export const onSessionLost = (handler: SessionLostHandler) => {
  sessionLostHandler = handler;
};

export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 15_000,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = axios
      .post<AuthResponse>(
        `${API_URL}/api/auth/refresh`,
        {},
        { withCredentials: true },
      )
      .then((res) => {
        setAccessToken(res.data.accessToken);
        return res.data.accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError<ApiError>) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (error.response?.status !== 401 || !original || original._retry) {
      return Promise.reject(error);
    }

    if (
      original.url?.includes("/api/auth/login") ||
      original.url?.includes("/api/auth/register") ||
      original.url?.includes("/api/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    original._retry = true;

    try {
      const newToken = await refreshAccessToken();
      if (original.headers) {
        original.headers.Authorization = `Bearer ${newToken}`;
      }
      return api(original);
    } catch (refreshErr) {
      setAccessToken(null);
      sessionLostHandler?.();
      return Promise.reject(refreshErr);
    }
  },
);

export function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError<ApiError>(err)) {
    const apiError = err.response?.data;

    if (apiError?.details?.length) {
      const detailMessages = apiError.details
        .map((d) => d.message?.trim())
        .filter((message): message is string => Boolean(message));

      if (detailMessages.length) {
        return detailMessages.join(" | ");
      }
    }

    return apiError?.error ?? err.message ?? "Something went wrong";
  }
  if (err instanceof Error) return err.message;
  return "Something went wrong";
}
