-- Provision the application DB role used at runtime.
--
-- Why a separate role: the migration/owner role is a superuser, and Postgres
-- superusers (and table owners under non-FORCE RLS) BYPASS Row-Level Security.
-- The app therefore MUST connect as a NON-superuser, non-owner role so RLS is
-- actually enforced. Run this as the owner/superuser AFTER migrations.
--
-- Credentials here are for local dev / CI only. In production the app role and
-- its password are provisioned by infrastructure (never committed).

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'attestor_app') THEN
    CREATE ROLE attestor_app LOGIN PASSWORD 'attestor_app';
  END IF;
END
$$;

-- Least privilege: schema usage + DML only (no DDL, no BYPASSRLS, no superuser).
GRANT USAGE ON SCHEMA public TO attestor_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO attestor_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO attestor_app;

-- Future tables/sequences created by the owner are auto-granted to the app role.
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO attestor_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO attestor_app;
