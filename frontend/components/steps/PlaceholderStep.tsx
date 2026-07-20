'use client';
import { StepShell, StepFooter } from '@/components/wizard/StepParts';
import type { StepProps } from './types';

/** Temporary passthrough for sections still to be built. Advances without collecting data yet. */
export default function PlaceholderStep(props: StepProps & { title: string }) {
  const { onSaveAndContinue, onBack, isFirst, isLast, saving, title } = props;
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSaveAndContinue({});
      }}
      noValidate
    >
      <StepShell title={title} description="This section is being built. Continue for now.">
        <p className="text-muted">Fields for this section will appear here.</p>
      </StepShell>
      <StepFooter onBack={onBack} isFirst={isFirst} isLast={isLast} saving={saving} />
    </form>
  );
}
