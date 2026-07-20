'use client';
import { useCallback, useRef, useState } from 'react';
import { STEPS } from '@/lib/steps';
import { ProgressRail } from './ProgressRail';
import { api, ApiError } from '@/lib/api';
import type { DraftInput } from '@finportal/shared';

type FormData = Record<string, unknown>;
type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export default function Wizard() {
  const [index, setIndex] = useState(0);
  const [data, setData] = useState<FormData>({});
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const appIdRef = useRef<string | null>(null);

  const step = STEPS[index];
  const isFirst = index === 0;
  const isLast = index === STEPS.length - 1;

  const persist = useCallback(async (merged: FormData) => {
    // Autosave requires a CNIC (the server indexes on it); skip silently until it's present.
    const personal = merged.personal as { cnic?: string } | undefined;
    if (!personal?.cnic) return;
    setSaveState('saving');
    try {
      const res = await api.saveDraft(merged as DraftInput);
      appIdRef.current = res.id;
      setSaveState('saved');
    } catch (err) {
      // A validation 400 here means an earlier section is incomplete; keep the draft locally.
      setSaveState(err instanceof ApiError && err.status === 400 ? 'idle' : 'error');
    }
  }, []);

  const handleSaveAndContinue = useCallback(
    (sliceData: unknown) => {
      const merged = { ...data, [step.key]: sliceData };
      setData(merged);
      setCompleted((prev) => new Set(prev).add(index));
      void persist(merged);
      if (!isLast) setIndex((i) => i + 1);
      // isLast -> in a later block this routes to the review page.
    },
    [data, step.key, index, isLast, persist]
  );

  const StepComponent = step.Component;

  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 md:grid-cols-[240px_1fr]">
      <aside className="md:sticky md:top-10 md:self-start">
        <ProgressRail currentIndex={index} completed={completed} onJump={setIndex} />
        <p className="mt-6 flex items-start gap-2 text-xs text-muted">
          <span aria-hidden>🔒</span>
          Your answers are encrypted and saved as you go. You can leave and resume later.
        </p>
      </aside>

      <main>
        <div className="rounded-card border border-line bg-white p-6 md:p-8 shadow-sm">
          <StepComponent
            slice={(data[step.key] as Record<string, unknown>) ?? {}}
            onSaveAndContinue={handleSaveAndContinue}
            onBack={() => setIndex((i) => Math.max(i - 1, 0))}
            isFirst={isFirst}
            isLast={isLast}
            saving={saveState === 'saving'}
          />
        </div>
        <div className="mt-3 h-5 text-sm" aria-live="polite">
          {saveState === 'saving' && <span className="text-muted">Saving…</span>}
          {saveState === 'saved' && <span className="text-verify">Progress saved</span>}
          {saveState === 'error' && <span className="text-danger">Couldn’t save — check your connection.</span>}
        </div>
      </main>
    </div>
  );
}
