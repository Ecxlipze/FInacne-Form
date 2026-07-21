import { z } from 'zod';
import { normalizeCnic, normalizePhone, normalizeIban, ageFromDob } from '../validators';
import { PROVINCES } from './domain';

/** Wrap a normalizer so schemas validate AND canonicalize, surfacing a friendly message. */
function normalized(fn: (v: string) => string) {
  return (v: string, ctx: z.RefinementCtx) => {
    try {
      return fn(v);
    } catch (e) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: (e as Error).message });
      return z.NEVER;
    }
  };
}

// --- Reusable field schemas ---

export const nameSchema = z
  .string({ required_error: 'Please enter your full name.' })
  .trim()
  .min(3, 'Please enter your full name (at least 3 characters).')
  .max(100, 'Name must be 100 characters or fewer.')
  .regex(/^[A-Za-z][A-Za-z'\- ]*$/, 'Use letters, spaces, hyphens, and apostrophes only.');

export const cnicSchema = z
  .string({ required_error: 'CNIC is required.' })
  .min(1, 'CNIC is required.')
  .transform(normalized(normalizeCnic));

export const phoneSchema = z
  .string({ required_error: 'Mobile number is required.' })
  .min(1, 'Mobile number is required.')
  .transform(normalized(normalizePhone));

export const ibanSchema = z
  .string({ required_error: 'IBAN is required.' })
  .min(1, 'IBAN is required.')
  .transform(normalized(normalizeIban));

/** Money: coerces blank -> 0, rejects negatives with a friendly message. */
const money = z.coerce.number({ invalid_type_error: 'Enter a number.' }).nonnegative('Amount cannot be negative.').finite();
/** A money amount that must be greater than zero. */
const moneyPositive = z.coerce.number({ invalid_type_error: 'Enter a number.' }).positive('Enter an amount greater than zero.').finite();

const dobField = z.coerce.date({ errorMap: () => ({ message: 'Please enter a valid date.' }) });

// --- Sections ---

export const personalSchema = z
  .object({
    fullName: nameSchema,
    cnic: cnicSchema,
    dob: dobField,
    gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say'], {
      errorMap: () => ({ message: 'Please select an option.' }),
    }),
  })
  .refine((d) => ageFromDob(d.dob) >= 18, { message: 'Applicants must be at least 18 years old.', path: ['dob'] })
  .refine((d) => ageFromDob(d.dob) <= 100, { message: 'Please check the date of birth.', path: ['dob'] });

export const contactSchema = z.object({
  email: z.string({ required_error: 'Email is required.' }).min(1, 'Email is required.').email('Enter a valid email address.'),
  phone: phoneSchema,
  houseFlat: z.string().min(1, 'Required.').max(50, 'Too long.'),
  street: z.string().min(1, 'Required.').max(100, 'Too long.'),
  area: z.string().min(1, 'Required.').max(100, 'Too long.'),
  city: z.string({ required_error: 'Please select your city.' }).min(1, 'Please select your city.'),
  province: z.enum(PROVINCES, { errorMap: () => ({ message: 'Please select your province.' }) }),
  postalCode: z
    .union([z.string().regex(/^\d{5}$/, 'Postal code must be 5 digits.'), z.literal('')])
    .optional(),
});

export const educationSchema = z
  .object({
    highestQualification: z.enum(
      ['matric', 'intermediate', 'diploma', 'bachelors', 'masters', 'mphil', 'phd', 'other'],
      { errorMap: () => ({ message: 'Please select your highest qualification.' }) }
    ),
    degree: z.string().min(1, 'Required.').max(100, 'Too long.'),
    institute: z.string().min(1, 'Required.').max(150, 'Too long.'),
    board: z.string().min(1, 'Required.').max(150, 'Too long.'),
    fieldOfStudy: z.string().min(1, 'Required.').max(100, 'Too long.'),
    isCurrentStudent: z.boolean().default(false),
    currentSemester: z.coerce.number().int().min(1, 'Enter a valid semester.').max(12, 'Enter a valid semester.').optional(),
    graduationYear: z.coerce
      .number()
      .int()
      .min(1950, 'Enter a valid year.')
      .max(new Date().getFullYear() + 7, 'Enter a valid year.')
      .optional(),
    marks: z.string().max(20, 'Too long.').optional(),
  })
  .refine((d) => !d.isCurrentStudent || (d.currentSemester ?? 0) >= 1, {
    message: 'Please enter your current semester.',
    path: ['currentSemester'],
  });

export const employmentSchema = z.discriminatedUnion('status', [
  z.object({
    status: z.literal('employed'),
    companyName: z.string().min(1, 'Required.').max(150, 'Too long.'),
    jobTitle: z.string().min(1, 'Required.').max(100, 'Too long.'),
    industry: z.string().min(1, 'Required.').max(100, 'Too long.'),
    employmentType: z.enum(['full_time', 'part_time', 'contract', 'freelance'], {
      errorMap: () => ({ message: 'Please select an employment type.' }),
    }),
    joiningDate: dobField,
    monthlySalary: moneyPositive,
    experienceYears: z.coerce.number().min(0, 'Cannot be negative.').max(70, 'Please check this value.'),
    employerAddress: z.string().min(1, 'Required.').max(200, 'Too long.'),
  }),
  z.object({
    status: z.literal('business'),
    businessName: z.string().min(1, 'Required.').max(150, 'Too long.'),
    businessType: z.string().max(100, 'Too long.').optional(),
    businessStartDate: dobField,
    monthlyBusinessIncome: moneyPositive,
    businessAddress: z.string().min(1, 'Required.').max(200, 'Too long.'),
  }),
  z.object({
    status: z.literal('student'),
    institution: z.string().min(1, 'Required.').max(150, 'Too long.'),
    semester: z.coerce.number().int().min(1, 'Enter a valid semester.').max(12, 'Enter a valid semester.'),
  }),
  z.object({ status: z.literal('retired'), pensionMonthly: money.optional() }),
  z.object({ status: z.literal('unemployed') }),
]);

export const incomeSchema = z.object({
  monthlySalary: money.default(0),
  businessIncome: money.default(0),
  pension: money.default(0),
  rentalIncome: money.default(0),
  freelancingIncome: money.default(0),
  otherIncome: money.default(0),
});

export const expensesSchema = z.object({
  houseRent: money.default(0),
  electricity: money.default(0),
  gas: money.default(0),
  internet: money.default(0),
  water: money.default(0),
  education: money.default(0),
  medical: money.default(0),
  transportation: money.default(0),
  groceries: money.default(0),
  loanInstallments: money.default(0),
  otherExpenses: money.default(0),
});

export const assetsSchema = z.object({
  property: money.default(0),
  vehicle: money.default(0),
  savings: money.default(0),
  investments: money.default(0),
  gold: money.default(0),
  businessAssets: money.default(0),
  otherAssets: money.default(0),
});

export const liabilitiesSchema = z.object({
  homeLoan: money.default(0),
  personalLoan: money.default(0),
  creditCardDebt: money.default(0),
  vehicleLoan: money.default(0),
  businessLoan: money.default(0),
  otherLiabilities: money.default(0),
});

export const bankingSchema = z.object({
  bankName: z.string().min(1, 'Required.').max(100, 'Too long.'),
  accountTitle: z.string().min(1, 'Required.').max(100, 'Too long.'),
  iban: ibanSchema,
  branchName: z.string().min(1, 'Required.').max(120, 'Too long.'),
  branchCode: z.string().max(20, 'Too long.').optional(),
});

export const familySchema = z.object({
  maritalStatus: z.enum(['single', 'married', 'divorced', 'widowed'], {
    errorMap: () => ({ message: 'Please select your marital status.' }),
  }),
  familyMembers: z.coerce.number().int().min(1, 'Must be at least 1.').max(50, 'Please check this value.'),
  dependents: z.coerce.number().int().min(0, 'Cannot be negative.').max(50, 'Please check this value.'),
  spouseEmploymentStatus: z.enum(['employed', 'business', 'homemaker', 'unemployed', 'not_applicable']).optional(),
  householdMonthlyIncome: money.default(0),
});

export const goalsSchema = z.object({
  purpose: z.enum(['financial_assistance', 'loan', 'scholarship', 'business_support', 'other'], {
    errorMap: () => ({ message: 'Please select the purpose of this application.' }),
  }),
  goals: z.string().min(1, 'Please describe your goal.').max(1000, 'Too long.'),
  amountRequired: moneyPositive,
  timeline: z.enum(['immediate', '1_3_months', '3_6_months', '6_12_months', 'over_year'], {
    errorMap: () => ({ message: 'Please select a timeline.' }),
  }),
  additionalNotes: z.string().max(1000, 'Too long.').optional(),
});

export const documentsSchema = z.object({}).passthrough();

export const declarationSchema = z.object({
  agreed: z.literal(true, { errorMap: () => ({ message: 'You must accept the declaration to continue.' }) }),
  privacyNoticeVersion: z.string(),
});
