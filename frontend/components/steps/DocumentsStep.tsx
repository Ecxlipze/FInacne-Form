'use client';
import { FileUpload } from '@/components/form/FileUpload';
import { StepShell, StepFooter } from '@/components/wizard/StepParts';
import type { StepProps } from './types';

const DOCS: { docType: string; label: string }[] = [
  { docType: 'cnic', label: 'CNIC (front and back)' },
  { docType: 'income_proof', label: 'Proof of income' },
  { docType: 'utility_bill', label: 'Recent utility bill' },
  { docType: 'additional', label: 'Any additional document (optional)' },
];

export default function DocumentsStep({
  onSaveAndContinue,
  onBack,
  isFirst,
  isLast,
  saving,
  applicationId,
}: StepProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSaveAndContinue({ acknowledged: true });
      }}
      noValidate
    >
      <StepShell
        title="Documents"
        description="Upload clear scans or photos. PDF, JPEG, or PNG, up to 10 MB each."
      >
        {!applicationId && (
          <p className="rounded-md bg-warn/10 px-3 py-2 text-sm text-warn">
            Complete the personal section first so uploads can be attached to your application.
          </p>
        )}
        <div className="space-y-3">
          {DOCS.map((d) => (
            <FileUpload key={d.docType} applicationId={applicationId} docType={d.docType} label={d.label} />
          ))}
        </div>
      </StepShell>
      <StepFooter onBack={onBack} isFirst={isFirst} isLast={isLast} saving={saving} />
    </form>
  );
}
