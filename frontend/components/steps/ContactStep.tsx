'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { contactSchema, PROVINCES, MAJOR_CITIES } from '@finportal/shared';
import { TextField, SelectField } from '@/components/form/Field';
import { PhoneField } from '@/components/form/controlled';
import { StepShell, StepFooter } from '@/components/wizard/StepParts';
import type { StepProps } from './types';

type In = z.input<typeof contactSchema>;

export default function ContactStep({ slice, onSaveAndContinue, onBack, isFirst, isLast, saving }: StepProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(contactSchema), defaultValues: slice as In });
  const e = errors as Record<string, { message?: string } | undefined>;

  return (
    <form onSubmit={handleSubmit((d) => onSaveAndContinue(d))} noValidate>
      <StepShell title="Contact details" description="How we reach you, and where you live.">
        <TextField label="Email" type="email" required {...register('email')} error={e.email?.message} />
        <PhoneField control={control} name="phone" required />

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="House / Flat number" required {...register('houseFlat')} error={e.houseFlat?.message} />
          <TextField label="Street / Block" required {...register('street')} error={e.street?.message} />
          <TextField label="Area / Locality" required {...register('area')} error={e.area?.message} />
          <SelectField
            label="City"
            required
            placeholder="Select city"
            options={MAJOR_CITIES.map((c) => ({ value: c, label: c }))}
            {...register('city')}
            error={e.city?.message}
          />
          <SelectField
            label="Province"
            required
            placeholder="Select province"
            options={PROVINCES.map((p) => ({ value: p, label: p }))}
            {...register('province')}
            error={e.province?.message}
          />
          <TextField label="Postal code (optional)" {...register('postalCode')} error={e.postalCode?.message} />
        </div>
      </StepShell>
      <StepFooter onBack={onBack} isFirst={isFirst} isLast={isLast} saving={saving} />
    </form>
  );
}
