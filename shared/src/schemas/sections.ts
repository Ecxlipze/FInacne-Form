import { z } from 'zod';
import { normalizeCnic, normalizePhone, normalizeIban, ageFromDob } from '../validators';

/** Reusable field-level schemas that validate AND normalize. */
export const cnicSchema = z
  .string()
  .transform((v, ctx) => {
    try {
      return normalizeCnic(v);
    } catch (e) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: (e as Error).message });
      return z.NEVER;
    }
  });

export const phoneSchema = z.string().transform((v, ctx) => {
  try {
    return normalizePhone(v);
  } catch (e) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: (e as Error).message });
    return z.NEVER;
  }
});

export const ibanSchema = z.string().transform((v, ctx) => {
  try {
    return normalizeIban(v);
  } catch (e) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: (e as Error).message });
    return z.NEVER;
  }
});

const currency = z.number().nonnegative('Amount cannot be negative').finite();

// --- Sections ---

export const personalSchema = z
  .object({
    fullName: z.string().min(2).max(100),
    cnic: cnicSchema,
    dob: z.coerce.date(),
    gender: z.enum(['male', 'female', 'other']).optional(),
  })
  .refine((d) => ageFromDob(d.dob) >= 18, { message: 'Applicant must be at least 18', path: ['dob'] })
  .refine((d) => ageFromDob(d.dob) <= 100, { message: 'Please check date of birth', path: ['dob'] });

export const contactSchema = z
  .object({
    email: z.string().email(),
    phone: phoneSchema,
    currentAddress: z.string().min(5).max(300),
    city: z.string().min(2).max(60),
    sameAsPermanent: z.boolean().default(false),
    permanentAddress: z.string().max(300).optional(),
  })
  // Phase 6 conditional: permanent address required only when it differs from current.
  .refine((d) => d.sameAsPermanent || !!d.permanentAddress, {
    message: 'Permanent address is required',
    path: ['permanentAddress'],
  });

/**
 * Employment — the marquee conditional case (Phase 6). A discriminated union makes each status
 * carry exactly the fields it needs, and Zod enforces it. No "show/hide then hope" logic.
 */
export const employmentSchema = z.discriminatedUnion('status', [
  z.object({
    status: z.literal('employed'),
    employerName: z.string().min(2),
    joiningDate: z.coerce.date(),
  }),
  z.object({
    status: z.literal('business'),
    businessName: z.string().min(2),
    businessStartDate: z.coerce.date(),
  }),
  z.object({
    status: z.literal('student'),
    institution: z.string().min(2),
    semester: z.number().int().min(1).max(12),
  }),
  z.object({ status: z.literal('retired') }),
  z.object({ status: z.literal('unemployed') }),
]);

export const incomeSchema = z.object({
  monthly: currency,
  otherSources: z.string().max(200).optional(),
});

export const bankingSchema = z.object({
  bankName: z.string().min(2),
  iban: ibanSchema,
});

// Remaining sections — structured stubs to be filled section-by-section in Phase 5.
export const educationSchema = z.object({}).passthrough();
export const expensesSchema = z.object({}).passthrough();
export const assetsSchema = z.object({}).passthrough();
export const liabilitiesSchema = z.object({}).passthrough();
export const familySchema = z.object({}).passthrough();
export const goalsSchema = z.object({}).passthrough();
export const documentsSchema = z.object({}).passthrough();

export const declarationSchema = z.object({
  agreed: z.literal(true, { errorMap: () => ({ message: 'You must accept the declaration' }) }),
  privacyNoticeVersion: z.string(),
});
