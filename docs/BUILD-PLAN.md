# Attestor — MVP → Commercial-Ready Build Plan

Companion to [PRODUCT-SPEC.md](./PRODUCT-SPEC.md). This is the executable plan: milestones →
epics → issues, each with acceptance criteria, dependencies, and rough estimates. It is written to
be imported into a tracker (GitHub Issues / Linear) — issue IDs are stable references.

**Conventions**
- Estimates in **engineer-days (ed)**, assuming one senior full-stack engineer; parallelizable
  where dependencies allow.
- `DoD` = Definition of Done (acceptance criteria). An issue is closed only when **all** DoD
  bullets pass *and* tests for it are green in CI.
- Labels: `area:*`, `type:feat|chore|test|docs|sec`, `milestone:Mn`, `priority:P0..P2`.
- **Global DoD (applies to every issue):** typed (no `any` leaks), zod-validated inputs, unit/
  integration tests added, no secret logged, passes lint+typecheck+CI, docstring/PR description
  explains the change.

**Critical path:** M0 → M1 → M2 → M3 → M5 → (M6, M7, M8) → M9 → M11.
M4 (web checks) parallels M3. M10 (self-host) parallels M8–M9.

**Rough timeline (1–2 engineers):** MVP (M0–M6) ≈ 8–10 weeks; v1 (M7–M10) ≈ 6–8 weeks;
launch hardening (M11) ≈ 2–3 weeks. Total ≈ **16–21 weeks** to commercial-ready.

---

## M0 — Foundations  *(~10 ed)*
**Goal:** a deployable, multi-tenant-safe skeleton with auth, RBAC, RLS, CI, and the app shell.

- **M0-1 Monorepo scaffold** `type:chore area:infra` — pnpm + Turborepo + TS strict; `apps/web`,
  `apps/worker`, `packages/*` per Appendix A; shared eslint/tsconfig/prettier.
  - DoD: `pnpm i && pnpm build && pnpm test` green from clean clone; turbo caches tasks.
- **M0-2 CI pipeline** `type:chore area:infra` — GitHub Actions: typecheck, lint, test, build,
  CodeQL, dependency-review, gitleaks, license check (Appendix H).
  - DoD: all checks run on PR; branch protection requires green CI; secret-scan blocks on hit.
- **M0-3 Postgres + Prisma + RLS** `area:db` deps:M0-1 — `packages/db` with base schema (Org,
  User, Membership, Project) + raw-SQL **RLS policies** keyed on `app.current_org`.
  - DoD: migrate deploy works; an integration test proves a query without the session var returns
    zero tenant rows; with it, only the org's rows.
- **M0-4 Auth.js + sessions + MFA** `area:auth` deps:M0-3 — email magic-link + GitHub OAuth
  sign-in; TOTP MFA; hardened cookies; session invalidation hooks.
  - DoD: sign-up/in/out e2e; MFA enroll + challenge; admin role requires MFA; session cookie flags
    correct (verified by test).
- **M0-5 RBAC ability layer** `area:auth` deps:M0-4 — CASL-style `authorize(user,action,resource)`;
  Owner/Admin/Contributor/Viewer; per-project override.
  - DoD: unit matrix of role×action; every future handler must call `authorize` (lint rule/test).
- **M0-6 Org/Project CRUD + app shell** `area:web` deps:M0-5 — create org, switch org, create
  project; navigation shell, design tokens in `packages/ui`.
  - DoD: a user can create an org + project; tenancy-isolation test green for these endpoints.
- **M0-7 Audit log** `area:core` deps:M0-3 — append-only `AuditEvent`; helper wraps state changes.
  - DoD: role change, login, project create produce immutable audit rows; viewable by Admin.

---

## M1 — Integrations & secrets  *(~9 ed)*
**Goal:** connect GitHub (read-only) and store a BYO LLM key safely.

- **M1-1 Envelope encryption (`packages/crypto`)** `area:sec` deps:M0-3 — KMS-wrapped per-org data
  key, AES-256-GCM; master-key fallback for self-host; rotation primitive.
  - DoD: round-trip encrypt/decrypt tests; ciphertext at rest; key rotation re-wraps; no plaintext
    in logs (log-scrub test).
- **M1-2 GitHub App (`packages/github`)** `area:integrations` deps:M0-6 — App manifest, install
  flow, JWT→installation token (1h TTL, cached), repo list, tarball fetch at SHA.
  - DoD: install on a test org, list repos, fetch tarball; tokens never persisted; uninstall
    revokes access.
- **M1-3 LLM provider abstraction (`packages/llm`)** `area:analysis` — `complete`,
  `completeStructured(schema)`, `embed`; adapters Anthropic (default), OpenAI, OpenAI-compatible.
  - DoD: structured-output call returns schema-valid object across ≥2 providers (mocked + 1 live
    smoke); retry-on-invalid-schema works.
- **M1-4 Secret management UI + API** `area:web` deps:M1-1,M1-3 — add/validate/rotate LLM key &
  DAST auth; write-only; show provider+last4.
  - DoD: saving an invalid key fails validation; saved key never returned by API; last4 shown;
    audit entry on add/rotate.

---

## M2 — Spec parser & requirement tracking  *(~10 ed)*
**Goal:** the requirement domain — parse the CASA spec, seed a bundled SpecVersion, port the
tracker (tenant-scoped).

- **M2-1 `spec-parser` package** `area:spec` — harden `parse.mjs` into a typed, tested package;
  `parseSpec` + golden tests incl. v2.1.1 snapshot (55 items).
  - DoD: golden snapshot asserts exact chapters/controls/items; throws on malformed Audit tables;
    coverage ≥ 80%.
- **M2-2 SpecVersion model + seed** `area:db` deps:M2-1 — immutable SpecVersion (raw + parsedJson +
  hash + status); seed bundles the latest published version on deploy.
  - DoD: fresh DB seeds exactly one PUBLISHED SpecVersion; projects pin it.
- **M2-3 RequirementState + Evidence + Comment models** `area:db` deps:M2-2 — tenant-scoped per
  Appendix-16 schema; relations + indexes.
  - DoD: migrations + RLS; create/read state for a project; tenancy test green.
- **M2-4 Tracker UI (port)** `area:web` deps:M2-3 — port current dashboard: chapters, status/
  assignee/notes/comments, progress, filters (chapter/status/assignee/priority), CSV/JSON export.
  - DoD: e2e set status, assign, comment, filter, export; matches current tool's UX, multi-project.
- **M2-5 Evidence checklist UI + API** `area:web` deps:M2-3 — typed artifacts, collected toggle,
  location, custom items, delete; evidence-collected counter.
  - DoD: toggle persists; add/delete custom; evidence CSV export; tenancy test green.

---

## M3 — Analysis engine: code scan  *(~12 ed)*
**Goal:** automated static pre-assessment populates requirement suggestions + evidence.

- **M3-1 Job queue + worker harness** `area:infra` deps:M0-3 — Graphile Worker (or BullMQ);
  org-scoped payloads set RLS var; progress events (SSE); retries + DLQ; per-org concurrency.
  - DoD: a sample job runs, retries on failure, streams progress; survives worker restart.
- **M3-2 Repo snapshot + framework detect** `area:analysis` deps:M1-2,M3-1 — tarball → sandboxed
  scratch FS; detect framework/language; wipe after.
  - DoD: snapshot a test repo; framework detected; scratch FS removed post-job; no code persisted.
- **M3-3 Retrieval (heuristics + embeddings)** `area:analysis` deps:M3-2,M1-3 — candidate selection
  per requirement category + embedding rank; token budget (Appendix C.2).
  - DoD: for the seeded spec, every requirement yields ≥1 candidate file on a sample repo; ranking
    unit-tested.
- **M3-4 Per-requirement judgment** `area:analysis` deps:M3-3 — structured-output prompt → Judgment
  schema; versioned prompts; cache by `(sha,specVersion,promptVersion,model)`.
  - DoD: full code scan of a sample repo populates all requirements with schema-valid suggestions;
    cache hit on re-run; cost preview shown.
- **M3-5 Scan orchestration + UI** `area:web` deps:M3-4 — Scan model, trigger, live progress, apply
  suggestions to RequirementState; re-scan diff.
  - DoD: trigger scan from UI → progress → results land on dashboard as suggestions; "accept" works;
    re-scan highlights new/resolved.

---

## M4 — Analysis engine: web checks  *(~6 ed)*  *(parallel with M3)*
**Goal:** automated runtime evidence from the site URL.

- **M4-1 Host authorization gate** `area:sec` deps:M0-6 — record per-host authorization attestation;
  block any probe without it; scope-lock to attested hosts.
  - DoD: probing an unauthorized host is refused (tested); attestation stored with user+timestamp.
- **M4-2 Web-checks worker** `area:analysis` deps:M3-1,M4-1 — TLS, security headers, cookie flags,
  debug/leak, exposed files (Appendix D); store raw captures in object storage.
  - DoD: run against a staging site → findings mapped to requirement IDs; artifacts saved + signed
    URL retrievable only by the org.
- **M4-3 Mapping table + auto-evidence** `area:core` deps:M4-2 — `web-checks.ts` map; attach results
  as evidence artifacts (type scan/screenshot).
  - DoD: mapping unit-tested; passing checks auto-mark relevant evidence collected with the capture.

---

## M5 — Onboarding wizard  *(~7 ed)*
**Goal:** zero-to-first-scan guided flow (Appendix B state machine).

- **M5-1 Wizard state machine + resume** `area:web` deps:M2-2 — persist `onboardingStep`; resumable;
  per-step guards.
  - DoD: leave mid-flow and resume to same step; guards prevent out-of-order scans.
- **M5-2 Wizard steps UI** `area:web` deps:M1-2,M1-4,M3-5,M4-1 — org/project + GitHub + host(+auth)
  + LLM key + scope + run scan + invite.
  - DoD: full e2e: new user → connected → first scan SUCCEEDED → populated dashboard < 15 min on a
    sample repo.
- **M5-3 First-scan progress UX** `area:web` deps:M3-5,M4-2 — live multi-job progress; non-blocking;
  email on completion.
  - DoD: user can navigate away and get notified; progress accurate; errors surfaced clearly.

---

## M6 — Reporting & export  *(~6 ed)*
**Goal:** assessor-ready output.

- **M6-1 Assessor PDF + ZIP** `area:web` deps:M2-5 — cover sheet + per-requirement table + evidence
  appendix bundled from object storage.
  - DoD: generate a PDF for a populated project; ZIP contains referenced artifacts; matches CASA
    self-assessment structure.
- **M6-2 Shareable read-only report link** `area:web` deps:M6-1 — signed, expiring link; redacts
  secrets; viewer-safe.
  - DoD: link renders read-only report; expires; revocable; no mutation possible.
- **M6-3 Progress analytics** `area:web` deps:M3-5 — P0/P1 burn-down, evidence trend, scan history.
  - DoD: charts reflect real data; per-project + per-chapter views.

> **MVP complete after M6.** Deployable, multi-tenant, code+web scans, tracking, evidence,
> onboarding, reporting.

---

## M7 — DAST integration  *(~9 ed)*
**Goal:** orchestrated/imported dynamic scanning mapped to requirements.

- **M7-1 ZAP worker (baseline)** `area:analysis` deps:M3-1,M4-1 — isolated, egress-limited ZAP
  container; baseline/passive scan; scope-locked to attested hosts.
  - DoD: baseline scan of staging returns alerts; out-of-scope requests blocked; artifacts stored.
- **M7-2 Active scan opt-in + auth context** `area:sec` deps:M7-1 — explicit active-scan opt-in,
  rate/window, per-project DAST auth secret (login script/token).
  - DoD: active scan only runs with opt-in + authorization; authenticated scan reaches gated pages.
- **M7-3 ZAP/Burp import + mapping** `area:core` deps:M7-1 — parse ZAP/Burp reports; `zap.ts`
  alert→requirement + severity→priority map.
  - DoD: import a sample report → findings attach to requirements as evidence; mapping unit-tested.

---

## M8 — CASA spec sync subsystem  *(~10 ed)*
**Goal:** stay current with the ADA repo; safe per-org upgrades (Spec §13).

- **M8-1 SpecSource + scheduled fetch** `area:spec` deps:M2-2 — cron job fetches tracked ref;
  content-hash change detection; manual "Check now".
  - DoD: scheduled job records a check; detects a changed upstream (simulated) vs unchanged.
- **M8-2 Diff + draft SpecVersion + changelog** `area:spec` deps:M8-1,M2-1 — `diffSpec` →
  added/removed/modified/renumbered; create DRAFT + stored changelog.
  - DoD: feeding two spec versions yields a correct field-level diff + renumber detection; draft
    created.
- **M8-3 Maintainer review & publish** `area:web` deps:M8-2 — Super-Admin reviews diff; publish/
  reject; published versions become upgrade-eligible.
  - DoD: only Super-Admin can publish; publish flips status; audit entry; (self-host auto-publish
    flag honored).
- **M8-4 Per-org upgrade flow** `area:web` deps:M8-3,M2-3 — banner + migration preview (carried/
  new/removed/changed/renumbered) + manual mapping for ambiguous moves; transactional re-pin.
  - DoD: upgrading preserves human state on carried items; flags new(triage)/changed(re-review);
    archives removed; rollback snapshot retained; fully audited.

---

## M9 — Billing & plans  *(~6 ed)*
**Goal:** monetization with BYO-key-friendly metering.

- **M9-1 Stripe plans + checkout + portal** `area:billing` deps:M0-6 — Free/Team/Business; checkout;
  customer portal; webhook sync.
  - DoD: subscribe/upgrade/cancel reflected in org plan; webhook idempotent.
- **M9-2 Entitlements + metering + caps** `area:billing` deps:M9-1 — seat/project/active-DAST limits;
  LLM budget caps; soft warnings + hard stops.
  - DoD: exceeding a plan limit is enforced server-side; budget cap pauses scans gracefully.

---

## M10 — Self-host artifacts  *(~5 ed)*  *(parallel with M8–M9)*
**Goal:** one-command self-host.

- **M10-1 docker-compose** `area:infra` deps:M3-1 — web + worker + Postgres + Redis + MinIO;
  documented `.env.example` (Appendix G).
  - DoD: `docker compose up` yields a working single-org instance with a seeded SpecVersion.
- **M10-2 Railway template** `area:infra` deps:M10-1 — one-click deploy template (web+worker+db+
  bucket+cron) with the Dockerfile build.
  - DoD: template deploys end-to-end; first scan works; spec auto-publish flag documented.

---

## M11 — Hardening, observability, docs, launch  *(~10 ed)*
**Goal:** clear every [commercial-ready gate](./PRODUCT-SPEC.md#appendix-k--definition-of-commercial-ready-launch-gate).

- **M11-1 Observability** `area:ops` — OTEL traces, structured logs (scrubbed), Sentry, uptime +
  alerting; ops dashboard.
  - DoD: a scan is traceable end-to-end; alerts fire on error-rate/SLO breach; no PII/secrets in logs.
- **M11-2 Security pass** `area:sec` — self web-check + clean ZAP baseline against staging; pen-test
  fixes; rate limiting; CSP/HSTS/cookies verified.
  - DoD: app passes its own checks; tenancy-isolation suite green; threat-model doc reviewed.
- **M11-3 Backups/DR + runbooks** `area:ops` — automated backups + PITR; tested restore; incident
  runbooks.
  - DoD: a restore drill meets RPO/RTO; runbooks in `docs/`.
- **M11-4 Load test** `area:ops` deps:M3-5 — k6 scenarios; meet SLOs (Appendix J).
  - DoD: API p95 < 300 ms under target load; scan throughput SLO met; backpressure graceful.
- **M11-5 Docs site** `type:docs` — quickstart, self-host, security model, data-flow, API.
  - DoD: a new user/self-hoster can onboard from docs alone.
- **M11-6 Legal & licensing** `type:docs area:sec` — LICENSE, SECURITY.md, ToS, Privacy/DPA,
  in-product "not an authorized lab" disclaimer, spec attribution, non-infringing name.
  - DoD: all present; trademark check done; disclaimers shown where users could assume validation.
- **M11-7 Accessibility** `area:web` — WCAG 2.1 AA on primary flows.
  - DoD: axe checks pass on wizard/dashboard/admin; keyboard + screen-reader smoke pass.

---

## Suggested team & parallelization
- **Eng A (backend/security):** M0-3/4/5/7, M1-1/2/3, M2-1/2/3, M3-*, M7-*, M8-*, M11-2/3.
- **Eng B (frontend/product):** M0-6, M1-4, M2-4/5, M5-*, M6-*, M8-3/4 (UI), M9-*, M11-7.
- Shared: M4-*, M10-*, M11-1/4/5/6.

## Tracker import
Each `Mn-k` maps to one issue; milestone = `Mn`; copy DoD bullets into the issue body as a
checklist; set `priority` from the critical path. A CSV/JSON generator for bulk import can live in
`scripts/issues-export.ts` (derive from this file).
