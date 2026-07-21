"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.declarationSchema = exports.documentsSchema = exports.goalsSchema = exports.familySchema = exports.bankingSchema = exports.liabilitiesSchema = exports.assetsSchema = exports.expensesSchema = exports.incomeSchema = exports.employmentSchema = exports.educationSchema = exports.contactSchema = exports.personalSchema = exports.ibanSchema = exports.phoneSchema = exports.cnicSchema = exports.nameSchema = void 0;
const zod_1 = require("zod");
const validators_1 = require("../validators");
const domain_1 = require("./domain");
/** Wrap a normalizer so schemas validate AND canonicalize, surfacing a friendly message. */
function normalized(fn) {
    return (v, ctx) => {
        try {
            return fn(v);
        }
        catch (e) {
            ctx.addIssue({ code: zod_1.z.ZodIssueCode.custom, message: e.message });
            return zod_1.z.NEVER;
        }
    };
}
// --- Reusable field schemas ---
exports.nameSchema = zod_1.z
    .string({ required_error: 'Please enter your full name.' })
    .trim()
    .min(3, 'Please enter your full name (at least 3 characters).')
    .max(100, 'Name must be 100 characters or fewer.')
    .regex(/^[A-Za-z][A-Za-z'\- ]*$/, 'Use letters, spaces, hyphens, and apostrophes only.');
exports.cnicSchema = zod_1.z
    .string({ required_error: 'CNIC is required.' })
    .min(1, 'CNIC is required.')
    .transform(normalized(validators_1.normalizeCnic));
exports.phoneSchema = zod_1.z
    .string({ required_error: 'Mobile number is required.' })
    .min(1, 'Mobile number is required.')
    .transform(normalized(validators_1.normalizePhone));
exports.ibanSchema = zod_1.z
    .string({ required_error: 'IBAN is required.' })
    .min(1, 'IBAN is required.')
    .transform(normalized(validators_1.normalizeIban));
/** Money: coerces blank -> 0, rejects negatives with a friendly message. */
const money = zod_1.z.coerce.number({ invalid_type_error: 'Enter a number.' }).nonnegative('Amount cannot be negative.').finite();
/** A money amount that must be greater than zero. */
const moneyPositive = zod_1.z.coerce.number({ invalid_type_error: 'Enter a number.' }).positive('Enter an amount greater than zero.').finite();
const dobField = zod_1.z.coerce.date({ errorMap: () => ({ message: 'Please enter a valid date.' }) });
// --- Sections ---
exports.personalSchema = zod_1.z
    .object({
    fullName: exports.nameSchema,
    cnic: exports.cnicSchema,
    dob: dobField,
    gender: zod_1.z.enum(['male', 'female', 'other', 'prefer_not_to_say'], {
        errorMap: () => ({ message: 'Please select an option.' }),
    }),
})
    .refine((d) => (0, validators_1.ageFromDob)(d.dob) >= 18, { message: 'Applicants must be at least 18 years old.', path: ['dob'] })
    .refine((d) => (0, validators_1.ageFromDob)(d.dob) <= 100, { message: 'Please check the date of birth.', path: ['dob'] });
exports.contactSchema = zod_1.z.object({
    email: zod_1.z.string({ required_error: 'Email is required.' }).min(1, 'Email is required.').email('Enter a valid email address.'),
    phone: exports.phoneSchema,
    houseFlat: zod_1.z.string().min(1, 'Required.').max(50, 'Too long.'),
    street: zod_1.z.string().min(1, 'Required.').max(100, 'Too long.'),
    area: zod_1.z.string().min(1, 'Required.').max(100, 'Too long.'),
    city: zod_1.z.string({ required_error: 'Please select your city.' }).min(1, 'Please select your city.'),
    province: zod_1.z.enum(domain_1.PROVINCES, { errorMap: () => ({ message: 'Please select your province.' }) }),
    postalCode: zod_1.z
        .union([zod_1.z.string().regex(/^\d{5}$/, 'Postal code must be 5 digits.'), zod_1.z.literal('')])
        .optional(),
});
exports.educationSchema = zod_1.z
    .object({
    highestQualification: zod_1.z.enum(['matric', 'intermediate', 'diploma', 'bachelors', 'masters', 'mphil', 'phd', 'other'], { errorMap: () => ({ message: 'Please select your highest qualification.' }) }),
    degree: zod_1.z.string().min(1, 'Required.').max(100, 'Too long.'),
    institute: zod_1.z.string().min(1, 'Required.').max(150, 'Too long.'),
    board: zod_1.z.string().min(1, 'Required.').max(150, 'Too long.'),
    fieldOfStudy: zod_1.z.string().min(1, 'Required.').max(100, 'Too long.'),
    isCurrentStudent: zod_1.z.boolean().default(false),
    currentSemester: zod_1.z.coerce.number().int().min(1, 'Enter a valid semester.').max(12, 'Enter a valid semester.').optional(),
    graduationYear: zod_1.z.coerce
        .number()
        .int()
        .min(1950, 'Enter a valid year.')
        .max(new Date().getFullYear() + 7, 'Enter a valid year.')
        .optional(),
    marks: zod_1.z.string().max(20, 'Too long.').optional(),
})
    .refine((d) => !d.isCurrentStudent || (d.currentSemester ?? 0) >= 1, {
    message: 'Please enter your current semester.',
    path: ['currentSemester'],
});
exports.employmentSchema = zod_1.z.discriminatedUnion('status', [
    zod_1.z.object({
        status: zod_1.z.literal('employed'),
        companyName: zod_1.z.string().min(1, 'Required.').max(150, 'Too long.'),
        jobTitle: zod_1.z.string().min(1, 'Required.').max(100, 'Too long.'),
        industry: zod_1.z.string().min(1, 'Required.').max(100, 'Too long.'),
        employmentType: zod_1.z.enum(['full_time', 'part_time', 'contract', 'freelance'], {
            errorMap: () => ({ message: 'Please select an employment type.' }),
        }),
        joiningDate: dobField,
        monthlySalary: moneyPositive,
        experienceYears: zod_1.z.coerce.number().min(0, 'Cannot be negative.').max(70, 'Please check this value.'),
        employerAddress: zod_1.z.string().min(1, 'Required.').max(200, 'Too long.'),
    }),
    zod_1.z.object({
        status: zod_1.z.literal('business'),
        businessName: zod_1.z.string().min(1, 'Required.').max(150, 'Too long.'),
        businessType: zod_1.z.string().max(100, 'Too long.').optional(),
        businessStartDate: dobField,
        monthlyBusinessIncome: moneyPositive,
        businessAddress: zod_1.z.string().min(1, 'Required.').max(200, 'Too long.'),
    }),
    zod_1.z.object({
        status: zod_1.z.literal('student'),
        institution: zod_1.z.string().min(1, 'Required.').max(150, 'Too long.'),
        semester: zod_1.z.coerce.number().int().min(1, 'Enter a valid semester.').max(12, 'Enter a valid semester.'),
    }),
    zod_1.z.object({ status: zod_1.z.literal('retired'), pensionMonthly: money.optional() }),
    zod_1.z.object({ status: zod_1.z.literal('unemployed') }),
]);
exports.incomeSchema = zod_1.z.object({
    monthlySalary: money.default(0),
    businessIncome: money.default(0),
    pension: money.default(0),
    rentalIncome: money.default(0),
    freelancingIncome: money.default(0),
    otherIncome: money.default(0),
});
exports.expensesSchema = zod_1.z.object({
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
exports.assetsSchema = zod_1.z.object({
    property: money.default(0),
    vehicle: money.default(0),
    savings: money.default(0),
    investments: money.default(0),
    gold: money.default(0),
    businessAssets: money.default(0),
    otherAssets: money.default(0),
});
exports.liabilitiesSchema = zod_1.z.object({
    homeLoan: money.default(0),
    personalLoan: money.default(0),
    creditCardDebt: money.default(0),
    vehicleLoan: money.default(0),
    businessLoan: money.default(0),
    otherLiabilities: money.default(0),
});
exports.bankingSchema = zod_1.z.object({
    bankName: zod_1.z.string().min(1, 'Required.').max(100, 'Too long.'),
    accountTitle: zod_1.z.string().min(1, 'Required.').max(100, 'Too long.'),
    iban: exports.ibanSchema,
    branchName: zod_1.z.string().min(1, 'Required.').max(120, 'Too long.'),
    branchCode: zod_1.z.string().max(20, 'Too long.').optional(),
});
exports.familySchema = zod_1.z.object({
    maritalStatus: zod_1.z.enum(['single', 'married', 'divorced', 'widowed'], {
        errorMap: () => ({ message: 'Please select your marital status.' }),
    }),
    familyMembers: zod_1.z.coerce.number().int().min(1, 'Must be at least 1.').max(50, 'Please check this value.'),
    dependents: zod_1.z.coerce.number().int().min(0, 'Cannot be negative.').max(50, 'Please check this value.'),
    spouseEmploymentStatus: zod_1.z.enum(['employed', 'business', 'homemaker', 'unemployed', 'not_applicable']).optional(),
    householdMonthlyIncome: money.default(0),
});
exports.goalsSchema = zod_1.z.object({
    purpose: zod_1.z.enum(['financial_assistance', 'loan', 'scholarship', 'business_support', 'other'], {
        errorMap: () => ({ message: 'Please select the purpose of this application.' }),
    }),
    goals: zod_1.z.string().min(1, 'Please describe your goal.').max(1000, 'Too long.'),
    amountRequired: moneyPositive,
    timeline: zod_1.z.enum(['immediate', '1_3_months', '3_6_months', '6_12_months', 'over_year'], {
        errorMap: () => ({ message: 'Please select a timeline.' }),
    }),
    additionalNotes: zod_1.z.string().max(1000, 'Too long.').optional(),
});
exports.documentsSchema = zod_1.z.object({}).passthrough();
exports.declarationSchema = zod_1.z.object({
    agreed: zod_1.z.literal(true, { errorMap: () => ({ message: 'You must accept the declaration to continue.' }) }),
    privacyNoticeVersion: zod_1.z.string(),
});
