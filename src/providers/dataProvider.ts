import type { DataProvider } from "@refinedev/core";
import { config } from "../config";

const TOKEN_KEY = "marvels.admin.token";

async function http(
  path: string,
  init: RequestInit = {},
  retry = true,
): Promise<Response> {
  const token = localStorage.getItem(TOKEN_KEY);
  const res = await fetch(`${config.adminApiUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
  });
  if (res.status === 401 && retry) {
    const r = await fetch(`${config.apiUrl}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (r.ok) {
      const data = (await r.json()) as { accessToken?: string };
      if (data.accessToken) localStorage.setItem(TOKEN_KEY, data.accessToken);
      return http(path, init, false);
    }
  }
  return res;
}

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error?.message ?? `Request failed (${res.status})`);
  }
  return (res.status === 204 ? undefined : await res.json()) as T;
}

/** REST data provider tuned to marvels-api: list -> { data, total }. */
export const dataProvider: DataProvider = {
  getApiUrl: () => config.adminApiUrl,

  getList: async ({ resource, pagination, sorters, filters }) => {
    const params = new URLSearchParams();
    const current =
      (pagination as { currentPage?: number; current?: number } | undefined)
        ?.currentPage ??
      (pagination as { current?: number } | undefined)?.current;
    if (current) params.set("page", String(current));
    if (pagination?.pageSize) params.set("pageSize", String(pagination.pageSize));
    const sorter = sorters?.[0];
    if (sorter) {
      params.set("sort", sorter.field);
      params.set("order", sorter.order);
    }
    for (const f of filters ?? []) {
      if ("field" in f && f.value != null && f.value !== "") {
        params.set(f.field, String(f.value));
      }
    }
    const body = await json<{ data: unknown[]; total: number }>(
      await http(`/${resource}?${params.toString()}`),
    );
    return { data: body.data as never, total: body.total };
  },

  getOne: async ({ resource, id }) => {
    const data = await json<Record<string, unknown>>(await http(`/${resource}/${id}`));
    return { data: data as never };
  },

  create: async ({ resource, variables }) => {
    const data = await json<Record<string, unknown>>(
      await http(`/${resource}`, { method: "POST", body: JSON.stringify(variables) }),
    );
    return { data: data as never };
  },

  update: async ({ resource, id, variables }) => {
    const method = resource === "settings" ? "PUT" : "PATCH";
    const path = resource === "settings" ? `/${resource}` : `/${resource}/${id}`;
    const data = await json<Record<string, unknown>>(
      await http(path, { method, body: JSON.stringify(variables) }),
    );
    return { data: data as never };
  },

  deleteOne: async ({ resource, id }) => {
    await json(await http(`/${resource}/${id}`, { method: "DELETE" }));
    return { data: { id } as never };
  },

  custom: async ({ url, method, payload }) => {
    const data = await json<Record<string, unknown>>(
      await http(url, {
        method: (method ?? "get").toUpperCase(),
        body: payload ? JSON.stringify(payload) : undefined,
      }),
    );
    return { data: data as never };
  },
};

export { http as adminHttp };
