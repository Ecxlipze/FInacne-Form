"use strict";
/** Pakistan geography + shared domain constants used across sections. */
Object.defineProperty(exports, "__esModule", { value: true });
exports.totalLiabilities = exports.totalAssets = exports.totalMonthlyExpenses = exports.totalMonthlyIncome = exports.TIMELINES = exports.APPLICATION_PURPOSES = exports.MARITAL_STATUSES = exports.EMPLOYMENT_TYPES = exports.QUALIFICATIONS = exports.MAJOR_CITIES = exports.PROVINCES = void 0;
exports.PROVINCES = [
    'Punjab',
    'Sindh',
    'Khyber Pakhtunkhwa',
    'Balochistan',
    'Islamabad Capital Territory',
    'Gilgit-Baltistan',
    'Azad Jammu and Kashmir',
];
exports.MAJOR_CITIES = [
    'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar',
    'Quetta', 'Hyderabad', 'Gujranwala', 'Sialkot', 'Bahawalpur', 'Sargodha', 'Sukkur',
    'Larkana', 'Sheikhupura', 'Mardan', 'Gujrat', 'Abbottabad', 'Sahiwal', 'Okara',
    'Wah Cantonment', 'Dera Ghazi Khan', 'Mirpur Khas', 'Nawabshah', 'Mingora', 'Kasur',
    'Rahim Yar Khan', 'Jhang', 'Chiniot', 'Other',
];
exports.QUALIFICATIONS = [
    { value: 'matric', label: 'Matric / O-Level' },
    { value: 'intermediate', label: 'Intermediate / A-Level' },
    { value: 'diploma', label: 'Diploma' },
    { value: 'bachelors', label: "Bachelor's" },
    { value: 'masters', label: "Master's" },
    { value: 'mphil', label: 'MPhil' },
    { value: 'phd', label: 'PhD' },
    { value: 'other', label: 'Other' },
];
exports.EMPLOYMENT_TYPES = [
    { value: 'full_time', label: 'Full-time' },
    { value: 'part_time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
    { value: 'freelance', label: 'Freelance' },
];
exports.MARITAL_STATUSES = [
    { value: 'single', label: 'Single' },
    { value: 'married', label: 'Married' },
    { value: 'divorced', label: 'Divorced' },
    { value: 'widowed', label: 'Widowed' },
];
exports.APPLICATION_PURPOSES = [
    { value: 'financial_assistance', label: 'Financial assistance' },
    { value: 'loan', label: 'Loan' },
    { value: 'scholarship', label: 'Scholarship / education support' },
    { value: 'business_support', label: 'Business support' },
    { value: 'other', label: 'Other' },
];
exports.TIMELINES = [
    { value: 'immediate', label: 'Immediate' },
    { value: '1_3_months', label: '1–3 months' },
    { value: '3_6_months', label: '3–6 months' },
    { value: '6_12_months', label: '6–12 months' },
    { value: 'over_year', label: 'More than a year' },
];
// --- Calculation helpers (single source of truth for totals, used by UI and server) ---
function sum(values) {
    return values.reduce((acc, v) => acc + (typeof v === 'number' && isFinite(v) ? v : 0), 0);
}
const totalMonthlyIncome = (i) => i ? sum([i.monthlySalary, i.businessIncome, i.pension, i.rentalIncome, i.freelancingIncome, i.otherIncome]) : 0;
exports.totalMonthlyIncome = totalMonthlyIncome;
const totalMonthlyExpenses = (e) => e ? sum([e.houseRent, e.electricity, e.gas, e.internet, e.water, e.education, e.medical, e.transportation, e.groceries, e.loanInstallments, e.otherExpenses]) : 0;
exports.totalMonthlyExpenses = totalMonthlyExpenses;
const totalAssets = (a) => a ? sum([a.property, a.vehicle, a.savings, a.investments, a.gold, a.businessAssets, a.otherAssets]) : 0;
exports.totalAssets = totalAssets;
const totalLiabilities = (l) => l ? sum([l.homeLoan, l.personalLoan, l.creditCardDebt, l.vehicleLoan, l.businessLoan, l.otherLiabilities]) : 0;
exports.totalLiabilities = totalLiabilities;
