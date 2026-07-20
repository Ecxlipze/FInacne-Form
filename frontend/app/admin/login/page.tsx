'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/components/admin/AdminAuth';
import { AdminApiError } from '@/lib/adminApi';

export default function AdminLoginPage() {
  const { admin, ready, login } = useAdminAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (ready && admin) router.replace('/admin');
  }, [ready, admin, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await login(email, password);
      router.replace('/admin');
    } catch (err) {
      setError(err instanceof AdminApiError && err.status === 401 ? 'Invalid credentials.' : 'Sign-in failed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-card border border-line bg-white p-7 shadow-sm">
        <h1 className="font-serif text-2xl text-ink">Reviewer Console</h1>
        <p className="mt-1 mb-6 text-sm text-muted">Sign in to review applications.</p>
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="field-label">Email</label>
            <input id="email" type="email" className="field-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="password" className="field-label">Password</label>
            <input id="password" type="password" className="field-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="field-error" role="alert">{error}</p>}
          <button type="submit" className="btn-primary w-full" disabled={busy}>
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </div>
      </form>
    </div>
  );
}
