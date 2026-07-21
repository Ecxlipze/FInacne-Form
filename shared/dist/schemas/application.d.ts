import { z } from 'zod';
/** Ordered wizard steps. The frontend maps over this; the backend validates each on save. */
export declare const stepSchemas: {
    readonly personal: z.ZodEffects<z.ZodEffects<z.ZodObject<{
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
    readonly contact: z.ZodObject<{
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
    readonly education: z.ZodEffects<z.ZodObject<{
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
    readonly employment: z.ZodDiscriminatedUnion<"status", [z.ZodObject<{
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
    readonly income: z.ZodObject<{
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
    readonly expenses: z.ZodObject<{
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
    readonly assets: z.ZodObject<{
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
    readonly liabilities: z.ZodObject<{
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
    readonly banking: z.ZodObject<{
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
    readonly family: z.ZodObject<{
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
    readonly goals: z.ZodObject<{
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
    readonly documents: z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>;
    readonly declaration: z.ZodObject<{
        agreed: z.ZodLiteral<true>;
        privacyNoticeVersion: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        agreed: true;
        privacyNoticeVersion: string;
    }, {
        agreed: true;
        privacyNoticeVersion: string;
    }>;
};
export type StepKey = keyof typeof stepSchemas;
export declare const STEP_ORDER: StepKey[];
/** Full form. Autosave validates a single step; submit validates the whole thing. */
export declare const applicationSchema: z.ZodObject<{
    personal: z.ZodEffects<z.ZodEffects<z.ZodObject<{
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
    contact: z.ZodObject<{
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
    education: z.ZodEffects<z.ZodObject<{
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
    employment: z.ZodDiscriminatedUnion<"status", [z.ZodObject<{
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
    income: z.ZodObject<{
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
    expenses: z.ZodObject<{
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
    assets: z.ZodObject<{
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
    liabilities: z.ZodObject<{
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
    banking: z.ZodObject<{
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
    family: z.ZodObject<{
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
    goals: z.ZodObject<{
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
    documents: z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>;
    declaration: z.ZodObject<{
        agreed: z.ZodLiteral<true>;
        privacyNoticeVersion: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        agreed: true;
        privacyNoticeVersion: string;
    }, {
        agreed: true;
        privacyNoticeVersion: string;
    }>;
}, "strip", z.ZodTypeAny, {
    education: {
        highestQualification: "matric" | "intermediate" | "diploma" | "bachelors" | "masters" | "mphil" | "phd" | "other";
        degree: string;
        institute: string;
        board: string;
        fieldOfStudy: string;
        isCurrentStudent: boolean;
        currentSemester?: number | undefined;
        graduationYear?: number | undefined;
        marks?: string | undefined;
    };
    goals: {
        purpose: "other" | "financial_assistance" | "loan" | "scholarship" | "business_support";
        goals: string;
        amountRequired: number;
        timeline: "immediate" | "1_3_months" | "3_6_months" | "6_12_months" | "over_year";
        additionalNotes?: string | undefined;
    };
    personal: {
        fullName: string;
        cnic: string;
        dob: Date;
        gender: "other" | "male" | "female" | "prefer_not_to_say";
    };
    contact: {
        email: string;
        phone: string;
        houseFlat: string;
        street: string;
        area: string;
        city: string;
        province: "Punjab" | "Sindh" | "Khyber Pakhtunkhwa" | "Balochistan" | "Islamabad Capital Territory" | "Gilgit-Baltistan" | "Azad Jammu and Kashmir";
        postalCode?: string | undefined;
    };
    employment: {
        status: "employed";
        companyName: string;
        jobTitle: string;
        industry: string;
        employmentType: "full_time" | "part_time" | "contract" | "freelance";
        joiningDate: Date;
        monthlySalary: number;
        experienceYears: number;
        employerAddress: string;
    } | {
        status: "business";
        businessName: string;
        businessStartDate: Date;
        monthlyBusinessIncome: number;
        businessAddress: string;
        businessType?: string | undefined;
    } | {
        status: "student";
        institution: string;
        semester: number;
    } | {
        status: "retired";
        pensionMonthly?: number | undefined;
    } | {
        status: "unemployed";
    };
    income: {
        monthlySalary: number;
        businessIncome: number;
        pension: number;
        rentalIncome: number;
        freelancingIncome: number;
        otherIncome: number;
    };
    expenses: {
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
    };
    assets: {
        property: number;
        vehicle: number;
        savings: number;
        investments: number;
        gold: number;
        businessAssets: number;
        otherAssets: number;
    };
    liabilities: {
        homeLoan: number;
        personalLoan: number;
        creditCardDebt: number;
        vehicleLoan: number;
        businessLoan: number;
        otherLiabilities: number;
    };
    banking: {
        bankName: string;
        accountTitle: string;
        iban: string;
        branchName: string;
        branchCode?: string | undefined;
    };
    family: {
        maritalStatus: "single" | "married" | "divorced" | "widowed";
        familyMembers: number;
        dependents: number;
        householdMonthlyIncome: number;
        spouseEmploymentStatus?: "employed" | "business" | "unemployed" | "homemaker" | "not_applicable" | undefined;
    };
    documents: {} & {
        [k: string]: unknown;
    };
    declaration: {
        agreed: true;
        privacyNoticeVersion: string;
    };
}, {
    education: {
        highestQualification: "matric" | "intermediate" | "diploma" | "bachelors" | "masters" | "mphil" | "phd" | "other";
        degree: string;
        institute: string;
        board: string;
        fieldOfStudy: string;
        isCurrentStudent?: boolean | undefined;
        currentSemester?: number | undefined;
        graduationYear?: number | undefined;
        marks?: string | undefined;
    };
    goals: {
        purpose: "other" | "financial_assistance" | "loan" | "scholarship" | "business_support";
        goals: string;
        amountRequired: number;
        timeline: "immediate" | "1_3_months" | "3_6_months" | "6_12_months" | "over_year";
        additionalNotes?: string | undefined;
    };
    personal: {
        fullName: string;
        cnic: string;
        dob: Date;
        gender: "other" | "male" | "female" | "prefer_not_to_say";
    };
    contact: {
        email: string;
        phone: string;
        houseFlat: string;
        street: string;
        area: string;
        city: string;
        province: "Punjab" | "Sindh" | "Khyber Pakhtunkhwa" | "Balochistan" | "Islamabad Capital Territory" | "Gilgit-Baltistan" | "Azad Jammu and Kashmir";
        postalCode?: string | undefined;
    };
    employment: {
        status: "employed";
        companyName: string;
        jobTitle: string;
        industry: string;
        employmentType: "full_time" | "part_time" | "contract" | "freelance";
        joiningDate: Date;
        monthlySalary: number;
        experienceYears: number;
        employerAddress: string;
    } | {
        status: "business";
        businessName: string;
        businessStartDate: Date;
        monthlyBusinessIncome: number;
        businessAddress: string;
        businessType?: string | undefined;
    } | {
        status: "student";
        institution: string;
        semester: number;
    } | {
        status: "retired";
        pensionMonthly?: number | undefined;
    } | {
        status: "unemployed";
    };
    income: {
        monthlySalary?: number | undefined;
        businessIncome?: number | undefined;
        pension?: number | undefined;
        rentalIncome?: number | undefined;
        freelancingIncome?: number | undefined;
        otherIncome?: number | undefined;
    };
    expenses: {
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
    };
    assets: {
        property?: number | undefined;
        vehicle?: number | undefined;
        savings?: number | undefined;
        investments?: number | undefined;
        gold?: number | undefined;
        businessAssets?: number | undefined;
        otherAssets?: number | undefined;
    };
    liabilities: {
        homeLoan?: number | undefined;
        personalLoan?: number | undefined;
        creditCardDebt?: number | undefined;
        vehicleLoan?: number | undefined;
        businessLoan?: number | undefined;
        otherLiabilities?: number | undefined;
    };
    banking: {
        bankName: string;
        accountTitle: string;
        iban: string;
        branchName: string;
        branchCode?: string | undefined;
    };
    family: {
        maritalStatus: "single" | "married" | "divorced" | "widowed";
        familyMembers: number;
        dependents: number;
        spouseEmploymentStatus?: "employed" | "business" | "unemployed" | "homemaker" | "not_applicable" | undefined;
        householdMonthlyIncome?: number | undefined;
    };
    documents: {} & {
        [k: string]: unknown;
    };
    declaration: {
        agreed: true;
        privacyNoticeVersion: string;
    };
}>;
export type ApplicationInput = z.infer<typeof applicationSchema>;
/** Autosave allows partial data (draft in progress); submit uses the full schema. */
export declare const draftSchema: z.ZodObject<{
    personal: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodObject<{
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
    }>>;
    contact: z.ZodOptional<z.ZodObject<{
        email: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
        houseFlat: z.ZodOptional<z.ZodString>;
        street: z.ZodOptional<z.ZodString>;
        area: z.ZodOptional<z.ZodString>;
        city: z.ZodOptional<z.ZodString>;
        province: z.ZodOptional<z.ZodEnum<["Punjab", "Sindh", "Khyber Pakhtunkhwa", "Balochistan", "Islamabad Capital Territory", "Gilgit-Baltistan", "Azad Jammu and Kashmir"]>>;
        postalCode: z.ZodOptional<z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodLiteral<"">]>>>;
    }, "strip", z.ZodTypeAny, {
        email?: string | undefined;
        phone?: string | undefined;
        houseFlat?: string | undefined;
        street?: string | undefined;
        area?: string | undefined;
        city?: string | undefined;
        province?: "Punjab" | "Sindh" | "Khyber Pakhtunkhwa" | "Balochistan" | "Islamabad Capital Territory" | "Gilgit-Baltistan" | "Azad Jammu and Kashmir" | undefined;
        postalCode?: string | undefined;
    }, {
        email?: string | undefined;
        phone?: string | undefined;
        houseFlat?: string | undefined;
        street?: string | undefined;
        area?: string | undefined;
        city?: string | undefined;
        province?: "Punjab" | "Sindh" | "Khyber Pakhtunkhwa" | "Balochistan" | "Islamabad Capital Territory" | "Gilgit-Baltistan" | "Azad Jammu and Kashmir" | undefined;
        postalCode?: string | undefined;
    }>>;
    education: z.ZodOptional<z.ZodEffects<z.ZodObject<{
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
    }>>;
    employment: z.ZodOptional<z.ZodDiscriminatedUnion<"status", [z.ZodObject<{
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
    }>]>>;
    income: z.ZodOptional<z.ZodObject<{
        monthlySalary: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
        businessIncome: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
        pension: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
        rentalIncome: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
        freelancingIncome: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
        otherIncome: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    }, "strip", z.ZodTypeAny, {
        monthlySalary?: number | undefined;
        businessIncome?: number | undefined;
        pension?: number | undefined;
        rentalIncome?: number | undefined;
        freelancingIncome?: number | undefined;
        otherIncome?: number | undefined;
    }, {
        monthlySalary?: number | undefined;
        businessIncome?: number | undefined;
        pension?: number | undefined;
        rentalIncome?: number | undefined;
        freelancingIncome?: number | undefined;
        otherIncome?: number | undefined;
    }>>;
    expenses: z.ZodOptional<z.ZodObject<{
        houseRent: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
        electricity: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
        gas: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
        internet: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
        water: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
        education: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
        medical: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
        transportation: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
        groceries: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
        loanInstallments: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
        otherExpenses: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    }, "strip", z.ZodTypeAny, {
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
    }>>;
    assets: z.ZodOptional<z.ZodObject<{
        property: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
        vehicle: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
        savings: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
        investments: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
        gold: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
        businessAssets: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
        otherAssets: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    }, "strip", z.ZodTypeAny, {
        property?: number | undefined;
        vehicle?: number | undefined;
        savings?: number | undefined;
        investments?: number | undefined;
        gold?: number | undefined;
        businessAssets?: number | undefined;
        otherAssets?: number | undefined;
    }, {
        property?: number | undefined;
        vehicle?: number | undefined;
        savings?: number | undefined;
        investments?: number | undefined;
        gold?: number | undefined;
        businessAssets?: number | undefined;
        otherAssets?: number | undefined;
    }>>;
    liabilities: z.ZodOptional<z.ZodObject<{
        homeLoan: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
        personalLoan: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
        creditCardDebt: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
        vehicleLoan: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
        businessLoan: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
        otherLiabilities: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    }, "strip", z.ZodTypeAny, {
        homeLoan?: number | undefined;
        personalLoan?: number | undefined;
        creditCardDebt?: number | undefined;
        vehicleLoan?: number | undefined;
        businessLoan?: number | undefined;
        otherLiabilities?: number | undefined;
    }, {
        homeLoan?: number | undefined;
        personalLoan?: number | undefined;
        creditCardDebt?: number | undefined;
        vehicleLoan?: number | undefined;
        businessLoan?: number | undefined;
        otherLiabilities?: number | undefined;
    }>>;
    banking: z.ZodOptional<z.ZodObject<{
        bankName: z.ZodOptional<z.ZodString>;
        accountTitle: z.ZodOptional<z.ZodString>;
        iban: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
        branchName: z.ZodOptional<z.ZodString>;
        branchCode: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        bankName?: string | undefined;
        accountTitle?: string | undefined;
        iban?: string | undefined;
        branchName?: string | undefined;
        branchCode?: string | undefined;
    }, {
        bankName?: string | undefined;
        accountTitle?: string | undefined;
        iban?: string | undefined;
        branchName?: string | undefined;
        branchCode?: string | undefined;
    }>>;
    family: z.ZodOptional<z.ZodObject<{
        maritalStatus: z.ZodOptional<z.ZodEnum<["single", "married", "divorced", "widowed"]>>;
        familyMembers: z.ZodOptional<z.ZodNumber>;
        dependents: z.ZodOptional<z.ZodNumber>;
        spouseEmploymentStatus: z.ZodOptional<z.ZodOptional<z.ZodEnum<["employed", "business", "homemaker", "unemployed", "not_applicable"]>>>;
        householdMonthlyIncome: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    }, "strip", z.ZodTypeAny, {
        maritalStatus?: "single" | "married" | "divorced" | "widowed" | undefined;
        familyMembers?: number | undefined;
        dependents?: number | undefined;
        spouseEmploymentStatus?: "employed" | "business" | "unemployed" | "homemaker" | "not_applicable" | undefined;
        householdMonthlyIncome?: number | undefined;
    }, {
        maritalStatus?: "single" | "married" | "divorced" | "widowed" | undefined;
        familyMembers?: number | undefined;
        dependents?: number | undefined;
        spouseEmploymentStatus?: "employed" | "business" | "unemployed" | "homemaker" | "not_applicable" | undefined;
        householdMonthlyIncome?: number | undefined;
    }>>;
    goals: z.ZodOptional<z.ZodObject<{
        purpose: z.ZodOptional<z.ZodEnum<["financial_assistance", "loan", "scholarship", "business_support", "other"]>>;
        goals: z.ZodOptional<z.ZodString>;
        amountRequired: z.ZodOptional<z.ZodNumber>;
        timeline: z.ZodOptional<z.ZodEnum<["immediate", "1_3_months", "3_6_months", "6_12_months", "over_year"]>>;
        additionalNotes: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        purpose?: "other" | "financial_assistance" | "loan" | "scholarship" | "business_support" | undefined;
        goals?: string | undefined;
        amountRequired?: number | undefined;
        timeline?: "immediate" | "1_3_months" | "3_6_months" | "6_12_months" | "over_year" | undefined;
        additionalNotes?: string | undefined;
    }, {
        purpose?: "other" | "financial_assistance" | "loan" | "scholarship" | "business_support" | undefined;
        goals?: string | undefined;
        amountRequired?: number | undefined;
        timeline?: "immediate" | "1_3_months" | "3_6_months" | "6_12_months" | "over_year" | undefined;
        additionalNotes?: string | undefined;
    }>>;
    documents: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    declaration: z.ZodOptional<z.ZodObject<{
        agreed: z.ZodOptional<z.ZodLiteral<true>>;
        privacyNoticeVersion: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        agreed?: true | undefined;
        privacyNoticeVersion?: string | undefined;
    }, {
        agreed?: true | undefined;
        privacyNoticeVersion?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    education?: {
        highestQualification: "matric" | "intermediate" | "diploma" | "bachelors" | "masters" | "mphil" | "phd" | "other";
        degree: string;
        institute: string;
        board: string;
        fieldOfStudy: string;
        isCurrentStudent: boolean;
        currentSemester?: number | undefined;
        graduationYear?: number | undefined;
        marks?: string | undefined;
    } | undefined;
    goals?: {
        purpose?: "other" | "financial_assistance" | "loan" | "scholarship" | "business_support" | undefined;
        goals?: string | undefined;
        amountRequired?: number | undefined;
        timeline?: "immediate" | "1_3_months" | "3_6_months" | "6_12_months" | "over_year" | undefined;
        additionalNotes?: string | undefined;
    } | undefined;
    personal?: {
        fullName: string;
        cnic: string;
        dob: Date;
        gender: "other" | "male" | "female" | "prefer_not_to_say";
    } | undefined;
    contact?: {
        email?: string | undefined;
        phone?: string | undefined;
        houseFlat?: string | undefined;
        street?: string | undefined;
        area?: string | undefined;
        city?: string | undefined;
        province?: "Punjab" | "Sindh" | "Khyber Pakhtunkhwa" | "Balochistan" | "Islamabad Capital Territory" | "Gilgit-Baltistan" | "Azad Jammu and Kashmir" | undefined;
        postalCode?: string | undefined;
    } | undefined;
    employment?: {
        status: "employed";
        companyName: string;
        jobTitle: string;
        industry: string;
        employmentType: "full_time" | "part_time" | "contract" | "freelance";
        joiningDate: Date;
        monthlySalary: number;
        experienceYears: number;
        employerAddress: string;
    } | {
        status: "business";
        businessName: string;
        businessStartDate: Date;
        monthlyBusinessIncome: number;
        businessAddress: string;
        businessType?: string | undefined;
    } | {
        status: "student";
        institution: string;
        semester: number;
    } | {
        status: "retired";
        pensionMonthly?: number | undefined;
    } | {
        status: "unemployed";
    } | undefined;
    income?: {
        monthlySalary?: number | undefined;
        businessIncome?: number | undefined;
        pension?: number | undefined;
        rentalIncome?: number | undefined;
        freelancingIncome?: number | undefined;
        otherIncome?: number | undefined;
    } | undefined;
    expenses?: {
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
    } | undefined;
    assets?: {
        property?: number | undefined;
        vehicle?: number | undefined;
        savings?: number | undefined;
        investments?: number | undefined;
        gold?: number | undefined;
        businessAssets?: number | undefined;
        otherAssets?: number | undefined;
    } | undefined;
    liabilities?: {
        homeLoan?: number | undefined;
        personalLoan?: number | undefined;
        creditCardDebt?: number | undefined;
        vehicleLoan?: number | undefined;
        businessLoan?: number | undefined;
        otherLiabilities?: number | undefined;
    } | undefined;
    banking?: {
        bankName?: string | undefined;
        accountTitle?: string | undefined;
        iban?: string | undefined;
        branchName?: string | undefined;
        branchCode?: string | undefined;
    } | undefined;
    family?: {
        maritalStatus?: "single" | "married" | "divorced" | "widowed" | undefined;
        familyMembers?: number | undefined;
        dependents?: number | undefined;
        spouseEmploymentStatus?: "employed" | "business" | "unemployed" | "homemaker" | "not_applicable" | undefined;
        householdMonthlyIncome?: number | undefined;
    } | undefined;
    documents?: z.objectOutputType<{}, z.ZodTypeAny, "passthrough"> | undefined;
    declaration?: {
        agreed?: true | undefined;
        privacyNoticeVersion?: string | undefined;
    } | undefined;
}, {
    education?: {
        highestQualification: "matric" | "intermediate" | "diploma" | "bachelors" | "masters" | "mphil" | "phd" | "other";
        degree: string;
        institute: string;
        board: string;
        fieldOfStudy: string;
        isCurrentStudent?: boolean | undefined;
        currentSemester?: number | undefined;
        graduationYear?: number | undefined;
        marks?: string | undefined;
    } | undefined;
    goals?: {
        purpose?: "other" | "financial_assistance" | "loan" | "scholarship" | "business_support" | undefined;
        goals?: string | undefined;
        amountRequired?: number | undefined;
        timeline?: "immediate" | "1_3_months" | "3_6_months" | "6_12_months" | "over_year" | undefined;
        additionalNotes?: string | undefined;
    } | undefined;
    personal?: {
        fullName: string;
        cnic: string;
        dob: Date;
        gender: "other" | "male" | "female" | "prefer_not_to_say";
    } | undefined;
    contact?: {
        email?: string | undefined;
        phone?: string | undefined;
        houseFlat?: string | undefined;
        street?: string | undefined;
        area?: string | undefined;
        city?: string | undefined;
        province?: "Punjab" | "Sindh" | "Khyber Pakhtunkhwa" | "Balochistan" | "Islamabad Capital Territory" | "Gilgit-Baltistan" | "Azad Jammu and Kashmir" | undefined;
        postalCode?: string | undefined;
    } | undefined;
    employment?: {
        status: "employed";
        companyName: string;
        jobTitle: string;
        industry: string;
        employmentType: "full_time" | "part_time" | "contract" | "freelance";
        joiningDate: Date;
        monthlySalary: number;
        experienceYears: number;
        employerAddress: string;
    } | {
        status: "business";
        businessName: string;
        businessStartDate: Date;
        monthlyBusinessIncome: number;
        businessAddress: string;
        businessType?: string | undefined;
    } | {
        status: "student";
        institution: string;
        semester: number;
    } | {
        status: "retired";
        pensionMonthly?: number | undefined;
    } | {
        status: "unemployed";
    } | undefined;
    income?: {
        monthlySalary?: number | undefined;
        businessIncome?: number | undefined;
        pension?: number | undefined;
        rentalIncome?: number | undefined;
        freelancingIncome?: number | undefined;
        otherIncome?: number | undefined;
    } | undefined;
    expenses?: {
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
    } | undefined;
    assets?: {
        property?: number | undefined;
        vehicle?: number | undefined;
        savings?: number | undefined;
        investments?: number | undefined;
        gold?: number | undefined;
        businessAssets?: number | undefined;
        otherAssets?: number | undefined;
    } | undefined;
    liabilities?: {
        homeLoan?: number | undefined;
        personalLoan?: number | undefined;
        creditCardDebt?: number | undefined;
        vehicleLoan?: number | undefined;
        businessLoan?: number | undefined;
        otherLiabilities?: number | undefined;
    } | undefined;
    banking?: {
        bankName?: string | undefined;
        accountTitle?: string | undefined;
        iban?: string | undefined;
        branchName?: string | undefined;
        branchCode?: string | undefined;
    } | undefined;
    family?: {
        maritalStatus?: "single" | "married" | "divorced" | "widowed" | undefined;
        familyMembers?: number | undefined;
        dependents?: number | undefined;
        spouseEmploymentStatus?: "employed" | "business" | "unemployed" | "homemaker" | "not_applicable" | undefined;
        householdMonthlyIncome?: number | undefined;
    } | undefined;
    documents?: z.objectInputType<{}, z.ZodTypeAny, "passthrough"> | undefined;
    declaration?: {
        agreed?: true | undefined;
        privacyNoticeVersion?: string | undefined;
    } | undefined;
}>;
export type DraftInput = z.infer<typeof draftSchema>;
export declare const ALLOWED_UPLOAD_TYPES: readonly ["image/png", "image/jpeg", "application/pdf"];
export declare const MAX_UPLOAD_BYTES: number;
export declare const uploadMetaSchema: z.ZodObject<{
    filename: z.ZodString;
    contentType: z.ZodEnum<["image/png", "image/jpeg", "application/pdf"]>;
    sizeBytes: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    filename: string;
    contentType: "image/png" | "image/jpeg" | "application/pdf";
    sizeBytes: number;
}, {
    filename: string;
    contentType: "image/png" | "image/jpeg" | "application/pdf";
    sizeBytes: number;
}>;
export type UploadMeta = z.infer<typeof uploadMetaSchema>;
