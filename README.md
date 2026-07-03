# Attestor

**Open-source, multi-tenant platform to prepare for a Google / App Defense Alliance
CASA Tier 2 security assessment.**

Connect a GitHub repo and a website, bring your own LLM key, and get an automated,
evidence-backed pre-assessment against the current App Defense Alliance CASA
requirements — then track gaps to closed and export a package an authorized lab accepts.

> **Not an authorized CASA lab.** Attestor prepares you for a Tier 2 assessment and does
> not issue letters of validation. "CASA" is associated with the App Defense Alliance
> program; this project is independent and unaffiliated.

## Status

🚧 **Pre-alpha — building in the open.** Current milestone: **M0 (Foundations)**.
See [`docs/BUILD-PLAN.md`](docs/BUILD-PLAN.md) for the roadmap and
[`docs/PRODUCT-SPEC.md`](docs/PRODUCT-SPEC.md) for the full specification.

## Architecture (target)

Multi-tenant SaaS: stateless Next.js web/API tier + background workers off a Postgres
job queue. Tenant isolation is enforced at the application layer **and** with Postgres
Row-Level Security. Analysis runs in three modes — static code (BYO LLM), automated
website checks, and DAST (OWASP ZAP). Requirements are sourced live from the
[App Defense Alliance ASA-WG repo](https://github.com/appdefensealliance/ASA-WG) and kept
current via a spec-sync subsystem. Full detail in the spec.

```
apps/web        Next.js App Router — SPA + REST API + auth
apps/worker     background jobs (code-scan, web-checks, dast, spec-sync, reports)   [later]
packages/db     Prisma schema, client, Row-Level-Security, seed
packages/*      spec-parser, analysis, llm, crypto, github, auth, core, ui          [later]
infra/          docker-compose, Railway templates, RLS SQL
docs/           product spec, build plan, goal command
```

## Local development

Prereqs: Node ≥ 20, npm, Docker.

```bash
# 1. Start a local Postgres
docker run -d --name attestor-pg \
  -e POSTGRES_USER=attestor -e POSTGRES_PASSWORD=attestor -e POSTGRES_DB=attestor \
  -p 5434:5432 postgres:16

# 2. Install + set up the database (schema + Row-Level Security)
npm install
cp .env.example .env
npm run db:migrate -w @attestor/db     # applies schema + RLS policies

# 3. Run the web app
npm run dev                            # http://localhost:3000
```

Health check: `GET /api/health` returns `{ "status": "ok", "db": "up" }`.

## Contributing

Issues map 1:1 to the milestones/issues in [`docs/BUILD-PLAN.md`](docs/BUILD-PLAN.md).
See `CONTRIBUTING.md` and `SECURITY.md` (added in M11) for guidelines and responsible
disclosure.

## License

[Apache-2.0](LICENSE).
