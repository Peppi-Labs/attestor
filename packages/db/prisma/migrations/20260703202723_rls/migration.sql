-- Row-Level Security: tenant isolation keyed on the transaction-local setting
-- `app.current_org` (set by withOrg() in @attestor/db). FORCE ROW LEVEL SECURITY
-- ensures even the table owner (the app's connection role) is filtered, so a
-- missing/incorrect org context yields zero rows instead of a cross-tenant leak.
--
-- This SQL is the source of truth; it is copied verbatim into the Prisma
-- migration `0002_rls/migration.sql` so `prisma migrate deploy` applies it.

-- Helper: current org from the session setting (NULL when unset -> default deny).
CREATE OR REPLACE FUNCTION app_current_org() RETURNS text
  LANGUAGE sql STABLE AS $$
  SELECT current_setting('app.current_org', true)
$$;

-- Org: scoped by its own id.
ALTER TABLE "Org" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Org" FORCE ROW LEVEL SECURITY;
CREATE POLICY org_isolation ON "Org"
  USING ("id" = app_current_org())
  WITH CHECK ("id" = app_current_org());

-- Tenant tables: scoped by "orgId".
ALTER TABLE "Membership" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Membership" FORCE ROW LEVEL SECURITY;
CREATE POLICY membership_isolation ON "Membership"
  USING ("orgId" = app_current_org())
  WITH CHECK ("orgId" = app_current_org());

ALTER TABLE "Project" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Project" FORCE ROW LEVEL SECURITY;
CREATE POLICY project_isolation ON "Project"
  USING ("orgId" = app_current_org())
  WITH CHECK ("orgId" = app_current_org());

ALTER TABLE "AuditEvent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditEvent" FORCE ROW LEVEL SECURITY;
CREATE POLICY audit_isolation ON "AuditEvent"
  USING ("orgId" = app_current_org())
  WITH CHECK ("orgId" = app_current_org());

-- NOTE: "User" is a GLOBAL identity (a user belongs to many orgs via Membership),
-- so it is intentionally NOT under RLS. Access to user records is authorized at the
-- application layer via membership checks.
