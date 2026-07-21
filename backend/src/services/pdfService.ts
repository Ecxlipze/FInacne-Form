import fs from 'fs';
import PDFDocument from 'pdfkit';
import { env } from '../config/env';

const INK = '#12333B';
const MUTED = '#5B6B70';
const VERIFY = '#167C5C';
const LINE = '#DDE3E4';

export interface PdfApplication {
  appId?: string;
  status: string;
  submittedAt: Date | null;
  createdAt: Date;
  consent: { privacyNoticeVersion: string; acceptedAt: Date } | null;
  data: Record<string, Record<string, unknown> | undefined>;
}

function humanize(key: string): string {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase()).trim();
}
function formatValue(v: unknown): string {
  if (v === null || v === undefined || v === '') return '—';
  if (typeof v === 'boolean') return v ? 'Yes' : 'No';
  if (typeof v === 'number') return v.toLocaleString('en-PK');
  if (typeof v === 'object') return '—';
  return String(v);
}

/** Stream a formatted application PDF to the given writable stream. */
export function buildApplicationPdf(stream: NodeJS.WritableStream, app: PdfApplication): void {
  const doc = new PDFDocument({ size: 'A4', margin: 50, bufferPages: true });
  doc.pipe(stream);

  const left = doc.page.margins.left;
  const right = doc.page.width - doc.page.margins.right;

  // --- Header / logo ---
  if (env.companyLogoPath && fs.existsSync(env.companyLogoPath)) {
    try {
      doc.image(env.companyLogoPath, left, 40, { height: 36 });
    } catch {
      doc.fontSize(16).fillColor(INK).text('Financial Information Portal', left, 46);
    }
  } else {
    doc.fontSize(16).fillColor(INK).text('Financial Information Portal', left, 46);
  }
  doc.moveTo(left, 86).lineTo(right, 86).strokeColor(LINE).stroke();
  doc.moveDown(2);

  // --- Title + meta ---
  doc.fontSize(22).fillColor(INK).text(`Application ${app.appId ?? '(draft)'}`, left, 100);
  doc.moveDown(0.5);
  doc.fontSize(11).fillColor(MUTED);
  const submitted = app.submittedAt ? new Date(app.submittedAt).toLocaleString('en-PK') : 'Not submitted';
  doc.text(`Submission date: ${submitted}`);
  doc.text(`Status: ${app.status.replace(/_/g, ' ')}`);
  if (app.consent) doc.text(`Privacy notice accepted: v${app.consent.privacyNoticeVersion}`);
  doc.moveDown(1);

  // --- Sections ---
  for (const [section, fields] of Object.entries(app.data)) {
    const entries = Object.entries(fields ?? {});
    if (entries.length === 0) continue;

    if (doc.y > doc.page.height - 140) doc.addPage();

    doc.fontSize(14).fillColor(VERIFY).text(humanize(section));
    doc.moveTo(left, doc.y + 2).lineTo(right, doc.y + 2).strokeColor(LINE).stroke();
    doc.moveDown(0.6);

    for (const [k, v] of entries) {
      if (doc.y > doc.page.height - 90) doc.addPage();
      const y = doc.y;
      doc.fontSize(10).fillColor(MUTED).text(humanize(k), left, y, { width: 180 });
      doc.fontSize(10).fillColor(INK).text(formatValue(v), left + 190, y, { width: right - left - 190 });
      doc.moveDown(0.4);
    }
    doc.moveDown(0.8);
  }

  // --- Footer on every page ---
  const generatedAt = new Date().toLocaleString('en-PK');
  const range = doc.bufferedPageRange();
  for (let i = 0; i < range.count; i++) {
    doc.switchToPage(range.start + i);
    const y = doc.page.height - 40;
    doc.fontSize(8).fillColor(MUTED);
    doc.text(`Generated on ${generatedAt}`, left, y, { lineBreak: false });
    doc.text(`Page ${i + 1} of ${range.count}`, left, y, { width: right - left, align: 'right', lineBreak: false });
  }

  doc.end();
}
