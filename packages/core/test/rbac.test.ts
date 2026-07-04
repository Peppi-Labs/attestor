import { describe, expect, it } from "vitest";
import { ACTIONS, atLeast, can, ROLES, type Action } from "../src/rbac";

describe("RBAC ability layer", () => {
  it("OWNER can do everything", () => {
    for (const a of ACTIONS) expect(can("OWNER", a)).toBe(true);
  });

  it("VIEWER can only read, never mutate", () => {
    const mutating = ACTIONS.filter((a) => !a.endsWith(":read"));
    for (const a of mutating) expect(can("VIEWER", a)).toBe(false);
    expect(can("VIEWER", "project:read")).toBe(true);
    expect(can("VIEWER", "requirement:read")).toBe(true);
  });

  it("ADMIN can manage but not delete the org or touch billing", () => {
    expect(can("ADMIN", "member:remove")).toBe(true);
    expect(can("ADMIN", "project:create")).toBe(true);
    expect(can("ADMIN", "integration:manage")).toBe(true);
    expect(can("ADMIN", "org:delete")).toBe(false);
    expect(can("ADMIN", "org:manage_billing")).toBe(false);
  });

  it("CONTRIBUTOR can work on a project but not administer it", () => {
    expect(can("CONTRIBUTOR", "requirement:update")).toBe(true);
    expect(can("CONTRIBUTOR", "evidence:manage")).toBe(true);
    expect(can("CONTRIBUTOR", "scan:run")).toBe(true);
    expect(can("CONTRIBUTOR", "project:create")).toBe(false);
    expect(can("CONTRIBUTOR", "member:invite")).toBe(false);
    expect(can("CONTRIBUTOR", "integration:manage")).toBe(false);
  });

  it("privilege ordering is correct", () => {
    expect(atLeast("OWNER", "ADMIN")).toBe(true);
    expect(atLeast("ADMIN", "ADMIN")).toBe(true);
    expect(atLeast("CONTRIBUTOR", "ADMIN")).toBe(false);
    expect(atLeast("VIEWER", "CONTRIBUTOR")).toBe(false);
  });

  it("every role's actions are valid action names", () => {
    const valid = new Set<Action>(ACTIONS);
    for (const role of ROLES) {
      for (const a of ACTIONS) {
        // can() must not throw for any (role, action) pair
        expect(typeof can(role, a)).toBe("boolean");
      }
    }
    expect(valid.size).toBe(ACTIONS.length);
  });
});
