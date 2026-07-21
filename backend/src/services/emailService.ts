/**
 * Transactional email. With SMTP configured it sends; without it (dev) messages are logged
 * to the console instead, so local work isn't blocked. Sends are fire-and-forget at call sites —
 * a mail failure must never break the applicant's action.
 */
import nodemailer, { Transporter } from 'nodemailer';
import { env } from '../config/env';

let transporter: Transporter | null = null;
function getTransport(): Transporter {
  if (transporter) return transporter;
  if (env.smtpHost) {
    transporter = nodemailer.createTransport({
      host: env.smtpHost,
      port: env.smtpPort,
      secure: env.smtpPort === 465,
      auth: env.smtpUser ? { user: env.smtpUser, pass: env.smtpPass } : undefined,
    });
  } else {
    // Dev: does not send; returns the composed message as JSON.
    transporter = nodemailer.createTransport({ jsonTransport: true });
  }
  return transporter;
}

async function send(to: string, subject: string, text: string): Promise<void> {
  const info = await getTransport().sendMail({ from: env.emailFrom, to, subject, text });
  if (!env.smtpHost) {
    // eslint-disable-next-line no-console
    console.log(`[email:dev] to=${to} subject="${subject}"\n${text}`);
  }
  void info;
}

export async function sendResumeLink(to: string, url: string): Promise<void> {
  await send(
    to,
    'Resume your application',
    `You can pick up your application where you left off using the secure link below. ` +
      `It expires soon and can only be used once:\n\n${url}\n\nIf you didn't request this, you can ignore this email.`
  );
}

export async function sendSubmissionReceived(to: string, appId: string): Promise<void> {
  await send(
    to,
    `Application received — ${appId}`,
    `Thank you. We've received your application. Your reference number is ${appId}. ` +
      `Please keep it for your records; we'll be in touch about next steps.`
  );
}
