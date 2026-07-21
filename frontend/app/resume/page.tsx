'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Wizard from '@/components/wizard/Wizard';
import { api, ApiError } from '@/lib/api';
import type { DraftInput } from '@finportal/shared';

function ResumeInner() {
  const params = useSearchParams();
  const token = params.get('token');
  const [state, setState] = useState<'loading' | 'ok' | 'invalid'>('loading');
  const [data, setData] = useState<DraftInput | null>(null);
  const [id, setId] = useState<string>('');

  useEffect(() => {
    if (!token) {
      setState('invalid');
      return;
    }
    api
      .resumeDraft(token)
      .then((res) => {
        setData(res.data);
        setId(res.id);
        setState('ok');
      })
      .catch((err) => {
        setState(err instanceof ApiError ? 'invalid' : 'invalid');
      });
  }, [token]);

  if (state === 'loading') return <div className="p-10 text-muted">Restoring your application…</div>;
  if (state === 'invalid') {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="font-serif text-2xl text-ink">This link isn’t valid</h1>
        <p className="mt-3 text-muted">
          Resume links expire and can only be used once. Please start again, or request a new link from
          within your application.
        </p>
        <Link href="/apply" className="btn-primary mt-6 inline-flex">
          Start a new application
        </Link>
      </div>
    );
  }
  return <Wizard initialData={(data ?? {}) as Record<string, unknown>} initialAppId={id} />;
}

export default function ResumePage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <span className="font-serif text-lg text-ink">Financial Information Portal</span>
        </div>
      </header>
      <Suspense fallback={<div className="p-10 text-muted">Loading…</div>}>
        <ResumeInner />
      </Suspense>
    </div>
  );
}
