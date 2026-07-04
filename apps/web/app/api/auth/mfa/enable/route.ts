import { z } from "zod";
import { prisma } from "@attestor/db";
import { requireUser } from "@/lib/auth";
import { decrypt } from "@/lib/crypto";
import { verifyToken } from "@/lib/mfa";

export const dynamic = "force-dynamic";

const Body = z.object({ token: z.string().min(6).max(10) });

// Finish enrollment: verify a code against the enrolled secret, then turn MFA on.
export async function POST(request: Request) {
  const user = await requireUser();
  if (!user) return Response.json({ error: "unauthorized" }, { status: 401 });

  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "invalid_input" }, { status: 400 });
  if (!user.mfaSecret) return Response.json({ error: "not_enrolled" }, { status: 400 });

  if (!verifyToken(parsed.data.token, decrypt(user.mfaSecret))) {
    return Response.json({ error: "invalid_code" }, { status: 401 });
  }
  await prisma.user.update({ where: { id: user.id }, data: { mfaEnabled: true } });
  return Response.json({ ok: true });
}
