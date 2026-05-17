import { API_URL } from "../Config";

/** Exchange the stored refresh_token for a new access + refresh token pair. */
export async function refreshAccessToken(): Promise<string | null> {
  const refresh_token = localStorage.getItem("refresh_token");
  if (!refresh_token) return null;

  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token }),
    });
    if (!res.ok) {
      localStorage.removeItem("refresh_token");
      return null;
    }
    const data = await res.json();
    localStorage.setItem("token", data.token);
    localStorage.setItem("refresh_token", data.refresh_token);
    return data.token;
  } catch {
    return null;
  }
}

/**
 * fetch() wrapper that transparently refreshes the access token on 401 and
 * retries the request once. Callers use this instead of raw fetch() for any
 * authenticated request.
 */
export async function authFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const token = localStorage.getItem("token");
  const headers = new Headers(options.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(url, { ...options, headers });

  if (res.status !== 401) return res;

  // Token expired — try to refresh
  const newToken = await refreshAccessToken();
  if (!newToken) return res; // refresh failed, caller sees the 401

  headers.set("Authorization", `Bearer ${newToken}`);
  return fetch(url, { ...options, headers });
}
