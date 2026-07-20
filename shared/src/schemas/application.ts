import { z } from 'zod';
import {
  personalSchema, contactSchema, educationSchema, employmentSchema, incomeSchema,
  expensesSchema, assetsSchema, liabilitiesSchema, bankingSchema, familySchema,
  goalsSchema, documentsSchema, declarationSchema,
} from './sections';

/** Ordered wizard steps. The frontend maps over this; the backend validates each on save. */
export const stepSchemas = {
  personal: personalSchema,
  contact: contactSchema,
  education: educationSchema,
  employment: employmentSchema,
  income: incomeSchema,
  expenses: expensesSchema,
  assets: assetsSchema,
  liabilities: liabilitiesSchema,
  banking: bankingSchema,
  family: familySchema,
  goals: goalsSchema,
  documents: documentsSchema,
  declaration: declarationSchema,
} as const;

export type StepKey = keyof typeof stepSchemas;
export const STEP_ORDER: StepKey[] = Object.keys(stepSchemas) as StepKey[];

/** Full form. Autosave validates a single step; submit validates the whole thing. */
export const applicationSchema = z.object({
  personal: personalSchema,
  contact: contactSchema,
  education: educationSchema,
  employment: employmentSchema,
  income: incomeSchema,
  expenses: expensesSchema,
  assets: assetsSchema,
  liabilities: liabilitiesSchema,
  banking: bankingSchema,
  family: familySchema,
  goals: goalsSchema,
  documents: documentsSchema,
  declaration: declarationSchema,
});

export type ApplicationInput = z.infer<typeof applicationSchema>;

/** Autosave allows partial data (draft in progress); submit uses the full schema. */
export const draftSchema = applicationSchema.deepPartial();
export type DraftInput = z.infer<typeof draftSchema>;

// --- File upload constraints (Phase 8) ---
export const ALLOWED_UPLOAD_TYPES = ['image/png', 'image/jpeg', 'application/pdf'] as const;
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB

export const uploadMetaSchema = z.object({
  filename: z.string().min(1).max(255),
  contentType: z.enum(ALLOWED_UPLOAD_TYPES),
  sizeBytes: z.number().int().positive().max(MAX_UPLOAD_BYTES, 'File exceeds 10 MB'),
});
export type UploadMeta = z.infer<typeof uploadMetaSchema>;
