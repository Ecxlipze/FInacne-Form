'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { goalsSchema, APPLICATION_PURPOSES, TIMELINES } from '@finportal/shared';
import { SelectField, TextareaField } from '@/components/form/Field';
import { MoneyField } from '@/components/form/controlled';
import { StepShell, StepFooter } from '@/components/wizard/StepParts';
import type { StepProps } from './types';

type In = z.input<typeof goalsSchema>;

export default function GoalsStep({ slice, onSaveAndContinue, onBack, isFirst, isLast, saving }: StepProps) {
  const { register, control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(goalsSchema), defaultValues: slice as In,
  });
  const e = errors as Record<string, { message?: string } | undefined>;
  return (
    <form onSubmit={handleSubmit((d) => onSaveAndContinue(d))} noValidate>
      <StepShell title="Financial goals" description="Tell us what this application is for.">
        <SelectField label="Purpose of application" required placeholder="Select purpose"
          options={APPLICATION_PURPOSES.map((p) => ({ value: p.value, label: p.label }))}
          {...register('purpose')} error={e.purpose?.message} />
        <TextareaField label="Describe your goal" required {...register('goals')} error={e.goals?.message} />
        <div className="grid gap-4 sm:grid-cols-2">
          <MoneyField control={control} name="amountRequired" label="Amount required" required />
          <SelectField label="Expected timeline" required placeholder="Select timeline"
            options={TIMELINES.map((t) => ({ value: t.value, label: t.label }))}
            {...register('timeline')} error={e.timeline?.message} />
        </div>
        <TextareaField label="Additional notes (optional)" {...register('additionalNotes')} error={e.additionalNotes?.message} />
      </StepShell>
      <StepFooter onBack={onBack} isFirst={isFirst} isLast={isLast} saving={saving} />
    </form>
  );
}
