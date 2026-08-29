import type { AuthProvider } from "@refinedev/core";
import { config } from "../config";

/**
 * Phase 0 stub. Phase 5 replaces this with the real flow against marvels-api:
 *   POST /auth/login  -> access token (memory) + refresh cookie (Domain=.marvelsonline.in)
 *   POST /auth/refresh on 401, GET /auth/me for identity, role gate ADMIN | STAFF.
 */
const TOKEN_KEY = "marvels.admin.token";

export const authProvider: AuthProvider = {
  async login({ email, password }) {
    try {
      const res = await fetch(`${config.apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        return { success: false, error: { name: "Login failed", message: "Invalid credentials" } };
      }
      const data = (await res.json()) as { accessToken?: string };
      if (data.accessToken) localStorage.setItem(TOKEN_KEY, data.accessToken);
      return { success: true, redirectTo: "/" };
    } catch {
      return {
        success: false,
        error: { name: "Network error", message: "Could not reach the API" },
      };
    }
  },

  async logout() {
    localStorage.removeItem(TOKEN_KEY);
    return { success: true, redirectTo: "/login" };
  },

  async check() {
    return localStorage.getItem(TOKEN_KEY)
      ? { authenticated: true }
      : { authenticated: false, redirectTo: "/login" };
  },

  async getIdentity() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    return { id: "me", name: "Store admin" };
  },

  async onError(error) {
    return { error };
  },
};
