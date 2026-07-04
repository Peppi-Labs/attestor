"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MfaSetup() {
  const router = useRouter();
  const [qr, setQr] = useState("");
  const [secret, setSecret] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/auth/mfa/enroll", { method: "POST" });
      if (res.ok) {
        const d = await res.json();
        setQr(d.qr);
        setSecret(d.secret);
      } else {
        setError("Could not start enrollment.");
      }
    })();
  }, []);

  const enable = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/auth/mfa/enable", {
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
      <form className="admin-card" onSubmit={enable} style={{ width: 400 }}>
        <div className="brand" style={{ marginBottom: 8 }}><span className="brand__mark">A</span> Attestor</div>
        <h1 style={{ fontSize: 20, margin: "0 0 4px" }}>Set up two-factor auth</h1>
        <p className="muted" style={{ fontSize: 14 }}>Scan the QR with your authenticator app, then enter a code to confirm.</p>
        {qr ? (
          <div style={{ textAlign: "center", margin: "16px 0" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qr} alt="TOTP QR code" width={180} height={180} style={{ borderRadius: 10, background: "#fff", padding: 8 }} />
            <p className="muted" style={{ fontSize: 12, marginTop: 8, wordBreak: "break-all" }}>
              Or enter manually: <code>{secret}</code>
            </p>
          </div>
        ) : (
          <p className="muted" style={{ margin: "20px 0" }}>Loading…</p>
        )}
        <label className="lbl">6-digit code</label>
        <input className="inp" inputMode="numeric" value={token} onChange={(e) => setToken(e.target.value)} placeholder="123456" required style={{ letterSpacing: 4, textAlign: "center" }} />
        {error && <p className="err">{error}</p>}
        <button className="btn-primary" type="submit" disabled={busy || !qr} style={{ width: "100%", marginTop: 14 }}>
          {busy ? "Enabling…" : "Enable 2FA"}
        </button>
      </form>
    </div>
  );
}
