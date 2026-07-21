'use client';
import { useForm, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { employmentSchema, EMPLOYMENT_TYPES } from '@finportal/shared';
import { TextField, SelectField } from '@/components/form/Field';
import { MoneyField } from '@/components/form/controlled';
import { StepShell, StepFooter } from '@/components/wizard/StepParts';
import type { StepProps } from './types';

interface EmploymentForm {
  status?: 'employed' | 'business' | 'student' | 'retired' | 'unemployed';
  companyName?: string; jobTitle?: string; industry?: string;
  employmentType?: string; joiningDate?: string; monthlySalary?: number;
  experienceYears?: number; employerAddress?: string;
  businessName?: string; businessType?: string; businessStartDate?: string;
  monthlyBusinessIncome?: number; businessAddress?: string;
  institution?: string; semester?: number; pensionMonthly?: number;
}

const STATUS_OPTIONS = [
  { value: 'employed', label: 'Employed' },
  { value: 'business', label: 'Business owner' },
  { value: 'student', label: 'Student' },
  { value: 'retired', label: 'Retired' },
  { value: 'unemployed', label: 'Unemployed' },
];

export default function EmploymentStep({ slice, onSaveAndContinue, onBack, isFirst, isLast, saving }: StepProps) {
  const { register, control, watch, handleSubmit, formState: { errors } } = useForm<EmploymentForm>({
    mode: 'onTouched',
    resolver: zodResolver(employmentSchema) as unknown as Resolver<EmploymentForm>,
    defaultValues: slice as EmploymentForm,
  });
  const status = watch('status');
  const e = errors as Record<string, { message?: string } | undefined>;
  const canContinue = employmentSchema.safeParse(watch()).success;

  return (
    <form onSubmit={handleSubmit((d) => onSaveAndContinue(d))} noValidate>
      <StepShell title="Employment" description="Your work situation determines what we ask next.">
        <SelectField label="Employment status" required placeholder="Select status"
          options={STATUS_OPTIONS} {...register('status')} error={e.status?.message} />

        {status === 'employed' && (
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Company name" required {...register('companyName')} error={e.companyName?.message} />
            <TextField label="Job title" required {...register('jobTitle')} error={e.jobTitle?.message} />
            <TextField label="Industry" required {...register('industry')} error={e.industry?.message} />
            <SelectField label="Employment type" required placeholder="Select type"
              options={EMPLOYMENT_TYPES.map((t) => ({ value: t.value, label: t.label }))}
              {...register('employmentType')} error={e.employmentType?.message} />
            <TextField label="Joining date" type="date" required {...register('joiningDate')} error={e.joiningDate?.message} />
            <TextField label="Experience (years)" type="number" required {...register('experienceYears')} error={e.experienceYears?.message} />
            <MoneyField control={control} name="monthlySalary" label="Monthly salary" required />
            <TextField label="Employer address" required {...register('employerAddress')} error={e.employerAddress?.message} />
          </div>
        )}
        {status === 'business' && (
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Business name" required {...register('businessName')} error={e.businessName?.message} />
            <TextField label="Business type" {...register('businessType')} error={e.businessType?.message} />
            <TextField label="Business start date" type="date" required {...register('businessStartDate')} error={e.businessStartDate?.message} />
            <MoneyField control={control} name="monthlyBusinessIncome" label="Monthly business income" required />
            <TextField label="Business address" required {...register('businessAddress')} error={e.businessAddress?.message} />
          </div>
        )}
        {status === 'student' && (
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Institution" required {...register('institution')} error={e.institution?.message} />
            <TextField label="Current semester" type="number" required {...register('semester')} error={e.semester?.message} />
          </div>
        )}
        {status === 'retired' && <MoneyField control={control} name="pensionMonthly" label="Monthly pension (optional)" />}
        {status === 'unemployed' && <p className="text-sm text-muted">No further employment details are needed.</p>}
      </StepShell>
      <StepFooter onBack={onBack} isFirst={isFirst} isLast={isLast} saving={saving} canContinue={canContinue} />
    </form>
  );
}
