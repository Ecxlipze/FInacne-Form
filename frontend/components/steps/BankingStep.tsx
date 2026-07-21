'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { bankingSchema } from '@finportal/shared';
import { TextField } from '@/components/form/Field';
import { StepShell, StepFooter } from '@/components/wizard/StepParts';
import type { StepProps } from './types';

type In = z.input<typeof bankingSchema>;

export default function BankingStep({ slice, onSaveAndContinue, onBack, isFirst, isLast, saving }: StepProps) {
  const { register, watch, handleSubmit, formState: { errors } } = useForm({
    mode: 'onTouched', resolver: zodResolver(bankingSchema), defaultValues: slice as In,
  });
  const e = errors as Record<string, { message?: string } | undefined>;
  const canContinue = bankingSchema.safeParse(watch()).success;
  return (
    <form onSubmit={handleSubmit((d) => onSaveAndContinue(d))} noValidate>
      <StepShell title="Banking" description="Where funds would be received.">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Bank name" required {...register('bankName')} error={e.bankName?.message} />
          <TextField label="Account title" required {...register('accountTitle')} error={e.accountTitle?.message} />
          <TextField label="IBAN" placeholder="PK36SCBL0000001123456702" required {...register('iban')} error={e.iban?.message} />
          <TextField label="Branch name" required {...register('branchName')} error={e.branchName?.message} />
          <TextField label="Branch code (optional)" {...register('branchCode')} error={e.branchCode?.message} />
        </div>
      </StepShell>
      <StepFooter onBack={onBack} isFirst={isFirst} isLast={isLast} saving={saving} canContinue={canContinue} />
    </form>
  );
}
