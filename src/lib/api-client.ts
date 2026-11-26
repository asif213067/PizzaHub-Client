import { authClient } from "@/lib/auth-client";

const SERVER_BASE_URL =
  process.env.NEXT_PUBLIC_SERVER_BASE_URL || "http://localhost:5000";

const TOKEN_KEY = "pizzahub_jwt_token";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Exchanges the authenticated user's session with the Express backend to obtain a verified JWT token.
 * Passes the active Better Auth session token to verify user identity and prevent privilege spoofing.
 */
export async function syncAuthToken(
  email?: string,
  sessionToken?: string
): Promise<string | null> {
  try {
    let tokenToSend = sessionToken;

    // Retrieve active session token from Better Auth if not explicitly passed
    if (!tokenToSend && typeof window !== "undefined") {
      try {
        const sessionRes = await authClient.getSession();
        tokenToSend = sessionRes?.data?.session?.token;
        if (!email && sessionRes?.data?.user?.email) {
          email = sessionRes.data.user.email;
        }
      } catch (sessionErr) {
        console.warn("Could not retrieve active Better Auth session:", sessionErr);
      }
    }

    // Browser cookie fallback if accessible
    if (!tokenToSend && typeof document !== "undefined") {
      const match = document.cookie.match(
        /(?:^|;\s*)(?:better-auth\.session_token|__Secure-better-auth\.session_token)=([^;]+)/
      );
      if (match) {
        tokenToSend = decodeURIComponent(match[1]);
      }
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (tokenToSend) {
      headers["x-session-token"] = tokenToSend;
    }

    const res = await fetch(`${SERVER_BASE_URL}/api/auth/jwt`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        email,
        sessionToken: tokenToSend,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      const errorMsg = errorData?.message || `Failed with status ${res.status}`;
      console.warn("Failed to obtain server JWT token:", errorMsg);
      if (res.status === 403) {
        throw new Error(errorMsg);
      }
      return null;
    }

    const data = await res.json();
    if (data.success && data.token) {
      setStoredToken(data.token);
      return data.token;
    }
    return null;
  } catch (err) {
    if (err instanceof Error && err.message.toLowerCase().includes("blocked")) {
      throw err;
    }
    console.error("Error syncing auth token with backend:", err);
    return null;
  }
}

/**
 * Standard API request wrapper for all Express backend endpoints.
 */
export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getStoredToken();
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${SERVER_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || `Request failed with status ${response.status}`);
  }

  return data as T;
}

export const api = {
  get: <T = unknown>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { ...options, method: "GET" }),

  post: <T = unknown>(endpoint: string, body?: unknown, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T = unknown>(endpoint: string, body?: unknown, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T = unknown>(endpoint: string, body?: unknown, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T = unknown>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { ...options, method: "DELETE" }),
};
