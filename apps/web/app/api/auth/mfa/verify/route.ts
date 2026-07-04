import { z } from "zod";
import { completeMfaForCurrentSession, getSessionUser } from "@/lib/auth";
import { decrypt } from "@/lib/crypto";
import { verifyToken } from "@/lib/mfa";

export const dynamic = "force-dynamic";

const Body = z.object({ token: z.string().min(6).max(10) });

// Complete the TOTP challenge for an MFA-pending session (login step 2).
export async function POST(request: Request) {
  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "invalid_input" }, { status: 400 });

  const s = await getSessionUser();
  if (!s) return Response.json({ error: "unauthorized" }, { status: 401 });
  if (!s.mfaPending) return Response.json({ ok: true }); // already satisfied
  if (!s.user.mfaSecret) return Response.json({ error: "mfa_not_enrolled" }, { status: 400 });

  if (!verifyToken(parsed.data.token, decrypt(s.user.mfaSecret))) {
    return Response.json({ error: "invalid_code" }, { status: 401 });
  }
  await completeMfaForCurrentSession();
  return Response.json({ ok: true });
}
