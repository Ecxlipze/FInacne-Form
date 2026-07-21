/**
 * Domain validators for Pakistani financial data. Each returns a normalized value or throws,
 * so schemas can both validate and canonicalize in one step.
 */
/** CNIC: 13 digits, canonical form 42101-1234567-8. Accepts with or without dashes. */
export declare function normalizeCnic(raw: string): string;
export declare const CNIC_REGEX: RegExp;
/** Auto-formats CNIC string in real-time as the user types (e.g. 42101-1234567-8) */
export declare function formatCnicInput(raw: string): string;
/**
 * Pakistan mobile number. Accepts 03XXXXXXXXX, 3XXXXXXXXX, +923XXXXXXXXX, 00923XXXXXXXXX.
 * Canonicalizes to +923XXXXXXXXX. Mobile numbers are 3 + 9 digits after the country code.
 */
export declare function normalizePhone(raw: string): string;
/** Auto-formats local Pakistan phone input as the user types (e.g. 0300-1234567) */
export declare function formatPhoneInput(raw: string): string;
/** Name input sanitizer: keeps only letters, spaces, hyphens, and apostrophes. */
export declare function sanitizeNameInput(raw: string): string;
/**
 * IBAN validation via ISO 13616 mod-97 checksum. Also enforces Pakistan length (24) when the
 * IBAN starts with PK. Returns the compact, uppercased IBAN.
 */
export declare function normalizeIban(raw: string): string;
/** Whole years between dob and now. */
export declare function ageFromDob(dob: Date, now?: Date): number;
/** Friendly error message extractor for end-user UI display. */
export declare function getFriendlyErrorMessage(err: unknown): string;
