import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Security" };

const pillars = [
  { icon: "🏢", h: "Tenant isolation", p: "Every customer's data is isolated at both the application layer and the database layer with Postgres Row-Level Security. A missing or incorrect tenant context returns nothing — never another org's data." },
  { icon: "🔐", h: "Encrypted secrets", p: "LLM keys and integration tokens are envelope-encrypted at rest, write-only in our API (we show only the last four characters), and decrypted only in-memory, in the worker running your scan." },
  { icon: "👁️", h: "Least-privilege access", p: "GitHub access is a read-only app scoped to the repos you pick, with short-lived tokens. Your source code is never persisted after a scan — only findings and the commit hash." },
  { icon: "✅", h: "Authorized scanning only", p: "Website and DAST scanning is gated behind an authorization attestation and locked to hosts you confirm you own. Active scans are opt-in, rate-limited, and scope-locked." },
  { icon: "🔑", h: "Hardened accounts", p: "MFA is required for administrators, sessions are hardened, every endpoint is authorized by role, and sensitive actions are recorded in an immutable audit log." },
  { icon: "🔁", h: "Secure supply chain", p: "Pinned dependencies, automated dependency and secret scanning, SAST in CI, and signed releases. We hold ourselves to the same requirements we check for you." },
];

export default function Security() {
  return (
    <>
      <section className="section container">
        <div className="sec-head">
          <span className="eyebrow">Security &amp; trust</span>
          <h2>A security product has to be exemplary.</h2>
          <p>
            {site.product.name} handles source-code access, scan authority, and LLM keys. We
            engineer it to pass the same bar we help you meet.
          </p>
        </div>
        <div className="grid grid-3">
          {pillars.map((p) => (
            <div className="card" key={p.h}>
              <div className="card__icon">{p.icon}</div>
              <h3>{p.h}</h3>
              <p>{p.p}</p>
            </div>
          ))}
        </div>

        <div className="callout" style={{ maxWidth: 760, margin: "40px auto 0" }}>
          <p>
            <strong>Report a vulnerability.</strong> We welcome responsible disclosure. Email{" "}
            <a href={`mailto:${site.contact.security}`}>{site.contact.security}</a> and we&apos;ll
            respond promptly. Please do not test against other customers&apos; data or the
            production environment without prior coordination.
          </p>
        </div>
        <p className="center muted" style={{ marginTop: 20, fontSize: 14 }}>
          Full data-handling detail is in our{" "}
          <a href="/legal/privacy">Privacy Policy</a>. This describes our target security posture;
          the platform is in active development.
        </p>
      </section>
    </>
  );
}
