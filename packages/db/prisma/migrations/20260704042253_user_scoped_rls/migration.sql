-- Identity-scoped RLS: let a signed-in user read their OWN membership rows (across
-- orgs) and the orgs they belong to, so the auth layer can resolve orgs/roles —
-- without exposing other tenants' data. Keyed on the `app.current_user` setting.

CREATE OR REPLACE FUNCTION app_current_user() RETURNS text
  LANGUAGE sql STABLE AS $$
  SELECT current_setting('app.current_user', true)
$$;

-- SECURITY DEFINER (owned by the superuser) so the internal membership lookup can
-- bypass RLS without recursion. Returns the org ids a user belongs to.
CREATE OR REPLACE FUNCTION user_org_ids(uid text) RETURNS SETOF text
  LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT "orgId" FROM "Membership" WHERE "userId" = uid
$$;

-- Membership: readable when in the org's context OR when it is the current user's own row.
-- Writes still require org context (WITH CHECK unchanged).
DROP POLICY IF EXISTS membership_isolation ON "Membership";
CREATE POLICY membership_isolation ON "Membership"
  USING ("orgId" = app_current_org() OR "userId" = app_current_user())
  WITH CHECK ("orgId" = app_current_org());

-- Org: readable when it is the current org OR one the current user belongs to.
DROP POLICY IF EXISTS org_isolation ON "Org";
CREATE POLICY org_isolation ON "Org"
  USING ("id" = app_current_org() OR "id" IN (SELECT user_org_ids(app_current_user())))
  WITH CHECK ("id" = app_current_org());
