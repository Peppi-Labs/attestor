import { z } from "zod";
import { prisma } from "@attestor/db";
import { getSessionAdmin } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

const Body = z.object({ status: z.enum(["NEW", "READ", "ARCHIVED"]) });

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const actor = await getSessionAdmin();
  if (!actor) return Response.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await params;
  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "invalid_input" }, { status: 400 });

  await prisma.contactSubmission.update({
    where: { id },
    data: { status: parsed.data.status, handledBy: actor.id },
  });
  return Response.json({ ok: true });
}
