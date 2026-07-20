'use client';
import { STEPS } from '@/lib/steps';

export function ProgressRail({
  currentIndex,
  completed,
  onJump,
}: {
  currentIndex: number;
  completed: Set<number>;
  onJump: (index: number) => void;
}) {
  const pct = Math.round((completed.size / STEPS.length) * 100);

  return (
    <nav aria-label="Application sections" className="flex flex-col gap-1">
      <div className="mb-4">
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-medium text-ink">
            Section {currentIndex + 1} of {STEPS.length}
          </span>
          <span className="text-sm text-verify font-medium">{pct}%</span>
        </div>
        <div className="mt-2 h-1.5 w-full rounded-full bg-line" aria-hidden>
          <div className="h-full rounded-full bg-verify transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <ol className="flex flex-col">
        {STEPS.map((step, i) => {
          const isDone = completed.has(i);
          const isCurrent = i === currentIndex;
          const reachable = isDone || i <= currentIndex;
          return (
            <li key={step.key}>
              <button
                type="button"
                disabled={!reachable}
                onClick={() => reachable && onJump(i)}
                aria-current={isCurrent ? 'step' : undefined}
                className={`flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm transition-colors
                  ${isCurrent ? 'bg-ink/5 text-ink font-medium' : reachable ? 'text-ink hover:bg-line/40' : 'text-muted/60'}`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs
                    ${isDone ? 'border-verify bg-verify text-white' : isCurrent ? 'border-ink text-ink' : 'border-line text-muted'}`}
                  aria-hidden
                >
                  {isDone ? '✓' : String(i + 1).padStart(2, '0')}
                </span>
                {step.title}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
