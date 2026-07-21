"use strict";
/**
 * Domain validators for Pakistani financial data. Each returns a normalized value or throws,
 * so schemas can both validate and canonicalize in one step.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CNIC_REGEX = void 0;
exports.normalizeCnic = normalizeCnic;
exports.formatCnicInput = formatCnicInput;
exports.normalizePhone = normalizePhone;
exports.formatPhoneInput = formatPhoneInput;
exports.sanitizeNameInput = sanitizeNameInput;
exports.normalizeIban = normalizeIban;
exports.ageFromDob = ageFromDob;
exports.getFriendlyErrorMessage = getFriendlyErrorMessage;
/** CNIC: 13 digits, canonical form 42101-1234567-8. Accepts with or without dashes. */
function normalizeCnic(raw) {
    const digits = raw.replace(/\D/g, '');
    if (digits.length !== 13)
        throw new Error('CNIC must be 13 digits');
    return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
}
exports.CNIC_REGEX = /^\d{5}-\d{7}-\d$/;
/** Auto-formats CNIC string in real-time as the user types (e.g. 42101-1234567-8) */
function formatCnicInput(raw) {
    const digits = raw.replace(/\D/g, '').slice(0, 13);
    if (digits.length <= 5)
        return digits;
    if (digits.length <= 12)
        return `${digits.slice(0, 5)}-${digits.slice(5)}`;
    return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
}
/**
 * Pakistan mobile number. Accepts 03XXXXXXXXX, 3XXXXXXXXX, +923XXXXXXXXX, 00923XXXXXXXXX.
 * Canonicalizes to +923XXXXXXXXX. Mobile numbers are 3 + 9 digits after the country code.
 */
function normalizePhone(raw) {
    let d = raw.replace(/[\s()-]/g, '');
    d = d.replace(/^\+/, '').replace(/^00/, '');
    if (d.startsWith('92'))
        d = d.slice(2);
    if (d.startsWith('0'))
        d = d.slice(1);
    if (!/^3\d{9}$/.test(d))
        throw new Error('Invalid Pakistan mobile number');
    return `+92${d}`;
}
/** Auto-formats local Pakistan phone input as the user types (e.g. 0300-1234567) */
function formatPhoneInput(raw) {
    let cleaned = raw.replace(/[^0-9+]/g, '');
    if (cleaned.startsWith('+92')) {
        const digits = cleaned.slice(3).replace(/\D/g, '').slice(0, 10);
        if (digits.length <= 3)
            return `+92-${digits}`;
        return `+92-${digits.slice(0, 3)}-${digits.slice(3)}`;
    }
    const digits = cleaned.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 4)
        return digits;
    return `${digits.slice(0, 4)}-${digits.slice(4)}`;
}
/** Name input sanitizer: keeps only letters, spaces, hyphens, and apostrophes. */
function sanitizeNameInput(raw) {
    return raw.replace(/[^a-zA-Z\s'-]/g, '');
}
/**
 * IBAN validation via ISO 13616 mod-97 checksum. Also enforces Pakistan length (24) when the
 * IBAN starts with PK. Returns the compact, uppercased IBAN.
 */
function normalizeIban(raw) {
    const iban = raw.replace(/\s/g, '').toUpperCase();
    if (!/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(iban))
        throw new Error('Malformed IBAN');
    if (iban.startsWith('PK') && iban.length !== 24) {
        throw new Error('Pakistan IBAN must be 24 characters');
    }
    // Move the first 4 chars to the end, map letters to numbers (A=10..Z=35), take mod 97.
    const rearranged = iban.slice(4) + iban.slice(0, 4);
    const numeric = rearranged.replace(/[A-Z]/g, (c) => String(c.charCodeAt(0) - 55));
    if (mod97(numeric) !== 1)
        throw new Error('IBAN checksum failed');
    return iban;
}
/** mod-97 over an arbitrarily long numeric string (can't use Number — overflows). */
function mod97(numeric) {
    let remainder = 0;
    for (const ch of numeric)
        remainder = (remainder * 10 + (ch.charCodeAt(0) - 48)) % 97;
    return remainder;
}
/** Whole years between dob and now. */
function ageFromDob(dob, now = new Date()) {
    let age = now.getFullYear() - dob.getFullYear();
    const m = now.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < dob.getDate()))
        age--;
    return age;
}
/** Friendly error message extractor for end-user UI display. */
function getFriendlyErrorMessage(err) {
    if (!err)
        return 'An unexpected error occurred. Please try again.';
    if (typeof err === 'string')
        return err;
    if (err instanceof Error) {
        if (err.message.includes('CNIC'))
            return 'Please enter a valid 13-digit CNIC number.';
        if (err.message.includes('mobile'))
            return 'Please enter a valid Pakistan mobile phone number.';
        if (err.message.includes('IBAN'))
            return 'Please enter a valid 24-character IBAN.';
        return err.message;
    }
    return 'Please check your inputs and try again.';
}
