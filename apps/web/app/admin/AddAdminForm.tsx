"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AddAdminForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    const res = await fetch("/api/admin/admins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    setBusy(false);
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setName(""); setEmail(""); setPassword(""); setOpen(false);
      router.refresh();
    } else {
      setMsg(data.error ?? "Could not add admin.");
    }
  };

  if (!open) {
    return (
      <button className="btn-mini" onClick={() => setOpen(true)}>
        + Add admin
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="admin-card" style={{ marginTop: 12, maxWidth: 420 }}>
      <label className="lbl">Name</label>
      <input className="inp" value={name} onChange={(e) => setName(e.target.value)} required />
      <label className="lbl">Email</label>
      <input className="inp" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <label className="lbl">Temporary password (min 10 chars)</label>
      <input className="inp" type="text" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={10} />
      {msg && <p className="err">{msg}</p>}
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <button className="btn-primary" type="submit" disabled={busy}>{busy ? "Adding…" : "Add admin"}</button>
        <button className="btn-mini" type="button" onClick={() => setOpen(false)}>Cancel</button>
      </div>
    </form>
  );
}
