// Role-based access control for org-scoped resources.
// Roles mirror the Prisma `Role` enum but this module is pure (no DB deps) so it is
// trivially unit-testable and reusable on client and server.

export const ROLES = ["OWNER", "ADMIN", "CONTRIBUTOR", "VIEWER"] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_RANK: Record<Role, number> = {
  OWNER: 3,
  ADMIN: 2,
  CONTRIBUTOR: 1,
  VIEWER: 0,
};

export const ACTIONS = [
  "org:read",
  "org:update",
  "org:delete",
  "org:manage_billing",
  "member:read",
  "member:invite",
  "member:update_role",
  "member:remove",
  "project:read",
  "project:create",
  "project:update",
  "project:delete",
  "integration:manage",
  "scan:read",
  "scan:run",
  "requirement:read",
  "requirement:update",
  "evidence:manage",
  "comment:create",
  "audit:read",
] as const;
export type Action = (typeof ACTIONS)[number];

// Actions each role may perform. OWNER implicitly may do everything ("*").
const ABILITIES: Record<Role, readonly Action[] | "*"> = {
  OWNER: "*",
  ADMIN: [
    "org:read",
    "org:update",
    "member:read",
    "member:invite",
    "member:update_role",
    "member:remove",
    "project:read",
    "project:create",
    "project:update",
    "project:delete",
    "integration:manage",
    "scan:read",
    "scan:run",
    "requirement:read",
    "requirement:update",
    "evidence:manage",
    "comment:create",
    "audit:read",
  ],
  CONTRIBUTOR: [
    "org:read",
    "member:read",
    "project:read",
    "scan:read",
    "scan:run",
    "requirement:read",
    "requirement:update",
    "evidence:manage",
    "comment:create",
  ],
  VIEWER: [
    "org:read",
    "member:read",
    "project:read",
    "scan:read",
    "requirement:read",
  ],
};

/** Whether a role is permitted to perform an action. */
export function can(role: Role, action: Action): boolean {
  const allowed = ABILITIES[role];
  return allowed === "*" || allowed.includes(action);
}

/** Throw if the role lacks permission. Use in server handlers after resolving membership. */
export function assertCan(role: Role, action: Action): void {
  if (!can(role, action)) {
    const err = new Error(`Forbidden: ${role} cannot ${action}`);
    (err as Error & { status?: number }).status = 403;
    throw err;
  }
}

/** True if `role` is at least as privileged as `min`. */
export function atLeast(role: Role, min: Role): boolean {
  return ROLE_RANK[role] >= ROLE_RANK[min];
}
