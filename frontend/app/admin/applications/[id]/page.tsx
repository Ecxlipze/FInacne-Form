'use client';
import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AdminShell } from '@/components/admin/AdminShell';
import { useAdminAuth } from '@/components/admin/AdminAuth';
import { adminApi, AppDetail, DocMeta } from '@/lib/adminApi';

const STATUSES = ['submitted', 'pending', 'need_more_documents', 'hold', 'approved', 'rejected', 'cancelled'];

function humanize(key: string) {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());
}
function display(v: unknown) {
  if (v === null || v === undefined || v === '') return '—';
  if (typeof v === 'boolean') return v ? 'Yes' : 'No';
  if (typeof v === 'object') return JSON.stringify(v);
  return String(v);
}

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { admin } = useAdminAuth();
  const [app, setApp] = useState<AppDetail | null>(null);
  const [docs, setDocs] = useState<DocMeta[]>([]);
  const [status, setStatus] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const canReview = admin?.role === 'reviewer' || admin?.role === 'super_admin';
  const canDelete = admin?.role === 'super_admin';

  const load = useCallback(async () => {
    try {
      const detail = await adminApi.getApplication(id);
      setApp(detail);
      setStatus(detail.status);
      const d = await adminApi.listDocuments(id);
      setDocs(d.documents);
    } catch {
      setNotFound(true);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function saveStatus() {
    setBusy(true);
    try {
      await adminApi.changeStatus(id, status, note || undefined);
      setNote('');
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function openDocument(uploadId: string) {
    const { url } = await adminApi.downloadDocument(uploadId);
    window.open(url, '_blank', 'noopener');
  }

  async function erase() {
    if (!confirm('Permanently delete this application and all its documents? This cannot be undone.')) return;
    await adminApi.deleteApplication(id);
    router.replace('/admin/applications');
  }

  if (notFound) {
    return (
      <AdminShell>
        <p className="text-danger">Application not found.</p>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      {!app ? (
        <p className="text-muted">Loading…</p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="font-serif text-2xl text-ink">{app.appId ?? '(draft)'}</h1>
                <p className="text-sm capitalize text-muted">{app.status.replace(/_/g, ' ')}</p>
              </div>
            </div>

            {Object.entries(app.data).map(([section, fields]) => (
              <section key={section} className="mb-4 rounded-card border border-line bg-white p-5">
                <h2 className="mb-3 font-serif text-lg capitalize text-ink">{section}</h2>
                <dl className="grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
                  {Object.entries(fields ?? {}).map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4 border-b border-line/60 py-1.5">
                      <dt className="text-sm text-muted">{humanize(k)}</dt>
                      <dd className="text-right text-sm text-ink">{display(v)}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
          </div>

          <aside className="space-y-6">
            <section className="rounded-card border border-line bg-white p-5">
              <h2 className="mb-3 font-serif text-lg text-ink">Documents</h2>
              {docs.length === 0 && <p className="text-sm text-muted">No documents uploaded.</p>}
              <ul className="space-y-2">
                {docs.map((d) => (
                  <li key={d._id} className="flex items-center justify-between gap-2 text-sm">
                    <span className="text-ink">{humanize(d.docType)}</span>
                    {d.scanStatus === 'clean' ? (
                      <button className="text-verify underline" onClick={() => openDocument(d._id)}>
                        View
                      </button>
                    ) : (
                      <span className="text-muted capitalize">{d.scanStatus}</span>
                    )}
                  </li>
                ))}
              </ul>
            </section>

            {canReview && (
              <section className="rounded-card border border-line bg-white p-5">
                <h2 className="mb-3 font-serif text-lg text-ink">Update status</h2>
                <select className="field-input mb-3" value={status} onChange={(e) => setStatus(e.target.value)}>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
                <textarea
                  className="field-input mb-3"
                  rows={3}
                  placeholder="Internal note (optional)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
                <button className="btn-primary w-full" disabled={busy} onClick={saveStatus}>
                  {busy ? 'Saving…' : 'Save'}
                </button>
              </section>
            )}

            <section className="rounded-card border border-line bg-white p-5">
              <h2 className="mb-3 font-serif text-lg text-ink">Review trail</h2>
              {app.statusHistory.length === 0 && <p className="text-sm text-muted">No changes yet.</p>}
              <ol className="space-y-3">
                {app.statusHistory.map((h, i) => (
                  <li key={i} className="text-sm">
                    <p className="capitalize text-ink">{h.to.replace(/_/g, ' ')}</p>
                    <p className="text-xs text-muted">
                      {h.byEmail ?? 'system'} · {new Date(h.at).toLocaleString()}
                    </p>
                    {h.note && <p className="mt-1 text-muted">{h.note}</p>}
                  </li>
                ))}
              </ol>
            </section>

            {canDelete && (
              <button className="text-sm text-danger underline" onClick={erase}>
                Delete application (erasure)
              </button>
            )}
          </aside>
        </div>
      )}
    </AdminShell>
  );
}
