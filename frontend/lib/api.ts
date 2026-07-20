import type { DraftInput, ApplicationInput } from '@finportal/shared';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, data.error ?? 'Request failed', data.issues);
  return data as T;
}

export class ApiError extends Error {
  constructor(public status: number, message: string, public issues?: unknown) {
    super(message);
  }
}

export interface FormConfig {
  steps: string[];
  privacyNoticeVersion: string;
  upload: { allowedTypes: string[]; maxBytes: number };
}

export const api = {
  getFormConfig: () => req<FormConfig>('/form/config'),

  saveDraft: (data: DraftInput) =>
    req<{ id: string; updatedAt: string }>('/application/save', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  sendResumeLink: (applicationId: string) =>
    req<{ ok: true; token?: string; expiresAt?: string }>('/application/resume-link', {
      method: 'POST',
      body: JSON.stringify({ applicationId }),
    }),

  resumeDraft: (token: string) =>
    req<{ id: string; data: DraftInput }>('/application/resume', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }),

  submit: (application: ApplicationInput, captchaToken?: string) =>
    req<{ ok: true; applicationId: string }>('/application/submit', {
      method: 'POST',
      body: JSON.stringify({ application, captchaToken }),
    }),
};
