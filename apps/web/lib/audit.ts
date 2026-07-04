import { withOrg } from "@attestor/db";

/**
 * Append an immutable audit event. Best-effort: audit failures must not break the
 * primary action, but they are logged. Runs inside the tenant context so it satisfies
 * the AuditEvent Row-Level Security policy.
 */
export async function audit(
  orgId: string,
  actorId: string | null,
  action: string,
  resource: string,
  metadata: Record<string, unknown> = {},
): Promise<void> {
  try {
    await withOrg(orgId, (tx) =>
      tx.auditEvent.create({
        data: { orgId, actorId, action, resource, metadata: metadata as object },
      }),
    );
  } catch (e) {
    console.error("[audit] failed:", action, resource, e);
  }
}
