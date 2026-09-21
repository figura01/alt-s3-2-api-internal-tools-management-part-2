
export class ApiError extends Error {
  constructor(public readonly status: number) {
    super(`API Error: ${status}`);
    this.name = "ApiError";
  }
}

const API_URL =
  typeof window === "undefined"
    ? process.env.API_URL
    : process.env.NEXT_PUBLIC_API_URL;

let refreshPromise: Promise<Response> | null = null;

function refreshSession(): Promise<Response> {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "X-CSRF-Protection": "1" },
      credentials: "include",
      cache: "no-store",
    }).finally(() => { refreshPromise = null; });
  }
  return refreshPromise;
}

export async function api<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const headers = new Headers(options?.headers);
  headers.set("Content-Type", "application/json");

  headers.set("X-CSRF-Protection", "1");

  const send = () => fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
    cache: "no-store",
  });

  let response = await send();
  const canRefresh = !["/auth/login", "/auth/register", "/auth/logout", "/auth/refresh"].includes(endpoint);
  if (response.status === 401 && canRefresh && typeof window !== "undefined") {
    const refreshed = await refreshSession();
    options?.signal?.throwIfAborted();
    if (refreshed.ok) response = await send();
    else if (refreshed.status !== 401) throw new ApiError(refreshed.status);
    if (response.status === 401 && endpoint !== "/auth/me") {
      window.dispatchEvent(new Event("auth:expired"));
    }
  }

  if (!response.ok) {
    throw new ApiError(response.status);
  }

  return response.json();
}
