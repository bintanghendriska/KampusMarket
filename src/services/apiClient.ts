import { strings } from '../constants/strings';

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const DEFAULT_TIMEOUT_MS = 10000;

export type ApiRequestOptions = Omit<RequestInit, 'body' | 'method'>;

let tokenProvider: (() => string | null | Promise<string | null>) | null = null;

export function registerTokenProvider(provider: typeof tokenProvider) {
  tokenProvider = provider;
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  // Link external signal if provided
  if (options?.signal) {
    options.signal.addEventListener('abort', () => {
      controller.abort();
    });
  }

  try {
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');

    if (options?.headers) {
      const extraHeaders = new Headers(options.headers);
      extraHeaders.forEach((value, key) => {
        headers.set(key, value);
      });
    }

    if (tokenProvider) {
      const token = await tokenProvider();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }

    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      const message = body?.message ?? strings.api.requestFailed(response.status);
      throw new ApiError(message, response.status);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (options?.signal?.aborted) {
      const abortError = new Error('Request cancelled by caller');
      abortError.name = 'AbortError';
      throw abortError;
    }
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError(strings.api.timeout);
    }
    throw new ApiError(strings.api.noConnection);
  } finally {
    clearTimeout(timeoutId);
  }
}

export const apiClient = {
  get: <T>(url: string, options?: ApiRequestOptions) =>
    request<T>(url, { ...options, method: 'GET' }),
  post: <T>(url: string, body: unknown, options?: ApiRequestOptions) =>
    request<T>(url, { ...options, method: 'POST', body: JSON.stringify(body) }),
};
