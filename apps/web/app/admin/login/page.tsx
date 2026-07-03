"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setBusy(false);
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="admin-auth">
      <form className="admin-card" onSubmit={submit} style={{ width: 360 }}>
        <div className="brand" style={{ marginBottom: 18 }}>
          <span className="brand__mark">A</span> Attestor Admin
        </div>
        <label className="lbl">Email</label>
        <input className="inp" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
        <label className="lbl">Password</label>
        <input className="inp" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="err">{error}</p>}
        <button className="btn-primary" type="submit" disabled={busy} style={{ width: "100%", marginTop: 12 }}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
