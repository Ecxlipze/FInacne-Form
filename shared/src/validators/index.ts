/**
 * Domain validators for Pakistani financial data. Each returns a normalized value or throws,
 * so schemas can both validate and canonicalize in one step.
 */

/** CNIC: 13 digits, canonical form 42101-1234567-8. Accepts with or without dashes. */
export function normalizeCnic(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length !== 13) throw new Error('CNIC must be 13 digits');
  return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
}
export const CNIC_REGEX = /^\d{5}-\d{7}-\d$/;

/**
 * Pakistan mobile number. Accepts 03XXXXXXXXX, 3XXXXXXXXX, +923XXXXXXXXX, 00923XXXXXXXXX.
 * Canonicalizes to +923XXXXXXXXX. Mobile numbers are 3 + 9 digits after the country code.
 */
export function normalizePhone(raw: string): string {
  let d = raw.replace(/[\s()-]/g, '');
  d = d.replace(/^\+/, '').replace(/^00/, '');
  if (d.startsWith('92')) d = d.slice(2);
  if (d.startsWith('0')) d = d.slice(1);
  if (!/^3\d{9}$/.test(d)) throw new Error('Invalid Pakistan mobile number');
  return `+92${d}`;
}

/**
 * IBAN validation via ISO 13616 mod-97 checksum. Also enforces Pakistan length (24) when the
 * IBAN starts with PK. Returns the compact, uppercased IBAN.
 */
export function normalizeIban(raw: string): string {
  const iban = raw.replace(/\s/g, '').toUpperCase();
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(iban)) throw new Error('Malformed IBAN');
  if (iban.startsWith('PK') && iban.length !== 24) {
    throw new Error('Pakistan IBAN must be 24 characters');
  }
  // Move the first 4 chars to the end, map letters to numbers (A=10..Z=35), take mod 97.
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  const numeric = rearranged.replace(/[A-Z]/g, (c) => String(c.charCodeAt(0) - 55));
  if (mod97(numeric) !== 1) throw new Error('IBAN checksum failed');
  return iban;
}

/** mod-97 over an arbitrarily long numeric string (can't use Number — overflows). */
function mod97(numeric: string): number {
  let remainder = 0;
  for (const ch of numeric) remainder = (remainder * 10 + (ch.charCodeAt(0) - 48)) % 97;
  return remainder;
}

/** Whole years between dob and now. */
export function ageFromDob(dob: Date, now: Date = new Date()): number {
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
  return age;
}
