"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setBusy(false);
    if (res.ok) {
      const d = await res.json();
      router.push(d.mfaRequired ? "/mfa" : "/app");
      router.refresh();
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="admin-auth">
      <form className="admin-card" onSubmit={submit} style={{ width: 380 }}>
        <div className="brand" style={{ marginBottom: 12 }}><span className="brand__mark">A</span> Attestor</div>
        <h1 style={{ fontSize: 22, margin: "0 0 12px" }}>Sign in</h1>
        <label className="lbl">Email</label>
        <input className="inp" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
        <label className="lbl">Password</label>
        <input className="inp" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="err">{error}</p>}
        <button className="btn-primary" type="submit" disabled={busy} style={{ width: "100%", marginTop: 14 }}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
        <p className="muted" style={{ fontSize: 13, marginTop: 14, textAlign: "center" }}>
          New here? <Link href="/signup">Create a workspace</Link>
        </p>
      </form>
    </div>
  );
}
