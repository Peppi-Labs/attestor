import { prisma } from "@attestor/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return Response.json({ status: "ok", db: "up" });
  } catch (e) {
    return Response.json(
      { status: "degraded", db: "down", error: (e as Error).message },
      { status: 503 },
    );
  }
}
