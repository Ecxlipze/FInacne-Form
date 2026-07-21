/** Pakistan geography + shared domain constants used across sections. */

export const PROVINCES = [
  'Punjab',
  'Sindh',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'Islamabad Capital Territory',
  'Gilgit-Baltistan',
  'Azad Jammu and Kashmir',
] as const;
export type Province = (typeof PROVINCES)[number];

export const MAJOR_CITIES = [
  'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar',
  'Quetta', 'Hyderabad', 'Gujranwala', 'Sialkot', 'Bahawalpur', 'Sargodha', 'Sukkur',
  'Larkana', 'Sheikhupura', 'Mardan', 'Gujrat', 'Abbottabad', 'Sahiwal', 'Okara',
  'Wah Cantonment', 'Dera Ghazi Khan', 'Mirpur Khas', 'Nawabshah', 'Mingora', 'Kasur',
  'Rahim Yar Khan', 'Jhang', 'Chiniot', 'Other',
] as const;

export const QUALIFICATIONS = [
  { value: 'matric', label: 'Matric / O-Level' },
  { value: 'intermediate', label: 'Intermediate / A-Level' },
  { value: 'diploma', label: 'Diploma' },
  { value: 'bachelors', label: "Bachelor's" },
  { value: 'masters', label: "Master's" },
  { value: 'mphil', label: 'MPhil' },
  { value: 'phd', label: 'PhD' },
  { value: 'other', label: 'Other' },
] as const;

export const EMPLOYMENT_TYPES = [
  { value: 'full_time', label: 'Full-time' },
  { value: 'part_time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'freelance', label: 'Freelance' },
] as const;

export const MARITAL_STATUSES = [
  { value: 'single', label: 'Single' },
  { value: 'married', label: 'Married' },
  { value: 'divorced', label: 'Divorced' },
  { value: 'widowed', label: 'Widowed' },
] as const;

export const APPLICATION_PURPOSES = [
  { value: 'financial_assistance', label: 'Financial assistance' },
  { value: 'loan', label: 'Loan' },
  { value: 'scholarship', label: 'Scholarship / education support' },
  { value: 'business_support', label: 'Business support' },
  { value: 'other', label: 'Other' },
] as const;

export const TIMELINES = [
  { value: 'immediate', label: 'Immediate' },
  { value: '1_3_months', label: '1–3 months' },
  { value: '3_6_months', label: '3–6 months' },
  { value: '6_12_months', label: '6–12 months' },
  { value: 'over_year', label: 'More than a year' },
] as const;

// --- Calculation helpers (single source of truth for totals, used by UI and server) ---

function sum(values: Array<number | undefined | null>): number {
  return values.reduce<number>((acc, v) => acc + (typeof v === 'number' && isFinite(v) ? v : 0), 0);
}

export interface IncomeLike {
  monthlySalary?: number; businessIncome?: number; pension?: number;
  rentalIncome?: number; freelancingIncome?: number; otherIncome?: number;
}
export const totalMonthlyIncome = (i?: IncomeLike): number =>
  i ? sum([i.monthlySalary, i.businessIncome, i.pension, i.rentalIncome, i.freelancingIncome, i.otherIncome]) : 0;

export interface ExpensesLike {
  houseRent?: number; electricity?: number; gas?: number; internet?: number; water?: number;
  education?: number; medical?: number; transportation?: number; groceries?: number;
  loanInstallments?: number; otherExpenses?: number;
}
export const totalMonthlyExpenses = (e?: ExpensesLike): number =>
  e ? sum([e.houseRent, e.electricity, e.gas, e.internet, e.water, e.education, e.medical, e.transportation, e.groceries, e.loanInstallments, e.otherExpenses]) : 0;

export interface AssetsLike {
  property?: number; vehicle?: number; savings?: number; investments?: number;
  gold?: number; businessAssets?: number; otherAssets?: number;
}
export const totalAssets = (a?: AssetsLike): number =>
  a ? sum([a.property, a.vehicle, a.savings, a.investments, a.gold, a.businessAssets, a.otherAssets]) : 0;

export interface LiabilitiesLike {
  homeLoan?: number; personalLoan?: number; creditCardDebt?: number;
  vehicleLoan?: number; businessLoan?: number; otherLiabilities?: number;
}
export const totalLiabilities = (l?: LiabilitiesLike): number =>
  l ? sum([l.homeLoan, l.personalLoan, l.creditCardDebt, l.vehicleLoan, l.businessLoan, l.otherLiabilities]) : 0;
