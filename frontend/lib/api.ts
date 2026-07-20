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

export interface PresignResponse {
  uploadId: string;
  key: string;
  post: { url: string; fields: Record<string, string> };
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

  presignUpload: (applicationId: string, docType: string, filename: string, contentType: string) =>
    req<PresignResponse>('/upload/presign', {
      method: 'POST',
      body: JSON.stringify({ applicationId, docType, filename, contentType }),
    }),

  submit: (application: ApplicationInput, captchaToken?: string) =>
    req<{ ok: true; applicationId: string }>('/application/submit', {
      method: 'POST',
      body: JSON.stringify({ application, captchaToken }),
    }),
};

/** Upload a file straight to S3 using the presigned POST policy. Returns true on success. */
export async function uploadToS3(
  post: { url: string; fields: Record<string, string> },
  file: File
): Promise<boolean> {
  const form = new FormData();
  Object.entries(post.fields).forEach(([k, v]) => form.append(k, v));
  form.append('file', file); // must be last for S3 POST policy
  const res = await fetch(post.url, { method: 'POST', body: form });
  return res.ok; // S3 returns 204 on success
}
