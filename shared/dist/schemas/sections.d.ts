import { z } from 'zod';
export declare const nameSchema: z.ZodString;
export declare const cnicSchema: z.ZodEffects<z.ZodString, string, string>;
export declare const phoneSchema: z.ZodEffects<z.ZodString, string, string>;
export declare const ibanSchema: z.ZodEffects<z.ZodString, string, string>;
export declare const personalSchema: z.ZodEffects<z.ZodEffects<z.ZodObject<{
    fullName: z.ZodString;
    cnic: z.ZodEffects<z.ZodString, string, string>;
    dob: z.ZodDate;
    gender: z.ZodEnum<["male", "female", "other", "prefer_not_to_say"]>;
}, "strip", z.ZodTypeAny, {
    fullName: string;
    cnic: string;
    dob: Date;
    gender: "other" | "male" | "female" | "prefer_not_to_say";
}, {
    fullName: string;
    cnic: string;
    dob: Date;
    gender: "other" | "male" | "female" | "prefer_not_to_say";
}>, {
    fullName: string;
    cnic: string;
    dob: Date;
    gender: "other" | "male" | "female" | "prefer_not_to_say";
}, {
    fullName: string;
    cnic: string;
    dob: Date;
    gender: "other" | "male" | "female" | "prefer_not_to_say";
}>, {
    fullName: string;
    cnic: string;
    dob: Date;
    gender: "other" | "male" | "female" | "prefer_not_to_say";
}, {
    fullName: string;
    cnic: string;
    dob: Date;
    gender: "other" | "male" | "female" | "prefer_not_to_say";
}>;
export declare const contactSchema: z.ZodObject<{
    email: z.ZodString;
    phone: z.ZodEffects<z.ZodString, string, string>;
    houseFlat: z.ZodString;
    street: z.ZodString;
    area: z.ZodString;
    city: z.ZodString;
    province: z.ZodEnum<["Punjab", "Sindh", "Khyber Pakhtunkhwa", "Balochistan", "Islamabad Capital Territory", "Gilgit-Baltistan", "Azad Jammu and Kashmir"]>;
    postalCode: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodLiteral<"">]>>;
}, "strip", z.ZodTypeAny, {
    email: string;
    phone: string;
    houseFlat: string;
    street: string;
    area: string;
    city: string;
    province: "Punjab" | "Sindh" | "Khyber Pakhtunkhwa" | "Balochistan" | "Islamabad Capital Territory" | "Gilgit-Baltistan" | "Azad Jammu and Kashmir";
    postalCode?: string | undefined;
}, {
    email: string;
    phone: string;
    houseFlat: string;
    street: string;
    area: string;
    city: string;
    province: "Punjab" | "Sindh" | "Khyber Pakhtunkhwa" | "Balochistan" | "Islamabad Capital Territory" | "Gilgit-Baltistan" | "Azad Jammu and Kashmir";
    postalCode?: string | undefined;
}>;
export declare const educationSchema: z.ZodEffects<z.ZodObject<{
    highestQualification: z.ZodEnum<["matric", "intermediate", "diploma", "bachelors", "masters", "mphil", "phd", "other"]>;
    degree: z.ZodString;
    institute: z.ZodString;
    board: z.ZodString;
    fieldOfStudy: z.ZodString;
    isCurrentStudent: z.ZodDefault<z.ZodBoolean>;
    currentSemester: z.ZodOptional<z.ZodNumber>;
    graduationYear: z.ZodOptional<z.ZodNumber>;
    marks: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    highestQualification: "matric" | "intermediate" | "diploma" | "bachelors" | "masters" | "mphil" | "phd" | "other";
    degree: string;
    institute: string;
    board: string;
    fieldOfStudy: string;
    isCurrentStudent: boolean;
    currentSemester?: number | undefined;
    graduationYear?: number | undefined;
    marks?: string | undefined;
}, {
    highestQualification: "matric" | "intermediate" | "diploma" | "bachelors" | "masters" | "mphil" | "phd" | "other";
    degree: string;
    institute: string;
    board: string;
    fieldOfStudy: string;
    isCurrentStudent?: boolean | undefined;
    currentSemester?: number | undefined;
    graduationYear?: number | undefined;
    marks?: string | undefined;
}>, {
    highestQualification: "matric" | "intermediate" | "diploma" | "bachelors" | "masters" | "mphil" | "phd" | "other";
    degree: string;
    institute: string;
    board: string;
    fieldOfStudy: string;
    isCurrentStudent: boolean;
    currentSemester?: number | undefined;
    graduationYear?: number | undefined;
    marks?: string | undefined;
}, {
    highestQualification: "matric" | "intermediate" | "diploma" | "bachelors" | "masters" | "mphil" | "phd" | "other";
    degree: string;
    institute: string;
    board: string;
    fieldOfStudy: string;
    isCurrentStudent?: boolean | undefined;
    currentSemester?: number | undefined;
    graduationYear?: number | undefined;
    marks?: string | undefined;
}>;
export declare const employmentSchema: z.ZodDiscriminatedUnion<"status", [z.ZodObject<{
    status: z.ZodLiteral<"employed">;
    companyName: z.ZodString;
    jobTitle: z.ZodString;
    industry: z.ZodString;
    employmentType: z.ZodEnum<["full_time", "part_time", "contract", "freelance"]>;
    joiningDate: z.ZodDate;
    monthlySalary: z.ZodNumber;
    experienceYears: z.ZodNumber;
    employerAddress: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status: "employed";
    companyName: string;
    jobTitle: string;
    industry: string;
    employmentType: "full_time" | "part_time" | "contract" | "freelance";
    joiningDate: Date;
    monthlySalary: number;
    experienceYears: number;
    employerAddress: string;
}, {
    status: "employed";
    companyName: string;
    jobTitle: string;
    industry: string;
    employmentType: "full_time" | "part_time" | "contract" | "freelance";
    joiningDate: Date;
    monthlySalary: number;
    experienceYears: number;
    employerAddress: string;
}>, z.ZodObject<{
    status: z.ZodLiteral<"business">;
    businessName: z.ZodString;
    businessType: z.ZodOptional<z.ZodString>;
    businessStartDate: z.ZodDate;
    monthlyBusinessIncome: z.ZodNumber;
    businessAddress: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status: "business";
    businessName: string;
    businessStartDate: Date;
    monthlyBusinessIncome: number;
    businessAddress: string;
    businessType?: string | undefined;
}, {
    status: "business";
    businessName: string;
    businessStartDate: Date;
    monthlyBusinessIncome: number;
    businessAddress: string;
    businessType?: string | undefined;
}>, z.ZodObject<{
    status: z.ZodLiteral<"student">;
    institution: z.ZodString;
    semester: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    status: "student";
    institution: string;
    semester: number;
}, {
    status: "student";
    institution: string;
    semester: number;
}>, z.ZodObject<{
    status: z.ZodLiteral<"retired">;
    pensionMonthly: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    status: "retired";
    pensionMonthly?: number | undefined;
}, {
    status: "retired";
    pensionMonthly?: number | undefined;
}>, z.ZodObject<{
    status: z.ZodLiteral<"unemployed">;
}, "strip", z.ZodTypeAny, {
    status: "unemployed";
}, {
    status: "unemployed";
}>]>;
export declare const incomeSchema: z.ZodObject<{
    monthlySalary: z.ZodDefault<z.ZodNumber>;
    businessIncome: z.ZodDefault<z.ZodNumber>;
    pension: z.ZodDefault<z.ZodNumber>;
    rentalIncome: z.ZodDefault<z.ZodNumber>;
    freelancingIncome: z.ZodDefault<z.ZodNumber>;
    otherIncome: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    monthlySalary: number;
    businessIncome: number;
    pension: number;
    rentalIncome: number;
    freelancingIncome: number;
    otherIncome: number;
}, {
    monthlySalary?: number | undefined;
    businessIncome?: number | undefined;
    pension?: number | undefined;
    rentalIncome?: number | undefined;
    freelancingIncome?: number | undefined;
    otherIncome?: number | undefined;
}>;
export declare const expensesSchema: z.ZodObject<{
    houseRent: z.ZodDefault<z.ZodNumber>;
    electricity: z.ZodDefault<z.ZodNumber>;
    gas: z.ZodDefault<z.ZodNumber>;
    internet: z.ZodDefault<z.ZodNumber>;
    water: z.ZodDefault<z.ZodNumber>;
    education: z.ZodDefault<z.ZodNumber>;
    medical: z.ZodDefault<z.ZodNumber>;
    transportation: z.ZodDefault<z.ZodNumber>;
    groceries: z.ZodDefault<z.ZodNumber>;
    loanInstallments: z.ZodDefault<z.ZodNumber>;
    otherExpenses: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    houseRent: number;
    electricity: number;
    gas: number;
    internet: number;
    water: number;
    education: number;
    medical: number;
    transportation: number;
    groceries: number;
    loanInstallments: number;
    otherExpenses: number;
}, {
    houseRent?: number | undefined;
    electricity?: number | undefined;
    gas?: number | undefined;
    internet?: number | undefined;
    water?: number | undefined;
    education?: number | undefined;
    medical?: number | undefined;
    transportation?: number | undefined;
    groceries?: number | undefined;
    loanInstallments?: number | undefined;
    otherExpenses?: number | undefined;
}>;
export declare const assetsSchema: z.ZodObject<{
    property: z.ZodDefault<z.ZodNumber>;
    vehicle: z.ZodDefault<z.ZodNumber>;
    savings: z.ZodDefault<z.ZodNumber>;
    investments: z.ZodDefault<z.ZodNumber>;
    gold: z.ZodDefault<z.ZodNumber>;
    businessAssets: z.ZodDefault<z.ZodNumber>;
    otherAssets: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    property: number;
    vehicle: number;
    savings: number;
    investments: number;
    gold: number;
    businessAssets: number;
    otherAssets: number;
}, {
    property?: number | undefined;
    vehicle?: number | undefined;
    savings?: number | undefined;
    investments?: number | undefined;
    gold?: number | undefined;
    businessAssets?: number | undefined;
    otherAssets?: number | undefined;
}>;
export declare const liabilitiesSchema: z.ZodObject<{
    homeLoan: z.ZodDefault<z.ZodNumber>;
    personalLoan: z.ZodDefault<z.ZodNumber>;
    creditCardDebt: z.ZodDefault<z.ZodNumber>;
    vehicleLoan: z.ZodDefault<z.ZodNumber>;
    businessLoan: z.ZodDefault<z.ZodNumber>;
    otherLiabilities: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    homeLoan: number;
    personalLoan: number;
    creditCardDebt: number;
    vehicleLoan: number;
    businessLoan: number;
    otherLiabilities: number;
}, {
    homeLoan?: number | undefined;
    personalLoan?: number | undefined;
    creditCardDebt?: number | undefined;
    vehicleLoan?: number | undefined;
    businessLoan?: number | undefined;
    otherLiabilities?: number | undefined;
}>;
export declare const bankingSchema: z.ZodObject<{
    bankName: z.ZodString;
    accountTitle: z.ZodString;
    iban: z.ZodEffects<z.ZodString, string, string>;
    branchName: z.ZodString;
    branchCode: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    bankName: string;
    accountTitle: string;
    iban: string;
    branchName: string;
    branchCode?: string | undefined;
}, {
    bankName: string;
    accountTitle: string;
    iban: string;
    branchName: string;
    branchCode?: string | undefined;
}>;
export declare const familySchema: z.ZodObject<{
    maritalStatus: z.ZodEnum<["single", "married", "divorced", "widowed"]>;
    familyMembers: z.ZodNumber;
    dependents: z.ZodNumber;
    spouseEmploymentStatus: z.ZodOptional<z.ZodEnum<["employed", "business", "homemaker", "unemployed", "not_applicable"]>>;
    householdMonthlyIncome: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    maritalStatus: "single" | "married" | "divorced" | "widowed";
    familyMembers: number;
    dependents: number;
    householdMonthlyIncome: number;
    spouseEmploymentStatus?: "employed" | "business" | "unemployed" | "homemaker" | "not_applicable" | undefined;
}, {
    maritalStatus: "single" | "married" | "divorced" | "widowed";
    familyMembers: number;
    dependents: number;
    spouseEmploymentStatus?: "employed" | "business" | "unemployed" | "homemaker" | "not_applicable" | undefined;
    householdMonthlyIncome?: number | undefined;
}>;
export declare const goalsSchema: z.ZodObject<{
    purpose: z.ZodEnum<["financial_assistance", "loan", "scholarship", "business_support", "other"]>;
    goals: z.ZodString;
    amountRequired: z.ZodNumber;
    timeline: z.ZodEnum<["immediate", "1_3_months", "3_6_months", "6_12_months", "over_year"]>;
    additionalNotes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    purpose: "other" | "financial_assistance" | "loan" | "scholarship" | "business_support";
    goals: string;
    amountRequired: number;
    timeline: "immediate" | "1_3_months" | "3_6_months" | "6_12_months" | "over_year";
    additionalNotes?: string | undefined;
}, {
    purpose: "other" | "financial_assistance" | "loan" | "scholarship" | "business_support";
    goals: string;
    amountRequired: number;
    timeline: "immediate" | "1_3_months" | "3_6_months" | "6_12_months" | "over_year";
    additionalNotes?: string | undefined;
}>;
export declare const documentsSchema: z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>;
export declare const declarationSchema: z.ZodObject<{
    agreed: z.ZodLiteral<true>;
    privacyNoticeVersion: z.ZodString;
}, "strip", z.ZodTypeAny, {
    agreed: true;
    privacyNoticeVersion: string;
}, {
    agreed: true;
    privacyNoticeVersion: string;
}>;
