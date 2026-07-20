'use client';
import { useForm, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { employmentSchema } from '@finportal/shared';
import { TextField, SelectField } from '@/components/form/Field';
import { StepShell, StepFooter } from '@/components/wizard/StepParts';
import type { StepProps } from './types';

// A flat superset of every employment variant's fields, so field paths stay simple.
// The shared discriminated-union schema still enforces which fields are required per status.
interface EmploymentForm {
  status?: 'employed' | 'business' | 'student' | 'retired' | 'unemployed';
  employerName?: string;
  joiningDate?: string;
  businessName?: string;
  businessStartDate?: string;
  institution?: string;
  semester?: number;
}

const STATUS_OPTIONS = [
  { value: 'employed', label: 'Employed' },
  { value: 'business', label: 'Business owner' },
  { value: 'student', label: 'Student' },
  { value: 'retired', label: 'Retired' },
  { value: 'unemployed', label: 'Unemployed' },
];

export default function EmploymentStep({ slice, onSaveAndContinue, onBack, isFirst, isLast, saving }: StepProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<EmploymentForm>({
    resolver: zodResolver(employmentSchema) as unknown as Resolver<EmploymentForm>,
    defaultValues: slice as EmploymentForm,
  });

  const status = watch('status');
  const err = errors as Record<string, { message?: string } | undefined>;

  return (
    <form onSubmit={handleSubmit((d) => onSaveAndContinue(d))} noValidate>
      <StepShell title="Employment" description="Your current work situation determines what we ask next.">
        <SelectField
          label="Employment status"
          placeholder="Select one"
          options={STATUS_OPTIONS}
          {...register('status')}
          error={err.status?.message}
        />

        {status === 'employed' && (
          <>
            <TextField label="Employer name" {...register('employerName')} error={err.employerName?.message} />
            <TextField label="Joining date" type="date" {...register('joiningDate')} error={err.joiningDate?.message} />
          </>
        )}
        {status === 'business' && (
          <>
            <TextField label="Business name" {...register('businessName')} error={err.businessName?.message} />
            <TextField label="Business start date" type="date" {...register('businessStartDate')} error={err.businessStartDate?.message} />
          </>
        )}
        {status === 'student' && (
          <>
            <TextField label="Institution" {...register('institution')} error={err.institution?.message} />
            <TextField label="Current semester" type="number" {...register('semester')} error={err.semester?.message} />
          </>
        )}
        {(status === 'retired' || status === 'unemployed') && (
          <p className="text-sm text-muted">No further employment details are needed.</p>
        )}
      </StepShell>
      <StepFooter onBack={onBack} isFirst={isFirst} isLast={isLast} saving={saving} />
    </form>
  );
}
