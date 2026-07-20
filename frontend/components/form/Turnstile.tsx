'use client';
import { useEffect, useRef } from 'react';

// Minimal ambient type for the Turnstile global.
declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: { sitekey: string; callback: (token: string) => void }) => void;
    };
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function Turnstile({ onVerify }: { onVerify: (token: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const rendered = useRef(false);

  useEffect(() => {
    // Dev bypass: with no site key, the backend also skips verification in development.
    if (!SITE_KEY) {
      onVerify('dev-bypass');
      return;
    }
    const id = 'cf-turnstile-script';
    function render() {
      if (rendered.current || !ref.current || !window.turnstile) return;
      rendered.current = true;
      window.turnstile.render(ref.current, { sitekey: SITE_KEY!, callback: onVerify });
    }
    if (!document.getElementById(id)) {
      const s = document.createElement('script');
      s.id = id;
      s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      s.async = true;
      s.onload = render;
      document.head.appendChild(s);
    } else {
      render();
    }
  }, [onVerify]);

  if (!SITE_KEY) {
    return <p className="text-xs text-muted">Verification is skipped in development.</p>;
  }
  return <div ref={ref} />;
}
