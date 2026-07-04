"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MfaChallenge() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/auth/mfa/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    setBusy(false);
    if (res.ok) {
      router.push("/app");
      router.refresh();
    } else {
      setError("That code isn't valid. Try again.");
    }
  };

  return (
    <div className="admin-auth">
      <form className="admin-card" onSubmit={submit} style={{ width: 360 }}>
        <div className="brand" style={{ marginBottom: 12 }}><span className="brand__mark">A</span> Attestor</div>
        <h1 style={{ fontSize: 20, margin: "0 0 4px" }}>Two-factor authentication</h1>
        <p className="muted" style={{ fontSize: 14, marginBottom: 8 }}>Enter the 6-digit code from your authenticator app.</p>
        <input
          className="inp"
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="123456"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
          autoFocus
          style={{ letterSpacing: 4, fontSize: 18, textAlign: "center" }}
        />
        {error && <p className="err">{error}</p>}
        <button className="btn-primary" type="submit" disabled={busy} style={{ width: "100%", marginTop: 14 }}>
          {busy ? "Verifying…" : "Verify"}
        </button>
      </form>
    </div>
  );
}
