'use client';
import React from 'react';

export function StepShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <header className="mb-6">
        <h2 className="font-serif text-2xl text-ink">{title}</h2>
        <p className="mt-1 text-muted">{description}</p>
      </header>
      <div className="space-y-5">{children}</div>
    </div>
  );
}

export function StepFooter({
  onBack,
  isFirst,
  saving,
  isLast,
}: {
  onBack: () => void;
  isFirst: boolean;
  saving: boolean;
  isLast: boolean;
}) {
  return (
    <div className="mt-8 flex items-center justify-between border-t border-line pt-5">
      <button type="button" className="btn-ghost" onClick={onBack} disabled={isFirst || saving}>
        Back
      </button>
      <button type="submit" className="btn-primary" disabled={saving}>
        {saving ? 'Saving…' : isLast ? 'Review application' : 'Save and continue'}
      </button>
    </div>
  );
}
