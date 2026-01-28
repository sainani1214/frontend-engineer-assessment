import { ApiError, NetworkError } from "./errors";

export interface ApiClient {
  setToken(token: string | null): void;
  get<T>(endpoint: string): Promise<T>;
  post<T>(endpoint: string, data?: unknown): Promise<T>;
  put<T>(endpoint: string, data?: unknown): Promise<T>;
  delete<T>(endpoint: string): Promise<T>;
}

type ApiClientOptions = {
  baseUrl?: string;
  refreshEndpoint?: string;
  onTokenRefresh?: (token: string | null) => void;
};

const parseResponse = async (response: Response) => {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  return response.text();
};

export const createApiClient = (options: ApiClientOptions = {}): ApiClient => {
  let token: string | null = null;

  const request = async <T>(
    method: string,
    endpoint: string,
    data?: unknown,
    allowRefresh = true
  ): Promise<T> => {
    const baseUrl = options.baseUrl ?? "";
    const url = `${baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: data ? JSON.stringify(data) : undefined,
        credentials: "include",
      });

      if (response.status === 401 && allowRefresh && options.refreshEndpoint) {
        const refreshed = await refreshToken();
        if (refreshed) {
          return request<T>(method, endpoint, data, false);
        }
      }

      if (!response.ok) {
        const details = await parseResponse(response);
        throw new ApiError(
          response.statusText || "API error",
          response.status,
          details
        );
      }

      return (await parseResponse(response)) as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new NetworkError(
        error instanceof Error ? error.message : "Network error"
      );
    }
  };

  const refreshToken = async () => {
    if (!options.refreshEndpoint) {
      return false;
    }

    try {
      const response = await fetch(`${options.baseUrl ?? ""}${options.refreshEndpoint}`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        return false;
      }

      const payload = (await parseResponse(response)) as { token?: string };
      token = payload.token ?? null;
      options.onTokenRefresh?.(token);
      return Boolean(token);
    } catch {
      return false;
    }
  };

  return {
    setToken(nextToken: string | null) {
      token = nextToken;
    },
    get<T>(endpoint: string) {
      return request<T>("GET", endpoint);
    },
    post<T>(endpoint: string, data?: unknown) {
      return request<T>("POST", endpoint, data);
    },
    put<T>(endpoint: string, data?: unknown) {
      return request<T>("PUT", endpoint, data);
    },
    delete<T>(endpoint: string) {
      return request<T>("DELETE", endpoint);
    },
  };
};
