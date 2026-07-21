/** Pakistan geography + shared domain constants used across sections. */
export declare const PROVINCES: readonly ["Punjab", "Sindh", "Khyber Pakhtunkhwa", "Balochistan", "Islamabad Capital Territory", "Gilgit-Baltistan", "Azad Jammu and Kashmir"];
export type Province = (typeof PROVINCES)[number];
export declare const MAJOR_CITIES: readonly ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta", "Hyderabad", "Gujranwala", "Sialkot", "Bahawalpur", "Sargodha", "Sukkur", "Larkana", "Sheikhupura", "Mardan", "Gujrat", "Abbottabad", "Sahiwal", "Okara", "Wah Cantonment", "Dera Ghazi Khan", "Mirpur Khas", "Nawabshah", "Mingora", "Kasur", "Rahim Yar Khan", "Jhang", "Chiniot", "Other"];
export declare const QUALIFICATIONS: readonly [{
    readonly value: "matric";
    readonly label: "Matric / O-Level";
}, {
    readonly value: "intermediate";
    readonly label: "Intermediate / A-Level";
}, {
    readonly value: "diploma";
    readonly label: "Diploma";
}, {
    readonly value: "bachelors";
    readonly label: "Bachelor's";
}, {
    readonly value: "masters";
    readonly label: "Master's";
}, {
    readonly value: "mphil";
    readonly label: "MPhil";
}, {
    readonly value: "phd";
    readonly label: "PhD";
}, {
    readonly value: "other";
    readonly label: "Other";
}];
export declare const EMPLOYMENT_TYPES: readonly [{
    readonly value: "full_time";
    readonly label: "Full-time";
}, {
    readonly value: "part_time";
    readonly label: "Part-time";
}, {
    readonly value: "contract";
    readonly label: "Contract";
}, {
    readonly value: "freelance";
    readonly label: "Freelance";
}];
export declare const MARITAL_STATUSES: readonly [{
    readonly value: "single";
    readonly label: "Single";
}, {
    readonly value: "married";
    readonly label: "Married";
}, {
    readonly value: "divorced";
    readonly label: "Divorced";
}, {
    readonly value: "widowed";
    readonly label: "Widowed";
}];
export declare const APPLICATION_PURPOSES: readonly [{
    readonly value: "financial_assistance";
    readonly label: "Financial assistance";
}, {
    readonly value: "loan";
    readonly label: "Loan";
}, {
    readonly value: "scholarship";
    readonly label: "Scholarship / education support";
}, {
    readonly value: "business_support";
    readonly label: "Business support";
}, {
    readonly value: "other";
    readonly label: "Other";
}];
export declare const TIMELINES: readonly [{
    readonly value: "immediate";
    readonly label: "Immediate";
}, {
    readonly value: "1_3_months";
    readonly label: "1–3 months";
}, {
    readonly value: "3_6_months";
    readonly label: "3–6 months";
}, {
    readonly value: "6_12_months";
    readonly label: "6–12 months";
}, {
    readonly value: "over_year";
    readonly label: "More than a year";
}];
export interface IncomeLike {
    monthlySalary?: number;
    businessIncome?: number;
    pension?: number;
    rentalIncome?: number;
    freelancingIncome?: number;
    otherIncome?: number;
}
export declare const totalMonthlyIncome: (i?: IncomeLike) => number;
export interface ExpensesLike {
    houseRent?: number;
    electricity?: number;
    gas?: number;
    internet?: number;
    water?: number;
    education?: number;
    medical?: number;
    transportation?: number;
    groceries?: number;
    loanInstallments?: number;
    otherExpenses?: number;
}
export declare const totalMonthlyExpenses: (e?: ExpensesLike) => number;
export interface AssetsLike {
    property?: number;
    vehicle?: number;
    savings?: number;
    investments?: number;
    gold?: number;
    businessAssets?: number;
    otherAssets?: number;
}
export declare const totalAssets: (a?: AssetsLike) => number;
export interface LiabilitiesLike {
    homeLoan?: number;
    personalLoan?: number;
    creditCardDebt?: number;
    vehicleLoan?: number;
    businessLoan?: number;
    otherLiabilities?: number;
}
export declare const totalLiabilities: (l?: LiabilitiesLike) => number;
