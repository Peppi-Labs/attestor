import { z } from "zod";
import { prisma } from "@attestor/db";
import { createSession, verifyPassword } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

const Body = z.object({ email: z.string().email(), password: z.string().min(1) });

export async function POST(request: Request) {
  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "invalid_input" }, { status: 400 });
  }
  const admin = await prisma.adminUser.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });
  // Constant-ish response whether or not the user exists.
  if (!admin || !verifyPassword(parsed.data.password, admin.passwordHash)) {
    return Response.json({ error: "invalid_credentials" }, { status: 401 });
  }
  await createSession(admin.id);
  await prisma.adminUser.update({
    where: { id: admin.id },
    data: { lastLoginAt: new Date() },
  });
  return Response.json({ ok: true });
}
