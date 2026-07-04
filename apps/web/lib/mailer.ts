import nodemailer, { type Transporter } from "nodemailer";

const FROM = process.env.EMAIL_FROM ?? "Attestor <noreply@peppi.ai>";

let cached: Transporter | null = null;
function transport(): Transporter | null {
  if (cached) return cached;
  const url = process.env.SMTP_URL;
  if (!url) return null; // dev: no SMTP configured
  cached = nodemailer.createTransport(url);
  return cached;
}

export interface Mail {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

/**
 * Send an email. If SMTP_URL is unset (local dev), the message is logged to the
 * console instead of failing — so flows that notify or send links still work.
 */
export async function sendMail(mail: Mail): Promise<{ sent: boolean; dev?: boolean }> {
  const t = transport();
  if (!t) {
    console.log(
      `[mailer:dev] (no SMTP_URL)\n  to: ${mail.to}\n  subject: ${mail.subject}\n  ${mail.text}`,
    );
    return { sent: false, dev: true };
  }
  await t.sendMail({ from: FROM, ...mail });
  return { sent: true };
}

export const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL ?? "support@peppi.ai";
