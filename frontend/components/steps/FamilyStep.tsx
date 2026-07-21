'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { familySchema, MARITAL_STATUSES } from '@finportal/shared';
import { TextField, SelectField } from '@/components/form/Field';
import { MoneyField } from '@/components/form/controlled';
import { StepShell, StepFooter } from '@/components/wizard/StepParts';
import type { StepProps } from './types';

type In = z.input<typeof familySchema>;

export default function FamilyStep({ slice, onSaveAndContinue, onBack, isFirst, isLast, saving }: StepProps) {
  const { register, control, watch, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(familySchema), defaultValues: slice as In,
  });
  const e = errors as Record<string, { message?: string } | undefined>;
  const married = watch('maritalStatus') === 'married';
  return (
    <form onSubmit={handleSubmit((d) => onSaveAndContinue(d))} noValidate>
      <StepShell title="Family" description="Your household details.">
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField label="Marital status" required placeholder="Select status"
            options={MARITAL_STATUSES.map((m) => ({ value: m.value, label: m.label }))}
            {...register('maritalStatus')} error={e.maritalStatus?.message} />
          <TextField label="Number of family members" type="number" required {...register('familyMembers')} error={e.familyMembers?.message} />
          <TextField label="Number of dependents" type="number" required {...register('dependents')} error={e.dependents?.message} />
          {married && (
            <SelectField label="Spouse employment status" placeholder="Select status"
              options={[
                { value: 'employed', label: 'Employed' },
                { value: 'business', label: 'Business' },
                { value: 'homemaker', label: 'Homemaker' },
                { value: 'unemployed', label: 'Unemployed' },
                { value: 'not_applicable', label: 'Not applicable' },
              ]}
              {...register('spouseEmploymentStatus')} error={e.spouseEmploymentStatus?.message} />
          )}
          <MoneyField control={control} name="householdMonthlyIncome" label="Household monthly income" />
        </div>
      </StepShell>
      <StepFooter onBack={onBack} isFirst={isFirst} isLast={isLast} saving={saving} />
    </form>
  );
}
