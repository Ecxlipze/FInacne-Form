'use client';
import { useState } from 'react';
import { ALLOWED_UPLOAD_TYPES, MAX_UPLOAD_BYTES } from '@finportal/shared';
import { api, uploadToStorage, ApiError } from '@/lib/api';

type Status = 'idle' | 'uploading' | 'uploaded' | 'error';

export function FileUpload({
  applicationId,
  docType,
  label,
}: {
  applicationId: string | null;
  docType: string;
  label: string;
}) {
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');

  async function handleFile(file: File) {
    setFileName(file.name);
    if (!ALLOWED_UPLOAD_TYPES.includes(file.type as (typeof ALLOWED_UPLOAD_TYPES)[number])) {
      setStatus('error');
      setMessage('Use a PDF, JPEG, or PNG file.');
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setStatus('error');
      setMessage('File is larger than 10 MB.');
      return;
    }
    if (!applicationId) {
      setStatus('error');
      setMessage('Fill in your personal details first so we can attach this to your application.');
      return;
    }
    setStatus('uploading');
    setMessage('');
    try {
      const { path, token } = await api.presignUpload(applicationId, docType, file.name, file.type);
      const ok = await uploadToStorage(path, token, file);
      if (!ok) throw new Error('Upload rejected');
      setStatus('uploaded');
      setMessage('Uploaded — we’ll scan it before review.');
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof ApiError ? err.message : 'Upload failed. Please try again.');
    }
  }

  return (
    <div className="rounded-md border border-line bg-white p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-ink">{label}</p>
          {fileName && <p className="text-xs text-muted">{fileName}</p>}
        </div>
        <label className="btn-ghost cursor-pointer text-sm">
          {status === 'uploaded' ? 'Replace' : 'Choose file'}
          <input
            type="file"
            className="sr-only"
            accept={ALLOWED_UPLOAD_TYPES.join(',')}
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </label>
      </div>
      {status !== 'idle' && (
        <p
          className={`mt-2 text-sm ${
            status === 'error' ? 'text-danger' : status === 'uploaded' ? 'text-verify' : 'text-muted'
          }`}
          role={status === 'error' ? 'alert' : undefined}
        >
          {status === 'uploading' ? 'Uploading…' : message}
        </p>
      )}
    </div>
  );
}
