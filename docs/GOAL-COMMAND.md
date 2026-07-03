# Attestor — Goal Command (kickoff)

This is the single source you hand to an autonomous coding agent (e.g. Claude Code) — or an
engineering team — to take the project from empty repo to a **commercially-ready, multi-tenant
SaaS**. It pairs a literal bootstrap command with a "Goal Command" directive that encodes the
objective, guardrails, and the acceptance gate.

It assumes [`PRODUCT-SPEC.md`](./PRODUCT-SPEC.md) and [`BUILD-PLAN.md`](./BUILD-PLAN.md) are
present in `docs/`.

---

## 0. One-time bootstrap (literal)

Scaffolds the monorepo skeleton from Appendix A so the agent starts from a known-good base:

```bash
# Requires: node >= 20, pnpm >= 9, git, docker
mkdir attestor && cd attestor && git init -b main
corepack enable && corepack prepare pnpm@latest --activate

# workspace
cat > pnpm-workspace.yaml <<'YAML'
packages: ["apps/*", "packages/*"]
YAML
pnpm init
pnpm add -Dw turbo typescript @types/node vitest eslint prettier
npx turbo@latest init -y 2>/dev/null || true

mkdir -p apps/web apps/worker \
  packages/{db,spec-parser,analysis,llm,crypto,github,auth,core,ui} \
  infra/{railway,migrations-rls} docs .github/workflows scripts

# bring the existing spec + assessment data forward as the first SpecVersion source-of-truth
mkdir -p packages/spec-parser/fixtures
# (copy data/casa_spec.md + data/requirements.json from the casa-tracker prototype here)

git add -A && git commit -m "chore: bootstrap attestor monorepo skeleton"
```

> Tip: also copy the prototype's `data/casa_spec.md`, `data/requirements.json`,
> `data/peppi_assessment.json`, and `data/evidence_checklist.json` into
> `packages/spec-parser/fixtures/` and `packages/analysis/fixtures/` — they become golden-test
> fixtures and seed data.

---

## 1. The Goal Command (hand this to the agent)

> Paste the block below as the agent's task. It is intentionally explicit about *what done means*
> so the agent self-verifies instead of stopping early.

```text
ROLE: You are the lead engineer building "Attestor", an open-source, multi-tenant SaaS that helps
teams complete a Google/App Defense Alliance CASA Tier 2 self-assessment. Build it to
COMMERCIAL-READY quality.

AUTHORITATIVE DOCS (read fully before coding, and re-read the relevant section before each task):
- docs/PRODUCT-SPEC.md   — what to build (architecture, features, data model, security).
- docs/BUILD-PLAN.md     — how to build it (milestones M0–M11, issues Mn-k, each with a DoD).

OBJECTIVE: Deliver every milestone M0→M11 in order, satisfying each issue's DoD and the global DoD.
"Done" for the whole project = ALL ten criteria in PRODUCT-SPEC.md Appendix K
("Definition of commercial-ready") pass. Do not declare completion until they do.

NON-NEGOTIABLE GUARDRAILS:
1. Security first — this is a security product. Enforce tenant isolation at BOTH the app layer and
   Postgres RLS; envelope-encrypt all secrets (LLM keys, GitHub tokens) and never log or return
   them; require MFA for admins; authorize() on every endpoint; record host-authorization before
   any web/DAST probe; the app must pass its own web checks + a clean ZAP baseline.
2. Stack is fixed by the spec: Next.js (App Router) + TS strict, Prisma + Postgres (+RLS),
   Graphile Worker (Postgres queue) unless told otherwise, Auth.js + TOTP, GitHub App (read-only),
   BYO-LLM provider abstraction (Anthropic default), OWASP ZAP for DAST, S3-compatible storage,
   Stripe billing. pnpm + Turborepo monorepo per Appendix A.
3. Multi-tenant from day one: no endpoint trusts a client-supplied orgId; every tenant row carries
   orgId and is covered by an RLS policy; add a tenancy-isolation test for every new resource.
4. CASA spec is sourced live from github.com/appdefensealliance/ASA-WG. The spec-parser is a
   hardened, golden-tested package (descendant of the prototype's data/parse.mjs). Spec updates
   flow through draft→maintainer-review→publish, then per-org upgrade that preserves human state.
5. Test as you go: unit + integration + e2e + tenancy-isolation + golden parser tests. Meet the
   coverage gates (≥80% on spec-parser, analysis, crypto, auth). CI (typecheck, lint, test, build,
   CodeQL, dep-audit, gitleaks, license) must be green before a milestone is "done".
6. Suggestions from the LLM are advisory and human-confirmed; show confidence; link evidence to
   file:line / URL / rule-id; never overwrite human-entered status/notes on re-scan or spec upgrade.

EXECUTION PROTOCOL (repeat per milestone Mn):
  a. Re-read the milestone's issues + DoD in BUILD-PLAN.md and the referenced spec sections.
  b. Implement issue-by-issue. For each issue: write code + tests, run `pnpm typecheck lint test`,
     and verify each DoD bullet explicitly.
  c. Run the full CI task locally; fix until green.
  d. Open a PR titled "Mn: <milestone goal>" summarizing what was built and how each DoD was met.
     Include the test evidence. Do NOT advance to M(n+1) until Mn's DoD + CI are green.
  e. After M6, the product is a usable MVP — deploy it to a staging environment and smoke-test the
     onboarding→scan→report flow before continuing.

DELIVERABLES at completion:
- A running multi-tenant app (web + worker + Postgres + Redis/queue + storage), deployable to
  Railway (SaaS) and via docker-compose (self-host).
- Onboarding wizard; code+web+DAST analysis; requirement tracking + evidence; CASA spec sync +
  upgrade; reporting/PDF export; org/user admin + audit log; Stripe billing.
- Docs (quickstart, self-host, security model, API), LICENSE, SECURITY.md, ToS, Privacy/DPA, and
  the in-product "not an authorized lab" disclaimer.
- All commercial-ready gates (Appendix K) demonstrably passing, with evidence in the final PR.

CONSTRAINTS: Make minimal, reviewable commits. Prefer boring, well-supported libraries. If a spec
decision is ambiguous (see PRODUCT-SPEC.md §26 Open decisions), pick the spec's recommended option,
note it in the PR, and proceed — do not block. Never weaken a security guardrail to make a test
pass.
```

---

## 2. How to run it

Three ways, pick by how autonomous you want it:

- **Single-agent, milestone-by-milestone (recommended first):** give the agent the Goal Command,
  then drive one milestone per session: *"Implement M0 from docs/BUILD-PLAN.md to its DoD, open the
  PR, stop."* Review the PR, then *"Proceed to M1."* Highest control, easy to course-correct.
- **Per-milestone kickoff prompts:** use the snippets in §3 to delegate individual milestones (e.g.
  to parallel agents for independent tracks like M3 vs M4, M8 vs M9/M10).
- **Fleet / workflow:** orchestrate milestones as a dependency graph (critical path in
  BUILD-PLAN.md) with parallel agents on independent milestones and a verify stage that runs CI +
  the tenancy + Appendix-K gates before merging each milestone.

---

## 3. Per-milestone kickoff prompts (copy-paste)

```text
M0  Build M0 (Foundations) from docs/BUILD-PLAN.md. Deliver the monorepo, CI, Postgres+Prisma+RLS,
    Auth.js+MFA, RBAC, org/project CRUD, app shell, audit log. Prove RLS with a tenancy-isolation
    test. Open PR "M0: Foundations". Stop at the milestone DoD.

M1  Build M1 (Integrations & secrets): envelope-encryption package, GitHub App (read-only,
    tarball@SHA), LLM provider abstraction (Anthropic default), secret management UI/API
    (write-only, last4). Tests + DoD. PR "M1". Depends on M0.

M2  Build M2 (Spec parser & tracking): hardened golden-tested spec-parser, SpecVersion model+seed
    (bundle latest published), RequirementState/Evidence/Comment models (tenant-scoped+RLS), port
    the tracker UI + evidence checklist. PR "M2". Depends on M1.

M3  Build M3 (Code-scan engine): queue+worker harness, repo snapshot+framework detect, retrieval
    (heuristics+embeddings), per-requirement structured judgment (cached by SHA), scan
    orchestration + UI with accept-suggestion + re-scan diff. PR "M3". Depends on M2.

M4  Build M4 (Web checks) — parallelizable with M3: host-authorization gate, web-checks worker
    (TLS/headers/cookies/debug/exposed-files), mapping table + auto-evidence. PR "M4". Depends on M0/M3-1.

M5  Build M5 (Onboarding wizard): resumable state machine + steps UI (org→GitHub→host+auth→LLM
    key→scope→first scan→invite) + non-blocking progress UX. Full e2e < 15 min to first scan.
    PR "M5". Depends on M1,M3,M4.

M6  Build M6 (Reporting): assessor PDF+ZIP, shareable read-only link, progress analytics. PR "M6".
    Depends on M2/M3. (MVP complete after M6 — deploy to staging + smoke test.)

M7  Build M7 (DAST): isolated ZAP baseline worker (scope-locked), active-scan opt-in + auth
    context, ZAP/Burp import + mapping. PR "M7". Depends on M3-1,M4-1.

M8  Build M8 (CASA spec sync): scheduled fetch+hash-detect, diff+draft+changelog,
    maintainer review/publish, per-org upgrade flow preserving human state. PR "M8". Depends on M2.

M9  Build M9 (Billing): Stripe plans+checkout+portal+webhooks, entitlements+metering+caps. PR "M9".

M10 Build M10 (Self-host) — parallel with M8/M9: docker-compose (web+worker+pg+redis+minio) and a
    Railway one-click template. PR "M10".

M11 Build M11 (Launch hardening): observability, security pass (self web-check + clean ZAP),
    backups/DR + runbooks, k6 load test to SLOs, docs site, legal/licensing, accessibility (WCAG
    AA). Verify ALL Appendix-K gates. PR "M11: commercial-ready". Depends on all.
```

---

## 4. Acceptance — "is it commercial-ready?"

Completion is **not** "the code runs." It is the ten gates in
[PRODUCT-SPEC.md Appendix K](./PRODUCT-SPEC.md#appendix-k--definition-of-commercial-ready-launch-gate).
Verify with:

```bash
pnpm turbo run typecheck lint test build        # all green
pnpm test:tenancy                               # cross-org isolation suite passes
pnpm test:e2e                                   # onboarding→scan→report→spec-upgrade
pnpm test:golden                                # spec-parser matches known upstream versions
pnpm audit && pnpm dlx gitleaks detect          # supply chain + secrets clean
# + external: clean ZAP baseline against staging; k6 load test meets SLOs; restore drill
```

Ship only when every item in Appendix K passes and the M11 PR documents the evidence.

---

## 5. Notes for the operator

- **Start small:** run M0–M2 with a single agent under close review to validate the stack and the
  RLS/secrets foundations before parallelizing.
- **Keep the spec the source of truth:** when reality diverges, update `PRODUCT-SPEC.md` /
  `BUILD-PLAN.md` first, then code — so the Goal Command stays accurate for later milestones.
- **Resolve the §26 open decisions early** (queue, license, naming) — they ripple through M3, M10,
  and M11.
