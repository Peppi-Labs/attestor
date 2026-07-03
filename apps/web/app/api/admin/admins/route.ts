import { z } from "zod";
import { prisma } from "@attestor/db";
import { getSessionAdmin, hashPassword } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

const Body = z.object({
  email: z.string().email(),
  name: z.string().trim().min(1).max(120),
  password: z.string().min(10, "Password must be at least 10 characters"),
});

// Add another admin user (multi-user portal). Requires an authenticated admin.
export async function POST(request: Request) {
  const actor = await getSessionAdmin();
  if (!actor) return Response.json({ error: "unauthorized" }, { status: 401 });

  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json(
      { error: parsed.success === false ? parsed.error.issues[0]?.message : "invalid_input" },
      { status: 400 },
    );
  }
  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) return Response.json({ error: "email_taken" }, { status: 409 });

  const admin = await prisma.adminUser.create({
    data: { email, name: parsed.data.name, passwordHash: hashPassword(parsed.data.password) },
  });
  return Response.json({ ok: true, id: admin.id });
}
