import React from 'react';
import type { StepKey } from '@finportal/shared';
import { STEP_ORDER } from '@finportal/shared';
import type { StepProps } from '@/components/steps/types';
import PersonalStep from '@/components/steps/PersonalStep';
import ContactStep from '@/components/steps/ContactStep';
import EmploymentStep from '@/components/steps/EmploymentStep';
import DocumentsStep from '@/components/steps/DocumentsStep';
import DeclarationStep from '@/components/steps/DeclarationStep';
import PlaceholderStep from '@/components/steps/PlaceholderStep';

export interface StepMeta {
  key: StepKey;
  title: string;
  Component: React.ComponentType<StepProps>;
}

const TITLES: Record<StepKey, string> = {
  personal: 'Personal',
  contact: 'Contact',
  education: 'Education',
  employment: 'Employment',
  income: 'Income',
  expenses: 'Expenses',
  assets: 'Assets',
  liabilities: 'Liabilities',
  banking: 'Banking',
  family: 'Family',
  goals: 'Goals',
  documents: 'Documents',
  declaration: 'Declaration',
};

const BUILT: Partial<Record<StepKey, React.ComponentType<StepProps>>> = {
  personal: PersonalStep,
  contact: ContactStep,
  employment: EmploymentStep,
  documents: DocumentsStep,
  declaration: DeclarationStep,
};

/** Derived from the shared STEP_ORDER so frontend and backend never drift. */
export const STEPS: StepMeta[] = STEP_ORDER.map((key) => {
  const Built = BUILT[key];
  const Component: React.ComponentType<StepProps> = Built
    ? Built
    : (props: StepProps) => <PlaceholderStep {...props} title={TITLES[key]} />;
  return { key, title: TITLES[key], Component };
});
