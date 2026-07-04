import { z } from "zod";
import { createUserSession, signup } from "@/lib/auth";

export const dynamic = "force-dynamic";

const Body = z.object({
  email: z.string().email(),
  name: z.string().trim().min(1).max(120),
  password: z.string().min(10, "Password must be at least 10 characters"),
});

export async function POST(request: Request) {
  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message ?? "invalid_input" }, { status: 400 });
  }
  try {
    const { user } = await signup(parsed.data.email, parsed.data.name, parsed.data.password);
    await createUserSession(user.id, false);
    return Response.json({ ok: true });
  } catch (e) {
    const status = (e as { status?: number }).status ?? 500;
    return Response.json({ error: status === 409 ? "email_taken" : "server_error" }, { status });
  }
}
