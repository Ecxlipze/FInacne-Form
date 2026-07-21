'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { incomeSchema, expensesSchema, assetsSchema, liabilitiesSchema } from '@finportal/shared';
import { MoneyGrid } from '@/components/form/controlled';
import { StepShell, StepFooter } from '@/components/wizard/StepParts';
import type { StepProps } from './types';

/* eslint-disable @typescript-eslint/no-explicit-any */

function makeFinancialStep(
  schema: z.ZodTypeAny,
  fields: { name: string; label: string }[],
  meta: { title: string; description: string; totalLabel: string }
) {
  return function FinancialStep({ slice, onSaveAndContinue, onBack, isFirst, isLast, saving }: StepProps) {
    const { control, watch, handleSubmit } = useForm({
      resolver: zodResolver(schema as any),
      defaultValues: slice as any,
    });
    return (
      <form onSubmit={handleSubmit((d) => onSaveAndContinue(d))} noValidate>
        <StepShell title={meta.title} description={meta.description}>
          <MoneyGrid control={control} watch={watch} fields={fields} totalLabel={meta.totalLabel} />
        </StepShell>
        <StepFooter onBack={onBack} isFirst={isFirst} isLast={isLast} saving={saving} />
      </form>
    );
  };
}

export const IncomeStep = makeFinancialStep(
  incomeSchema,
  [
    { name: 'monthlySalary', label: 'Monthly salary' },
    { name: 'businessIncome', label: 'Business income' },
    { name: 'pension', label: 'Pension' },
    { name: 'rentalIncome', label: 'Rental income' },
    { name: 'freelancingIncome', label: 'Freelancing income' },
    { name: 'otherIncome', label: 'Other income' },
  ],
  { title: 'Monthly income', description: 'Enter each source you receive. Leave blank if it doesn’t apply.', totalLabel: 'Total monthly income' }
);

export const ExpensesStep = makeFinancialStep(
  expensesSchema,
  [
    { name: 'houseRent', label: 'House rent' },
    { name: 'electricity', label: 'Electricity' },
    { name: 'gas', label: 'Gas' },
    { name: 'internet', label: 'Internet' },
    { name: 'water', label: 'Water' },
    { name: 'education', label: 'Education' },
    { name: 'medical', label: 'Medical' },
    { name: 'transportation', label: 'Transportation' },
    { name: 'groceries', label: 'Groceries' },
    { name: 'loanInstallments', label: 'Loan installments' },
    { name: 'otherExpenses', label: 'Other expenses' },
  ],
  { title: 'Monthly expenses', description: 'Your typical monthly household spending.', totalLabel: 'Total monthly expenses' }
);

export const AssetsStep = makeFinancialStep(
  assetsSchema,
  [
    { name: 'property', label: 'Property' },
    { name: 'vehicle', label: 'Vehicle' },
    { name: 'savings', label: 'Savings' },
    { name: 'investments', label: 'Investments' },
    { name: 'gold', label: 'Gold' },
    { name: 'businessAssets', label: 'Business assets' },
    { name: 'otherAssets', label: 'Other assets' },
  ],
  { title: 'Assets', description: 'Estimated current value of what you own.', totalLabel: 'Total assets' }
);

export const LiabilitiesStep = makeFinancialStep(
  liabilitiesSchema,
  [
    { name: 'homeLoan', label: 'Home loan' },
    { name: 'personalLoan', label: 'Personal loan' },
    { name: 'creditCardDebt', label: 'Credit card debt' },
    { name: 'vehicleLoan', label: 'Vehicle loan' },
    { name: 'businessLoan', label: 'Business loan' },
    { name: 'otherLiabilities', label: 'Other liabilities' },
  ],
  { title: 'Liabilities', description: 'Outstanding balances you currently owe.', totalLabel: 'Total liabilities' }
);
