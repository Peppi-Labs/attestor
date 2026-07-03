import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { prisma, withOrg } from "../src/index.js";

/**
 * Proves tenant isolation is enforced by Postgres Row-Level Security — not just by
 * application-layer filters. The runtime client connects as a non-superuser role
 * (APP_DATABASE_URL), so these guarantees are real.
 */
describe("RLS tenant isolation", () => {
  const orgA = randomUUID();
  const orgB = randomUUID();
  let bProjectId = "";

  beforeAll(async () => {
    // Each org is bootstrapped inside its own context so the Org WITH CHECK passes.
    await withOrg(orgA, (tx) => tx.org.create({ data: { id: orgA, name: "Org A" } }));
    await withOrg(orgB, (tx) => tx.org.create({ data: { id: orgB, name: "Org B" } }));
    await withOrg(orgA, (tx) => tx.project.create({ data: { orgId: orgA, name: "A-proj" } }));
    const bp = await withOrg(orgB, (tx) => tx.project.create({ data: { orgId: orgB, name: "B-proj" } }));
    bProjectId = bp.id;
  });

  afterAll(async () => {
    await withOrg(orgA, (tx) => tx.project.deleteMany({}));
    await withOrg(orgB, (tx) => tx.project.deleteMany({}));
    await withOrg(orgA, (tx) => tx.org.deleteMany({ where: { id: orgA } }));
    await withOrg(orgB, (tx) => tx.org.deleteMany({ where: { id: orgB } }));
    await prisma.$disconnect();
  });

  it("an org sees only its own projects", async () => {
    const projects = await withOrg(orgA, (tx) => tx.project.findMany());
    expect(projects).toHaveLength(1);
    expect(projects[0]?.name).toBe("A-proj");
  });

  it("cannot read another org's row even by its exact id", async () => {
    const leaked = await withOrg(orgA, (tx) =>
      tx.project.findUnique({ where: { id: bProjectId } }),
    );
    expect(leaked).toBeNull();
  });

  it("without an org context, zero tenant rows are visible (default-deny)", async () => {
    const all = await prisma.project.findMany();
    expect(all).toHaveLength(0);
  });

  it("cannot write a row into another org (WITH CHECK)", async () => {
    await expect(
      withOrg(orgA, (tx) => tx.project.create({ data: { orgId: orgB, name: "smuggled" } })),
    ).rejects.toThrow();
  });
});
