"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    setBusy(false);
    if (res.ok) {
      router.push("/app");
      router.refresh();
    } else {
      const d = await res.json().catch(() => ({}));
      setError(d.error === "email_taken" ? "That email is already registered." : d.error ?? "Something went wrong.");
    }
  };

  return (
    <div className="admin-auth">
      <form className="admin-card" onSubmit={submit} style={{ width: 380 }}>
        <div className="brand" style={{ marginBottom: 6 }}><span className="brand__mark">A</span> Attestor</div>
        <h1 style={{ fontSize: 22, margin: "8px 0 2px" }}>Create your workspace</h1>
        <p className="muted" style={{ fontSize: 14, marginBottom: 8 }}>Start your CASA pre-assessment in minutes.</p>
        <label className="lbl">Name</label>
        <input className="inp" value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
        <label className="lbl">Work email</label>
        <input className="inp" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label className="lbl">Password (min 10 characters)</label>
        <input className="inp" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={10} />
        {error && <p className="err">{error}</p>}
        <button className="btn-primary" type="submit" disabled={busy} style={{ width: "100%", marginTop: 14 }}>
          {busy ? "Creating…" : "Create account"}
        </button>
        <p className="muted" style={{ fontSize: 13, marginTop: 14, textAlign: "center" }}>
          Already have an account? <Link href="/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
