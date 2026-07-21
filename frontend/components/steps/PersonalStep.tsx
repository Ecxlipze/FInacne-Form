'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { personalSchema } from '@finportal/shared';
import { TextField, SelectField } from '@/components/form/Field';
import { CnicField } from '@/components/form/controlled';
import { StepShell, StepFooter } from '@/components/wizard/StepParts';
import type { StepProps } from './types';

type In = z.input<typeof personalSchema>;

export default function PersonalStep({ slice, onSaveAndContinue, onBack, isFirst, isLast, saving }: StepProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(personalSchema), defaultValues: slice as In });

  return (
    <form onSubmit={handleSubmit((d) => onSaveAndContinue(d))} noValidate>
      <StepShell title="Personal information" description="Enter your details exactly as they appear on your CNIC.">
        <TextField label="Full name" required {...register('fullName')} error={errors.fullName?.message} />
        <CnicField control={control} name="cnic" required />
        <TextField label="Date of birth" type="date" required {...register('dob')} error={errors.dob?.message as string | undefined} />
        <SelectField
          label="Gender"
          required
          placeholder="Select gender"
          options={[
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'other', label: 'Other' },
            { value: 'prefer_not_to_say', label: 'Prefer not to say' },
          ]}
          {...register('gender')}
          error={errors.gender?.message}
        />
      </StepShell>
      <StepFooter onBack={onBack} isFirst={isFirst} isLast={isLast} saving={saving} />
    </form>
  );
}
