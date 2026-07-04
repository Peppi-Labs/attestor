import { z } from "zod";
import { createUserSession, verifyLogin } from "@/lib/auth";

export const dynamic = "force-dynamic";

const Body = z.object({ email: z.string().email(), password: z.string().min(1) });

export async function POST(request: Request) {
  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "invalid_input" }, { status: 400 });

  const user = await verifyLogin(parsed.data.email, parsed.data.password);
  if (!user) return Response.json({ error: "invalid_credentials" }, { status: 401 });

  // If MFA is enabled, issue an MFA-pending session; the client must complete the TOTP step.
  await createUserSession(user.id, user.mfaEnabled);
  return Response.json({ ok: true, mfaRequired: user.mfaEnabled });
}
