'use client';
import React from 'react';
import { useController } from 'react-hook-form';

/* eslint-disable @typescript-eslint/no-explicit-any */

function Label({ label, htmlFor, required }: { label: string; htmlFor: string; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="field-label">
      {label}
      {required && <span className="text-danger"> *</span>}
    </label>
  );
}

/** CNIC input that inserts dashes as you type (12345-1234567-1) and blocks non-digits. */
export function CnicField({ control, name, label = 'CNIC', required }: { control: any; name: string; label?: string; required?: boolean }) {
  const { field, fieldState } = useController({ control, name });
  const format = (raw: string) => {
    const d = raw.replace(/\D/g, '').slice(0, 13);
    const parts = [d.slice(0, 5), d.slice(5, 12), d.slice(12, 13)].filter(Boolean);
    return parts.join('-');
  };
  return (
    <div>
      <Label label={label} htmlFor={name} required={required} />
      <input
        id={name}
        inputMode="numeric"
        placeholder="12345-1234567-1"
        className="field-input"
        aria-invalid={!!fieldState.error}
        value={(field.value as string) ?? ''}
        onChange={(e) => field.onChange(format(e.target.value))}
        onBlur={field.onBlur}
      />
      {fieldState.error && <p className="field-error" role="alert">{fieldState.error.message}</p>}
    </div>
  );
}

/** Pakistan mobile input, formats as 0300-1234567 and blocks non-digits. */
export function PhoneField({ control, name, label = 'Mobile number', required }: { control: any; name: string; label?: string; required?: boolean }) {
  const { field, fieldState } = useController({ control, name });
  const format = (raw: string) => {
    const d = raw.replace(/\D/g, '').slice(0, 11);
    return d.length > 4 ? `${d.slice(0, 4)}-${d.slice(4)}` : d;
  };
  return (
    <div>
      <Label label={label} htmlFor={name} required={required} />
      <input
        id={name}
        inputMode="numeric"
        placeholder="0300-1234567"
        className="field-input"
        aria-invalid={!!fieldState.error}
        value={(field.value as string) ?? ''}
        onChange={(e) => field.onChange(format(e.target.value))}
        onBlur={field.onBlur}
      />
      {fieldState.error && <p className="field-error" role="alert">{fieldState.error.message}</p>}
    </div>
  );
}

/** Currency input showing grouped digits with an "Rs" prefix; stores a number. */
export function MoneyField({ control, name, label, required }: { control: any; name: string; label: string; required?: boolean }) {
  const { field, fieldState } = useController({ control, name });
  const num = typeof field.value === 'number' && isFinite(field.value) ? field.value : undefined;
  return (
    <div>
      <Label label={label} htmlFor={name} required={required} />
      <div className="flex items-center rounded-md border border-line bg-white focus-within:border-verify">
        <span className="pl-3 pr-2 text-muted">Rs</span>
        <input
          id={name}
          inputMode="numeric"
          className="w-full bg-transparent py-2.5 pr-3 text-ink focus:outline-none"
          aria-invalid={!!fieldState.error}
          value={num !== undefined ? num.toLocaleString('en-PK') : ''}
          onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, '');
            field.onChange(digits === '' ? 0 : Number(digits));
          }}
          onBlur={field.onBlur}
        />
      </div>
      {fieldState.error && <p className="field-error" role="alert">{fieldState.error.message}</p>}
    </div>
  );
}

/** A grid of money fields with a live computed total. */
export function MoneyGrid({
  control,
  watch,
  fields,
  totalLabel,
}: {
  control: any;
  watch: (names?: string[]) => any;
  fields: { name: string; label: string }[];
  totalLabel: string;
}) {
  const values = watch(fields.map((f) => f.name)) as unknown[];
  const total = values.reduce<number>((acc, v) => acc + (typeof v === 'number' && isFinite(v) ? v : 0), 0);
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <MoneyField key={f.name} control={control} name={f.name} label={f.label} />
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between rounded-md bg-surface px-4 py-3">
        <span className="text-sm font-medium text-ink">{totalLabel}</span>
        <span className="font-serif text-lg text-ink">Rs {total.toLocaleString('en-PK')}</span>
      </div>
    </div>
  );
}
