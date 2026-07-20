'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { AdminShell } from '@/components/admin/AdminShell';
import { adminApi, ListResult } from '@/lib/adminApi';

const STATUSES = [
  '', 'submitted', 'pending', 'need_more_documents', 'hold', 'approved', 'rejected', 'cancelled',
];

export default function ApplicationsPage() {
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<ListResult | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    if (status) params.set('status', status);
    params.set('page', String(page));
    try {
      setResult(await adminApi.listApplications(params.toString()));
    } finally {
      setLoading(false);
    }
  }, [q, status, page]);

  useEffect(() => {
    load();
  }, [status, page]); // eslint-disable-line react-hooks/exhaustive-deps

  const totalPages = result ? Math.max(Math.ceil(result.total / result.limit), 1) : 1;

  return (
    <AdminShell>
      <h1 className="mb-6 font-serif text-2xl text-ink">Applications</h1>

      <div className="mb-5 flex flex-wrap items-end gap-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setPage(1);
            load();
          }}
          className="flex gap-2"
        >
          <input
            className="field-input w-72"
            placeholder="Search appId, CNIC, phone, or email"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button className="btn-ghost" type="submit">Search</button>
        </form>
        <select
          className="field-input w-48"
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s === '' ? 'All statuses' : s.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-card border border-line bg-white">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Application</th>
              <th className="px-4 py-3 font-medium">Applicant</th>
              <th className="px-4 py-3 font-medium">City</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {result?.items.map((a) => (
              <tr key={a._id} className="border-t border-line hover:bg-surface/60">
                <td className="px-4 py-3">
                  <Link href={`/admin/applications/${a._id}`} className="text-ink underline">
                    {a.appId ?? '(draft)'}
                  </Link>
                </td>
                <td className="px-4 py-3 text-ink">
                  {a.maskedName ?? '—'}{' '}
                  {a.cnicLast4 && <span className="text-muted">· …{a.cnicLast4}</span>}
                </td>
                <td className="px-4 py-3 text-muted">{a.city ?? '—'}</td>
                <td className="px-4 py-3 capitalize text-muted">{a.status.replace(/_/g, ' ')}</td>
                <td className="px-4 py-3 text-muted">
                  {a.submittedAt ? new Date(a.submittedAt).toLocaleDateString() : '—'}
                </td>
              </tr>
            ))}
            {result && result.items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted">
                  No applications match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-muted">
        <span>{loading ? 'Loading…' : `${result?.total ?? 0} total`}</span>
        <div className="flex items-center gap-3">
          <button className="btn-ghost" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button className="btn-ghost" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
            Next
          </button>
        </div>
      </div>
    </AdminShell>
  );
}
