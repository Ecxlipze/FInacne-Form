'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { declarationSchema } from '@finportal/shared';
import { CheckboxField } from '@/components/form/Field';
import { StepShell, StepFooter } from '@/components/wizard/StepParts';
import type { StepProps } from './types';

type In = z.input<typeof declarationSchema>;

export default function DeclarationStep({
  slice,
  onSaveAndContinue,
  onBack,
  isFirst,
  isLast,
  saving,
}: StepProps) {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
    resolver: zodResolver(declarationSchema),
    defaultValues: { privacyNoticeVersion: '2026-01', ...(slice as Partial<In>) } as In,
  });

  const canContinue = declarationSchema.safeParse(watch()).success;

  return (
    <form onSubmit={handleSubmit((d) => onSaveAndContinue(d))} noValidate>
      <StepShell
        title="Declaration"
        description="Please confirm the information you’ve provided is accurate."
      >
        <div className="rounded-md border border-line bg-surface p-4 text-sm text-muted">
          I declare that the information given is true and complete to the best of my knowledge, and I
          consent to it being processed for the purpose of this application.
        </div>
        <input type="hidden" {...register('privacyNoticeVersion')} />
        <CheckboxField label="I agree to the declaration above" {...register('agreed')} />
        {errors.agreed && (
          <p className="field-error" role="alert">
            {errors.agreed.message as string}
          </p>
        )}
      </StepShell>
      <StepFooter onBack={onBack} isFirst={isFirst} isLast={isLast} saving={saving} canContinue={canContinue} />
    </form>
  );
}
