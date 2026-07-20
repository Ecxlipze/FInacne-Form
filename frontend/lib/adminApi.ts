const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

let accessToken: string | null = null;
export const tokenStore = {
  get: () => accessToken,
  set: (t: string | null) => {
    accessToken = t;
  },
};

export class AdminApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function raw<T>(path: string, init: RequestInit, auth: boolean): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    credentials: 'include', // send/receive the httpOnly refresh cookie
    headers: {
      'Content-Type': 'application/json',
      ...(auth && accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(init.headers ?? {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new AdminApiError(res.status, data.error ?? 'Request failed');
  return data as T;
}

/** Authenticated request that transparently refreshes the access token once on a 401. */
async function authed<T>(path: string, init: RequestInit = {}): Promise<T> {
  try {
    return await raw<T>(path, init, true);
  } catch (err) {
    if (err instanceof AdminApiError && err.status === 401) {
      await adminApi.refresh(); // may throw -> caller treats as logged out
      return raw<T>(path, init, true);
    }
    throw err;
  }
}

export interface AdminUser {
  id: string;
  email: string;
  name?: string;
  role: 'super_admin' | 'reviewer' | 'viewer';
}
export interface DashboardStats {
  total: number;
  today: number;
  thisMonth: number;
  byStatus: Record<string, number>;
}
export interface ListItem {
  _id: string;
  appId?: string;
  status: string;
  city: string | null;
  employmentStatus: string | null;
  incomeBand: string;
  maskedName: string | null;
  cnicLast4: string | null;
  submittedAt: string | null;
  createdAt: string;
}
export interface ListResult {
  items: ListItem[];
  total: number;
  page: number;
  limit: number;
}
export interface StatusEntry {
  from: string | null;
  to: string;
  byEmail: string | null;
  note: string | null;
  at: string;
}
export interface AppDetail {
  id: string;
  appId?: string;
  status: string;
  submittedAt: string | null;
  createdAt: string;
  consent: { privacyNoticeVersion: string; acceptedAt: string } | null;
  statusHistory: StatusEntry[];
  notes: { byEmail: string | null; text: string; at: string }[];
  data: Record<string, Record<string, unknown>>;
}
export interface DocMeta {
  _id: string;
  docType: string;
  originalName: string;
  contentType: string;
  sizeBytes: number | null;
  scanStatus: 'pending' | 'clean' | 'quarantined';
  createdAt: string;
}

export const adminApi = {
  login: async (email: string, password: string) => {
    const r = await raw<{ accessToken: string; admin: AdminUser }>(
      '/admin/login',
      { method: 'POST', body: JSON.stringify({ email, password }) },
      false
    );
    tokenStore.set(r.accessToken);
    return r.admin;
  },
  refresh: async () => {
    const r = await raw<{ accessToken: string; admin: AdminUser }>('/admin/refresh', { method: 'POST' }, false);
    tokenStore.set(r.accessToken);
    return r.admin;
  },
  logout: async () => {
    await raw<{ ok: true }>('/admin/logout', { method: 'POST' }, false).catch(() => undefined);
    tokenStore.set(null);
  },
  dashboard: () => authed<DashboardStats>('/admin/dashboard'),
  listApplications: (qs: string) => authed<ListResult>(`/admin/applications${qs ? `?${qs}` : ''}`),
  getApplication: (id: string) => authed<AppDetail>(`/admin/applications/${id}`),
  listDocuments: (id: string) => authed<{ documents: DocMeta[] }>(`/admin/applications/${id}/documents`),
  downloadDocument: (uploadId: string) => authed<{ url: string }>(`/admin/uploads/${uploadId}/download`),
  changeStatus: (id: string, status: string, note?: string) =>
    authed<{ ok: true; status: string }>(`/admin/applications/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, note }),
    }),
  addNote: (id: string, text: string) =>
    authed<{ ok: true }>(`/admin/applications/${id}/notes`, { method: 'POST', body: JSON.stringify({ text }) }),
  deleteApplication: (id: string) =>
    authed<{ ok: true }>(`/admin/applications/${id}`, { method: 'DELETE' }),
};
