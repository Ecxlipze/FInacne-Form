'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRequireAuth } from '@/components/admin/AdminAuth';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { admin, ready, logout } = useRequireAuth();
  const router = useRouter();

  if (!ready) return <div className="p-10 text-muted">Loading…</div>;
  if (!admin) return null; // redirect in progress

  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-6">
            <span className="font-serif text-ink">Reviewer Console</span>
            <nav className="flex gap-4 text-sm">
              <Link href="/admin" className="text-muted hover:text-ink">
                Dashboard
              </Link>
              <Link href="/admin/applications" className="text-muted hover:text-ink">
                Applications
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted">
              {admin.email} · <span className="capitalize">{admin.role.replace('_', ' ')}</span>
            </span>
            <button
              className="text-ink underline"
              onClick={async () => {
                await logout();
                router.replace('/admin/login');
              }}
            >
              Log out
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
