'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { personalSchema } from '@finportal/shared';
import { TextField, SelectField } from '@/components/form/Field';
import { StepShell, StepFooter } from '@/components/wizard/StepParts';
import type { StepProps } from './types';

type In = z.input<typeof personalSchema>;

export default function PersonalStep({ slice, onSaveAndContinue, onBack, isFirst, isLast, saving }: StepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(personalSchema),
    defaultValues: slice as In,
  });

  return (
    <form onSubmit={handleSubmit((d) => onSaveAndContinue(d))} noValidate>
      <StepShell title="Personal information" description="Tell us who you are, exactly as on your CNIC.">
        <TextField label="Full name" {...register('fullName')} error={errors.fullName?.message} />
        <TextField
          label="CNIC"
          placeholder="42101-1234567-8"
          hint="13 digits, with or without dashes."
          {...register('cnic')}
          error={errors.cnic?.message as string | undefined}
        />
        <TextField label="Date of birth" type="date" {...register('dob')} error={errors.dob?.message as string | undefined} />
        <SelectField
          label="Gender (optional)"
          placeholder="Prefer not to say"
          options={[
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'other', label: 'Other' },
          ]}
          {...register('gender')}
          error={errors.gender?.message}
        />
      </StepShell>
      <StepFooter onBack={onBack} isFirst={isFirst} isLast={isLast} saving={saving} />
    </form>
  );
}
