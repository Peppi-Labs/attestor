import Link from "next/link";
import { redirect } from "next/navigation";
import { withOrg } from "@attestor/db";
import { can } from "@attestor/core";
import { getCurrentOrg, listUserOrgs, requireUser } from "@/lib/auth";
import { CreateProject } from "./CreateProject";
import { OrgSwitcher } from "./OrgSwitcher";
import { AppLogout } from "./AppLogout";

export const dynamic = "force-dynamic";

export default async function AppHome() {
  const user = await requireUser();
  if (!user) redirect("/login");

  const ctx = await getCurrentOrg(user.id);
  if (!ctx) redirect("/login");
  const orgs = await listUserOrgs(user.id);
  const projects = await withOrg(ctx.org.id, (tx) =>
    tx.project.findMany({ orderBy: { createdAt: "desc" } }),
  );

  return (
    <div className="admin-shell">
      <header className="admin-top">
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div className="brand"><span className="brand__mark">A</span> Attestor</div>
          <OrgSwitcher orgs={orgs.map((m) => ({ id: m.orgId, name: m.org.name, role: m.role }))} currentId={ctx.org.id} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span className="muted" style={{ fontSize: 13 }}>{user.name} · {ctx.role}</span>
          <AppLogout />
        </div>
      </header>

      <main className="admin-main">
        {!user.mfaEnabled && (
          <div className="mfa-banner">
            <span>🔐 Protect your account — two-factor authentication isn&apos;t enabled yet.</span>
            <Link className="btn-mini" href="/app/mfa-setup">Set up 2FA</Link>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 className="admin-h2" style={{ margin: 0 }}>Projects</h2>
          {can(ctx.role, "project:create") && <CreateProject />}
        </div>

        {projects.length === 0 ? (
          <p className="muted">No projects yet. Create one to start a CASA assessment.</p>
        ) : (
          <div className="proj-grid">
            {projects.map((p) => (
              <div className="proj-card" key={p.id}>
                <h3>{p.name}</h3>
                <p className="muted">
                  {p.repoFullName ?? "No repo connected"} · created {new Date(p.createdAt).toLocaleDateString()}
                </p>
                <span className="proj-step">Onboarding step {p.onboardingStep + 1} of 6</span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
