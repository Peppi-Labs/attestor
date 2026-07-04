import { z } from "zod";
import { prisma } from "@attestor/db";
import { NOTIFY_EMAIL, sendMail } from "@/lib/mailer";

export const dynamic = "force-dynamic";

const ORIGIN = process.env.MARKETING_ORIGIN ?? "*";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function cors(res: Response): Response {
  res.headers.set("Access-Control-Allow-Origin", ORIGIN);
  res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");
  res.headers.set("Vary", "Origin");
  return res;
}

export function OPTIONS() {
  return cors(new Response(null, { status: 204 }));
}

const Body = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(320),
  message: z.string().trim().min(1).max(5000),
  source: z.string().max(60).optional(),
  // honeypot — humans never fill this; if present we drop silently (checked below)
  company_website: z.string().max(200).optional(),
});

// Best-effort in-memory rate limit (per IP): 5 requests / 10 min.
const hits = new Map<string, { n: number; resetAt: number }>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || rec.resetAt < now) {
    hits.set(ip, { n: 1, resetAt: now + 10 * 60 * 1000 });
    return false;
  }
  rec.n += 1;
  return rec.n > 5;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (rateLimited(ip)) {
    return cors(Response.json({ error: "rate_limited" }, { status: 429 }));
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return cors(Response.json({ error: "invalid_json" }, { status: 400 }));
  }

  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return cors(Response.json({ error: "invalid_input" }, { status: 400 }));
  }

  // Honeypot filled -> pretend success, drop silently.
  if (parsed.data.company_website) {
    return cors(Response.json({ ok: true }));
  }

  const { name, email, message, source } = parsed.data;
  await prisma.contactSubmission.create({
    data: { name, email, message, source: source ?? "marketing", ip },
  });

  // Notify the team. Non-blocking: a mail failure must not fail the submission.
  sendMail({
    to: NOTIFY_EMAIL,
    subject: `New contact submission from ${name}`,
    text: `From: ${name} <${email}>\nSource: ${source ?? "marketing"}\n\n${message}`,
    html: `<p><strong>${escapeHtml(name)}</strong> &lt;${escapeHtml(email)}&gt; wrote via ${escapeHtml(
      source ?? "marketing",
    )}:</p><blockquote>${escapeHtml(message).replace(/\n/g, "<br>")}</blockquote>`,
  }).catch((e) => console.error("[contact] notification failed:", e));

  return cors(Response.json({ ok: true }));
}
