'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { contactSchema } from '@finportal/shared';
import { TextField, CheckboxField } from '@/components/form/Field';
import { StepShell, StepFooter } from '@/components/wizard/StepParts';
import type { StepProps } from './types';

type In = z.input<typeof contactSchema>;

export default function ContactStep({ slice, onSaveAndContinue, onBack, isFirst, isLast, saving }: StepProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: slice as In,
  });

  const sameAsPermanent = watch('sameAsPermanent');

  return (
    <form onSubmit={handleSubmit((d) => onSaveAndContinue(d))} noValidate>
      <StepShell title="Contact details" description="How we reach you, and where you live.">
        <TextField label="Email" type="email" {...register('email')} error={errors.email?.message} />
        <TextField
          label="Mobile number"
          placeholder="0301-2345678"
          {...register('phone')}
          error={errors.phone?.message as string | undefined}
        />
        <TextField label="Current address" {...register('currentAddress')} error={errors.currentAddress?.message} />
        <TextField label="City" {...register('city')} error={errors.city?.message} />

        <CheckboxField label="My permanent address is the same as my current address" {...register('sameAsPermanent')} />

        {/* Conditional: only ask for permanent address when it differs. */}
        {!sameAsPermanent && (
          <TextField
            label="Permanent address"
            {...register('permanentAddress')}
            error={errors.permanentAddress?.message}
          />
        )}
      </StepShell>
      <StepFooter onBack={onBack} isFirst={isFirst} isLast={isLast} saving={saving} />
    </form>
  );
}
