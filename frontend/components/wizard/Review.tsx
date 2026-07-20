'use client';
import { useState } from 'react';
import { STEPS } from '@/lib/steps';
import { Turnstile } from '@/components/form/Turnstile';

type Data = Record<string, unknown>;

function humanize(key: string): string {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());
}

function display(value: unknown): string {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (value instanceof Date) return value.toLocaleDateString();
  if (typeof value === 'object') return '—';
  return String(value);
}

export function Review({
  data,
  onEdit,
  onSubmit,
  submitting,
  error,
}: {
  data: Data;
  onEdit: (index: number) => void;
  onSubmit: (captchaToken: string) => void;
  submitting: boolean;
  error: string | null;
}) {
  const [token, setToken] = useState<string>('');

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-8">
        <h1 className="font-serif text-3xl text-ink">Review your application</h1>
        <p className="mt-1 text-muted">Check each section. You can edit anything before submitting.</p>
      </header>

      <div className="space-y-4">
        {STEPS.map((step, i) => {
          const slice = (data[step.key] as Record<string, unknown>) ?? {};
          const entries = Object.entries(slice);
          return (
            <section key={step.key} className="rounded-card border border-line bg-white p-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-serif text-lg text-ink">{step.title}</h2>
                <button
                  type="button"
                  className="text-sm text-verify underline"
                  onClick={() => onEdit(i)}
                >
                  Edit
                </button>
              </div>
              {entries.length === 0 ? (
                <p className="text-sm text-muted">Not completed yet.</p>
              ) : (
                <dl className="grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
                  {entries.map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4 border-b border-line/60 py-1.5">
                      <dt className="text-sm text-muted">{humanize(k)}</dt>
                      <dd className="text-sm text-ink text-right">{display(v)}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </section>
          );
        })}
      </div>

      <div className="mt-8 rounded-card border border-line bg-white p-5">
        <p className="mb-3 text-sm text-muted">
          Confirm you’re human, then submit. You’ll receive a reference number.
        </p>
        <Turnstile onVerify={setToken} />
        {error && (
          <p className="mt-3 text-sm text-danger" role="alert">
            {error}
          </p>
        )}
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            className="btn-primary"
            disabled={submitting || !token}
            onClick={() => onSubmit(token)}
          >
            {submitting ? 'Submitting…' : 'Submit application'}
          </button>
        </div>
      </div>
    </div>
  );
}
