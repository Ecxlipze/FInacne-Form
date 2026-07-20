export interface StepProps {
  slice: Record<string, unknown>;
  onSaveAndContinue: (data: unknown) => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
  saving: boolean;
  applicationId: string | null; // available once autosave has created the draft
}
