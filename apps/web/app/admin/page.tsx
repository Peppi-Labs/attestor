import { redirect } from "next/navigation";
import { prisma } from "@attestor/db";
import { getSessionAdmin } from "@/lib/adminAuth";
import { ContactActions } from "./ContactActions";
import { AddAdminForm } from "./AddAdminForm";
import { LogoutButton } from "./LogoutButton";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const admin = await getSessionAdmin();
  if (!admin) redirect("/admin/login");

  const [contacts, admins, counts] = await Promise.all([
    prisma.contactSubmission.findMany({ orderBy: { createdAt: "desc" }, take: 200 }),
    prisma.adminUser.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.contactSubmission.groupBy({ by: ["status"], _count: true }),
  ]);
  const byStatus = Object.fromEntries(counts.map((c) => [c.status, c._count]));

  return (
    <div className="admin-shell">
      <header className="admin-top">
        <div className="brand"><span className="brand__mark">A</span> Attestor Admin</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span className="muted" style={{ fontSize: 13 }}>{admin.name} · {admin.email}</span>
          <LogoutButton />
        </div>
      </header>

      <main className="admin-main">
        <div className="admin-stats">
          <div className="stat"><b>{byStatus.NEW ?? 0}</b><span>New</span></div>
          <div className="stat"><b>{byStatus.READ ?? 0}</b><span>Read</span></div>
          <div className="stat"><b>{byStatus.ARCHIVED ?? 0}</b><span>Archived</span></div>
        </div>

        <h2 className="admin-h2">Contact submissions</h2>
        {contacts.length === 0 && <p className="muted">No submissions yet.</p>}
        {contacts.length > 0 && (
          <table className="admin-table">
            <thead>
              <tr>
                <th>When</th><th>From</th><th>Message</th><th>Status</th><th></th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c) => (
                <tr key={c.id} className={c.status === "ARCHIVED" ? "dim" : ""}>
                  <td className="nowrap">{new Date(c.createdAt).toLocaleString()}</td>
                  <td>
                    <div><strong>{c.name}</strong></div>
                    <a href={`mailto:${c.email}`} className="link">{c.email}</a>
                  </td>
                  <td className="msg">{c.message}</td>
                  <td><span className={`sbadge s-${c.status.toLowerCase()}`}>{c.status}</span></td>
                  <td><ContactActions id={c.id} status={c.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <h2 className="admin-h2" style={{ marginTop: 40 }}>Admin users</h2>
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Email</th><th>Last login</th></tr></thead>
          <tbody>
            {admins.map((a) => (
              <tr key={a.id}>
                <td>{a.name}{a.id === admin.id && <span className="muted"> (you)</span>}</td>
                <td>{a.email}</td>
                <td className="nowrap">{a.lastLoginAt ? new Date(a.lastLoginAt).toLocaleString() : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <AddAdminForm />
      </main>
    </div>
  );
}
