"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMetaSchema = exports.MAX_UPLOAD_BYTES = exports.ALLOWED_UPLOAD_TYPES = exports.draftSchema = exports.applicationSchema = exports.STEP_ORDER = exports.stepSchemas = void 0;
const zod_1 = require("zod");
const sections_1 = require("./sections");
/** Ordered wizard steps. The frontend maps over this; the backend validates each on save. */
exports.stepSchemas = {
    personal: sections_1.personalSchema,
    contact: sections_1.contactSchema,
    education: sections_1.educationSchema,
    employment: sections_1.employmentSchema,
    income: sections_1.incomeSchema,
    expenses: sections_1.expensesSchema,
    assets: sections_1.assetsSchema,
    liabilities: sections_1.liabilitiesSchema,
    banking: sections_1.bankingSchema,
    family: sections_1.familySchema,
    goals: sections_1.goalsSchema,
    documents: sections_1.documentsSchema,
    declaration: sections_1.declarationSchema,
};
exports.STEP_ORDER = Object.keys(exports.stepSchemas);
/** Full form. Autosave validates a single step; submit validates the whole thing. */
exports.applicationSchema = zod_1.z.object({
    personal: sections_1.personalSchema,
    contact: sections_1.contactSchema,
    education: sections_1.educationSchema,
    employment: sections_1.employmentSchema,
    income: sections_1.incomeSchema,
    expenses: sections_1.expensesSchema,
    assets: sections_1.assetsSchema,
    liabilities: sections_1.liabilitiesSchema,
    banking: sections_1.bankingSchema,
    family: sections_1.familySchema,
    goals: sections_1.goalsSchema,
    documents: sections_1.documentsSchema,
    declaration: sections_1.declarationSchema,
});
/** Autosave allows partial data (draft in progress); submit uses the full schema. */
exports.draftSchema = exports.applicationSchema.deepPartial();
// --- File upload constraints (Phase 8) ---
exports.ALLOWED_UPLOAD_TYPES = ['image/png', 'image/jpeg', 'application/pdf'];
exports.MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB
exports.uploadMetaSchema = zod_1.z.object({
    filename: zod_1.z.string().min(1).max(255),
    contentType: zod_1.z.enum(exports.ALLOWED_UPLOAD_TYPES),
    sizeBytes: zod_1.z.number().int().positive().max(exports.MAX_UPLOAD_BYTES, 'File exceeds 10 MB'),
});
