import { PrismaClient } from "@prisma/client";

export * from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

/**
 * Base client. NEVER use this directly for tenant-scoped data — use withOrg().
 * Direct use is reserved for global data (e.g. published SpecVersions) and auth.
 *
 * The runtime connection uses APP_DATABASE_URL — a NON-superuser role — so Postgres
 * Row-Level Security is actually enforced (superusers/owners bypass RLS). Prisma CLI
 * (migrate/generate/seed) uses DATABASE_URL (the owner) via the schema datasource.
 */
function makeClient(): PrismaClient {
  const url = process.env.APP_DATABASE_URL ?? process.env.DATABASE_URL;
  return new PrismaClient(url ? { datasources: { db: { url } } } : undefined);
}

export const prisma: PrismaClient = globalForPrisma.prisma ?? makeClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

/**
 * Run a callback with the tenant context set, so Postgres Row-Level Security
 * policies scope every query to `orgId`. The org id is bound as a parameter to
 * `set_config` (not string-interpolated) and is transaction-local (`is_local = true`).
 *
 *   const projects = await withOrg(orgId, (tx) => tx.project.findMany());
 *
 * RLS with FORCE ROW LEVEL SECURITY means even the table owner is filtered, so a
 * missing/incorrect orgId yields zero rows rather than a leak.
 */
type Tx = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

export async function withOrg<T>(orgId: string, fn: (tx: Tx) => Promise<T>): Promise<T> {
  if (!orgId) throw new Error("withOrg: orgId is required");
  return prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT set_config('app.current_org', ${orgId}, true)`;
    return fn(tx);
  });
}

/**
 * Run with the identity context set, so a user may read their OWN membership rows
 * (across orgs) and the orgs they belong to — without exposing other tenants' data.
 * Used by the auth layer to resolve which orgs/roles a signed-in user has.
 */
export async function withUser<T>(userId: string, fn: (tx: Tx) => Promise<T>): Promise<T> {
  if (!userId) throw new Error("withUser: userId is required");
  return prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT set_config('app.current_user', ${userId}, true)`;
    return fn(tx);
  });
}
