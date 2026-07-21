'use client';
import { useCallback, useState } from 'react';
import { STEPS } from '@/lib/steps';
import { ProgressRail } from './ProgressRail';
import { Review } from './Review';
import { api, ApiError } from '@/lib/api';
import type { DraftInput, ApplicationInput } from '@finportal/shared';

type FormData = Record<string, unknown>;
type SaveState = 'idle' | 'saving' | 'saved' | 'error';
type Phase = 'form' | 'review' | 'done';
type LaterState = 'idle' | 'sending' | 'sent' | 'error';

export default function Wizard({
  initialData,
  initialAppId,
}: {
  initialData?: FormData;
  initialAppId?: string;
}) {
  const [phase, setPhase] = useState<Phase>('form');
  const [index, setIndex] = useState(0);
  const [data, setData] = useState<FormData>(initialData ?? {});
  const [completed, setCompleted] = useState<Set<number>>(
    () => new Set(STEPS.map((s, i) => (initialData?.[s.key] ? i : -1)).filter((i) => i >= 0))
  );
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [applicationId, setApplicationId] = useState<string | null>(initialAppId ?? null);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  const [later, setLater] = useState<LaterState>('idle');
  const [laterLink, setLaterLink] = useState<string | null>(null);

  const step = STEPS[index];
  const isFirst = index === 0;
  const isLast = index === STEPS.length - 1;

  const persist = useCallback(async (merged: FormData) => {
    const personal = merged.personal as { cnic?: string } | undefined;
    if (!personal?.cnic) return;
    setSaveState('saving');
    try {
      const res = await api.saveDraft(merged as DraftInput);
      setApplicationId(res.id);
      setSaveState('saved');
    } catch (err) {
      setSaveState(err instanceof ApiError && err.status === 400 ? 'idle' : 'error');
    }
  }, []);

  const handleSaveAndContinue = useCallback(
    (sliceData: unknown) => {
      const merged = { ...data, [step.key]: sliceData };
      setData(merged);
      setCompleted((prev) => new Set(prev).add(index));
      void persist(merged);
      if (isLast) setPhase('review');
      else setIndex((i) => i + 1);
    },
    [data, step.key, index, isLast, persist]
  );

  const handleFinishLater = useCallback(async () => {
    if (!applicationId) return;
    setLater('sending');
    try {
      const res = await api.sendResumeLink(applicationId);
      setLater('sent');
      if (res.token) setLaterLink(`${window.location.origin}/resume?token=${encodeURIComponent(res.token)}`);
    } catch {
      setLater('error');
    }
  }, [applicationId]);

  const handleSubmit = useCallback(
    async (captchaToken: string) => {
      setSubmitting(true);
      setSubmitError(null);
      try {
        const res = await api.submit(data as unknown as ApplicationInput, captchaToken);
        setReference(res.applicationId);
        setPhase('done');
      } catch (err) {
        setSubmitError(
          err instanceof ApiError
            ? err.status === 409
              ? 'An application with this CNIC has already been submitted.'
              : err.message
            : 'Something went wrong. Please try again.'
        );
      } finally {
        setSubmitting(false);
      }
    },
    [data]
  );

  if (phase === 'done') {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-verify text-white text-2xl">
          &#10003;
        </div>
        <h1 className="font-serif text-3xl text-ink">Application submitted</h1>
        <p className="mt-3 text-muted">
          Your reference number is <span className="font-medium text-ink">{reference}</span>. We&rsquo;ve
          emailed a confirmation; please keep the reference for your records.
        </p>
      </div>
    );
  }

  if (phase === 'review') {
    return (
      <Review
        data={data}
        submitting={submitting}
        error={submitError}
        onEdit={(i) => {
          setIndex(i);
          setPhase('form');
        }}
        onSubmit={handleSubmit}
      />
    );
  }

  const StepComponent = step.Component;
  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 md:grid-cols-[240px_1fr]">
      <aside className="md:sticky md:top-10 md:self-start">
        <ProgressRail currentIndex={index} completed={completed} onJump={setIndex} />
        <p className="mt-6 flex items-start gap-2 text-xs text-muted">
          <span aria-hidden>&#128274;</span>
          Your answers are encrypted and saved as you go.
        </p>
        <div className="mt-4">
          <button
            type="button"
            className="text-sm text-verify underline disabled:text-muted disabled:no-underline"
            onClick={handleFinishLater}
            disabled={!applicationId || later === 'sending'}
            title={!applicationId ? 'Complete the personal section first' : undefined}
          >
            {later === 'sending' ? 'Sending link…' : 'Save and finish later'}
          </button>
          {later === 'sent' && (
            <p className="mt-2 text-xs text-muted">
              We&rsquo;ve emailed you a secure link to continue.
              {laterLink && (
                <>
                  {' '}
                  <a href={laterLink} className="text-verify underline">
                    Dev link
                  </a>
                </>
              )}
            </p>
          )}
          {later === 'error' && <p className="mt-2 text-xs text-danger">Couldn&rsquo;t send the link.</p>}
        </div>
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
            applicationId={applicationId}
          />
        </div>
        <div className="mt-3 h-5 text-sm" aria-live="polite">
          {saveState === 'saving' && <span className="text-muted">Saving&hellip;</span>}
          {saveState === 'saved' && <span className="text-verify">Progress saved</span>}
          {saveState === 'error' && <span className="text-danger">Couldn&rsquo;t save &mdash; check your connection.</span>}
        </div>
      </main>
    </div>
  );
}
