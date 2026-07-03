import { destroySession } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function POST() {
  await destroySession();
  return Response.json({ ok: true });
}
