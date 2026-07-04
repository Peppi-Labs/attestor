import { z } from "zod";
import { withOrg } from "@attestor/db";
import { assertCan } from "@attestor/core";
import { getCurrentOrg, requireUser } from "@/lib/auth";
import { audit } from "@/lib/audit";

export const dynamic = "force-dynamic";

const Body = z.object({ name: z.string().trim().min(1).max(120) });

export async function POST(request: Request) {
  const user = await requireUser();
  if (!user) return Response.json({ error: "unauthorized" }, { status: 401 });

  const ctx = await getCurrentOrg(user.id);
  if (!ctx) return Response.json({ error: "no_org" }, { status: 400 });

  try {
    assertCan(ctx.role, "project:create");
  } catch {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }

  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "invalid_input" }, { status: 400 });

  const project = await withOrg(ctx.org.id, (tx) =>
    tx.project.create({ data: { orgId: ctx.org.id, name: parsed.data.name } }),
  );
  await audit(ctx.org.id, user.id, "project.create", `project:${project.id}`, { name: parsed.data.name });

  return Response.json({ ok: true, id: project.id });
}
