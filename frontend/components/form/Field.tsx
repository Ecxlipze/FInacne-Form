'use client';
import React from 'react';

interface FieldWrap {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}
function Wrap({ label, htmlFor, error, hint, required, children }: FieldWrap) {
  return (
    <div>
      <label htmlFor={htmlFor} className="field-label">
        {label}
        {required && <span className="text-danger"> *</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-sm text-muted">{hint}</p>}
      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
};
export const TextField = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, required, id, ...rest }, ref) => {
    const fieldId = id ?? rest.name ?? label;
    return (
      <Wrap label={label} htmlFor={fieldId} error={error} hint={hint} required={required}>
        <input id={fieldId} ref={ref} aria-invalid={!!error} className="field-input" {...rest} />
      </Wrap>
    );
  }
);
TextField.displayName = 'TextField';

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
  required?: boolean;
};
export const TextareaField = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, required, id, ...rest }, ref) => {
    const fieldId = id ?? rest.name ?? label;
    return (
      <Wrap label={label} htmlFor={fieldId} error={error} required={required}>
        <textarea id={fieldId} ref={ref} aria-invalid={!!error} className="field-input" rows={4} {...rest} />
      </Wrap>
    );
  }
);
TextareaField.displayName = 'TextareaField';

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
};
export const SelectField = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, required, id, ...rest }, ref) => {
    const fieldId = id ?? rest.name ?? label;
    return (
      <Wrap label={label} htmlFor={fieldId} error={error} required={required}>
        <select id={fieldId} ref={ref} aria-invalid={!!error} className="field-input" {...rest}>
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Wrap>
    );
  }
);
SelectField.displayName = 'SelectField';

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & { label: string };
export const CheckboxField = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, id, ...rest }, ref) => {
    const fieldId = id ?? rest.name ?? label;
    return (
      <label htmlFor={fieldId} className="flex items-center gap-2.5 text-sm text-ink cursor-pointer">
        <input
          id={fieldId}
          ref={ref}
          type="checkbox"
          className="h-4 w-4 rounded border-line text-verify focus:ring-verify"
          {...rest}
        />
        {label}
      </label>
    );
  }
);
CheckboxField.displayName = 'CheckboxField';
