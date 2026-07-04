"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function CreateProject() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setBusy(false);
    if (res.ok) {
      setName("");
      setOpen(false);
      router.refresh();
    }
  };

  if (!open) return <button className="btn-primary" onClick={() => setOpen(true)}>+ New project</button>;

  return (
    <form onSubmit={submit} style={{ display: "flex", gap: 8 }}>
      <input className="inp" placeholder="Project name" value={name} onChange={(e) => setName(e.target.value)} required autoFocus style={{ width: 200 }} />
      <button className="btn-primary" type="submit" disabled={busy || !name.trim()}>{busy ? "…" : "Create"}</button>
      <button className="btn-mini" type="button" onClick={() => setOpen(false)}>Cancel</button>
    </form>
  );
}
