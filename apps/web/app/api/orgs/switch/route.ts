import { z } from "zod";
import { requireUser, switchOrg } from "@/lib/auth";

export const dynamic = "force-dynamic";

const Body = z.object({ orgId: z.string().min(1) });

export async function POST(request: Request) {
  const user = await requireUser();
  if (!user) return Response.json({ error: "unauthorized" }, { status: 401 });

  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "invalid_input" }, { status: 400 });

  const ok = await switchOrg(user.id, parsed.data.orgId);
  return ok ? Response.json({ ok: true }) : Response.json({ error: "not_a_member" }, { status: 403 });
}
