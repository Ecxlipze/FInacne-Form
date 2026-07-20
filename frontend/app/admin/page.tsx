'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminShell } from '@/components/admin/AdminShell';
import { adminApi, DashboardStats } from '@/lib/adminApi';

const STATUS_LABELS: Record<string, string> = {
  submitted: 'Submitted',
  pending: 'Pending',
  need_more_documents: 'Needs documents',
  hold: 'On hold',
  approved: 'Approved',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
};

function Card({ label, value, href }: { label: string; value: number; href?: string }) {
  const inner = (
    <div className="rounded-card border border-line bg-white p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 font-serif text-3xl text-ink">{value}</p>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    adminApi.dashboard().then(setStats).catch(() => setError(true));
  }, []);

  return (
    <AdminShell>
      <h1 className="mb-6 font-serif text-2xl text-ink">Overview</h1>
      {error && <p className="text-danger">Couldn’t load the dashboard.</p>}
      {stats && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card label="Total applications" value={stats.total} href="/admin/applications" />
            <Card label="Submitted today" value={stats.today} />
            <Card label="This month" value={stats.thisMonth} />
          </div>
          <h2 className="mb-3 mt-8 font-serif text-lg text-ink">By status</h2>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Object.entries(STATUS_LABELS).map(([key, label]) => (
              <Card
                key={key}
                label={label}
                value={stats.byStatus[key] ?? 0}
                href={`/admin/applications?status=${key}`}
              />
            ))}
          </div>
        </>
      )}
    </AdminShell>
  );
}
