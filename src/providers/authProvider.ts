import type { AuthProvider } from "@refinedev/core";
import { config } from "../config";

const TOKEN_KEY = "marvels.admin.token";
const USER_KEY = "marvels.admin.user";

type Identity = { id: string; name: string; email: string; role: string };

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      const res = await fetch(`${config.apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        return {
          success: false,
          error: { name: "Login failed", message: "Invalid email or password" },
        };
      }
      const data = (await res.json()) as { accessToken: string; user: Identity };
      if (!["ADMIN", "STAFF"].includes(data.user.role)) {
        return {
          success: false,
          error: { name: "Forbidden", message: "This account is not a staff account" },
        };
      }
      localStorage.setItem(TOKEN_KEY, data.accessToken);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      return { success: true, redirectTo: "/" };
    } catch {
      return {
        success: false,
        error: { name: "Network error", message: "Could not reach the API" },
      };
    }
  },

  logout: async () => {
    await fetch(`${config.apiUrl}/auth/logout`, {
      method: "POST",
      credentials: "include",
    }).catch(() => undefined);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    return { success: true, redirectTo: "/login" };
  },

  check: async () => {
    if (localStorage.getItem(TOKEN_KEY)) return { authenticated: true };
    // Try a silent refresh from the cookie.
    const r = await fetch(`${config.apiUrl}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    }).catch(() => null);
    if (r?.ok) {
      const data = (await r.json()) as { accessToken: string; user: Identity };
      if (["ADMIN", "STAFF"].includes(data.user.role)) {
        localStorage.setItem(TOKEN_KEY, data.accessToken);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        return { authenticated: true };
      }
    }
    return { authenticated: false, redirectTo: "/login" };
  },

  getPermissions: async () => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as Identity).role : null;
  },

  getIdentity: async () => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as Identity) : null;
  },

  onError: async (error) => ({ error }),
};
