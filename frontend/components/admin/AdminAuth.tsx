'use client';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi, AdminUser } from '@/lib/adminApi';

interface AuthCtx {
  admin: AdminUser | null;
  ready: boolean; // true once the initial refresh attempt has settled
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [ready, setReady] = useState(false);

  // On load, the access token is gone (memory-only) but the refresh cookie may persist.
  useEffect(() => {
    adminApi
      .refresh()
      .then(setAdmin)
      .catch(() => setAdmin(null))
      .finally(() => setReady(true));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setAdmin(await adminApi.login(email, password));
  }, []);

  const logout = useCallback(async () => {
    await adminApi.logout();
    setAdmin(null);
  }, []);

  return <Ctx.Provider value={{ admin, ready, login, logout }}>{children}</Ctx.Provider>;
}

export function useAdminAuth(): AuthCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}

/** Redirect to login once we know the visitor isn't authenticated. */
export function useRequireAuth(): AuthCtx {
  const ctx = useAdminAuth();
  const router = useRouter();
  useEffect(() => {
    if (ctx.ready && !ctx.admin) router.replace('/admin/login');
  }, [ctx.ready, ctx.admin, router]);
  return ctx;
}
