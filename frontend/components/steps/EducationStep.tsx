'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { educationSchema, QUALIFICATIONS } from '@finportal/shared';
import { TextField, SelectField, CheckboxField } from '@/components/form/Field';
import { StepShell, StepFooter } from '@/components/wizard/StepParts';
import type { StepProps } from './types';

type In = z.input<typeof educationSchema>;

export default function EducationStep({ slice, onSaveAndContinue, onBack, isFirst, isLast, saving }: StepProps) {
  const { register, watch, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(educationSchema),
    defaultValues: slice as In,
  });
  const e = errors as Record<string, { message?: string } | undefined>;
  const isStudent = watch('isCurrentStudent');

  return (
    <form onSubmit={handleSubmit((d) => onSaveAndContinue(d))} noValidate>
      <StepShell title="Education" description="Your academic background.">
        <SelectField label="Highest qualification" required placeholder="Select qualification"
          options={QUALIFICATIONS.map((q) => ({ value: q.value, label: q.label }))}
          {...register('highestQualification')} error={e.highestQualification?.message} />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Degree / Certificate" required {...register('degree')} error={e.degree?.message} />
          <TextField label="Field of study" required {...register('fieldOfStudy')} error={e.fieldOfStudy?.message} />
          <TextField label="Institute name" required {...register('institute')} error={e.institute?.message} />
          <TextField label="Board / University" required {...register('board')} error={e.board?.message} />
          <TextField label="Graduation year" type="number" {...register('graduationYear')} error={e.graduationYear?.message} />
          <TextField label="Percentage / CGPA" placeholder="e.g. 3.5 or 82%" {...register('marks')} error={e.marks?.message} />
        </div>
        <CheckboxField label="I am currently a student" {...register('isCurrentStudent')} />
        {isStudent && (
          <TextField label="Current semester" type="number" required {...register('currentSemester')} error={e.currentSemester?.message} />
        )}
      </StepShell>
      <StepFooter onBack={onBack} isFirst={isFirst} isLast={isLast} saving={saving} />
    </form>
  );
}
