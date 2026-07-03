import Link from "next/link";
import { site } from "@/lib/site";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="hero container">
        <span className="eyebrow">Open-source · Bring your own LLM key</span>
        <h1>
          CASA Tier 2, <span className="gradient-text">without the scramble.</span>
        </h1>
        <p className="lead">
          Got the &quot;complete a CASA Tier 2 assessment&quot; email from Google? Connect your
          GitHub repo and website, and {site.product.name} runs an automated, evidence-backed
          pre-assessment against every App Defense Alliance requirement — so you walk into the
          lab already done.
        </p>
        <div className="hero__cta">
          <a className="btn btn--primary btn--lg" href={site.product.appUrl}>
            Start your assessment
          </a>
          <Link className="btn btn--ghost btn--lg" href="/#how">
            See how it works
          </Link>
        </div>
        <p className="hero__note">
          No credit card to start · Self-host or cloud · You keep your code and your keys
        </p>

        <div className="trust">
          <span><i className="dot" /> Static code analysis</span>
          <span><i className="dot" /> Website checks</span>
          <span><i className="dot" /> DAST (OWASP ZAP)</span>
          <span><i className="dot" /> Evidence packaging</span>
          <span><i className="dot" /> Always-current requirements</span>
        </div>
      </section>

      {/* Requirement preview */}
      <section className="section--tight container">
        <div className="panel" style={{ maxWidth: 760, margin: "0 auto" }}>
          <div className="panel__bar"><i /><i /><i /></div>
          <div className="panel__body">
            {[
              { id: "1.3.3", d: "Out-of-band verifiers are random", tag: "P0", cls: "pill--p0" },
              { id: "2.3.1", d: "Session cookies are secure", tag: "Met", cls: "pill--met" },
              { id: "3.3.1", d: "Admin interfaces use MFA", tag: "Gap", cls: "pill--gap" },
              { id: "4.1.1", d: "Data protected in transit (TLS)", tag: "Met", cls: "pill--met" },
              { id: "5.2.1", d: "Untrusted files handled safely", tag: "Review", cls: "pill--review" },
            ].map((r) => (
              <div className="req-row" key={r.id}>
                <span className="req-id">{r.id}</span>
                <span className="req-desc">{r.d}</span>
                <span className={`pill ${r.cls}`}>{r.tag}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="center muted" style={{ marginTop: 16, fontSize: 14 }}>
          Every requirement — pre-assessed, evidence-linked, and assignable to your team.
        </p>
      </section>

      {/* Product / features */}
      <section id="product" className="section">
        <div className="container">
          <div className="sec-head">
            <span className="eyebrow">Why {site.product.name}</span>
            <h2>Everything the six-week scramble should have been.</h2>
            <p>From a cold requirements list to an audit-ready evidence package — in one place.</p>
          </div>
          <div className="grid grid-3">
            {[
              { icon: "🔎", h: "Automated pre-assessment", p: "Connect a repo and site; get a first-pass status, finding, and evidence for all 55 requirements in minutes — a starting point your team verifies." },
              { icon: "🧭", h: "Remediation you can action", p: "Every gap comes with a concrete fix, a priority (P0–P3), and an effort estimate — pointed at the exact files and configs." },
              { icon: "📦", h: "Evidence collection", p: "A trackable checklist of the exact artifacts an assessor expects, with a one-click export package to hand to the lab." },
              { icon: "🔑", h: "Bring your own LLM key", p: "Your code is analyzed with your provider and your key (Anthropic, OpenAI, or compatible). We never train on your data." },
              { icon: "🔁", h: "Always current", p: "Requirements sync live from the App Defense Alliance repo, with safe, reviewed upgrades — never silently out of date." },
              { icon: "👥", h: "Built for teams", p: "Assign owners, comment, track progress, and manage users with role-based access and a full audit log." },
            ].map((f) => (
              <div className="card" key={f.h}>
                <div className="card__icon">{f.icon}</div>
                <h3>{f.h}</h3>
                <p>{f.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="section" style={{ background: "var(--bg-2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="container">
          <div className="sec-head">
            <span className="eyebrow">How it works</span>
            <h2>Connected to done in four steps.</h2>
          </div>
          <div className="steps">
            {[
              { h: "Connect", p: "Install the read-only GitHub App and add your production URL — with an authorization attestation." },
              { h: "Add your key", p: "Drop in your LLM key (stored encrypted, write-only) and choose your scan scope." },
              { h: "Scan", p: "Static code + website checks + DAST run against every requirement and populate suggestions with evidence." },
              { h: "Close & export", p: "Verify status, collect evidence, and export the package your authorized lab accepts." },
            ].map((s, i) => (
              <div className="step" key={s.h}>
                <div className="step__num">{i + 1}</div>
                <h3>{s.h}</h3>
                <p>{s.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scan modes */}
      <section className="section">
        <div className="container split">
          <div>
            <span className="eyebrow">Three ways we look</span>
            <h2 style={{ fontSize: 34, fontWeight: 800, marginTop: 14 }}>
              Code, runtime, and dynamic — mapped to every requirement.
            </h2>
            <p className="muted" style={{ marginTop: 14 }}>
              Real assessments look at more than source. {site.product.name} combines three
              analysis modes and maps each finding straight to the CASA requirement it satisfies
              (or breaks).
            </p>
            <ul className="checklist">
              <li><span className="tick">✓</span><span><strong>Static code analysis.</strong> Retrieval-guided, per-requirement judgment with file-level evidence — using your LLM key.</span></li>
              <li><span className="tick">✓</span><span><strong>Website checks.</strong> TLS, security headers, cookie flags, debug leakage, and exposed files — captured as evidence automatically.</span></li>
              <li><span className="tick">✓</span><span><strong>DAST.</strong> Orchestrated OWASP ZAP (or import your existing ZAP/Burp report), scope-locked and authorized.</span></li>
            </ul>
          </div>
          <div className="panel">
            <div className="panel__bar"><i /><i /><i /></div>
            <div className="panel__body" style={{ padding: 20 }}>
              {[
                { m: "Code", d: "app/Http/Middleware/Auth.php:42", t: "Met", cls: "pill--met" },
                { m: "Web", d: "Set-Cookie: Secure; HttpOnly; SameSite", t: "Met", cls: "pill--met" },
                { m: "Web", d: "Missing Strict-Transport-Security", t: "Gap", cls: "pill--gap" },
                { m: "DAST", d: "ZAP 40012 · Reflected XSS", t: "P0", cls: "pill--p0" },
              ].map((r, i) => (
                <div className="req-row" key={i} style={{ gridTemplateColumns: "56px 1fr auto" }}>
                  <span className="req-id">{r.m}</span>
                  <span className="req-desc" style={{ fontFamily: "ui-monospace, monospace", fontSize: 12 }}>{r.d}</span>
                  <span className={`pill ${r.cls}`}>{r.t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section container">
        <div className="cta-band">
          <h2>Start your CASA Tier 2 pre-assessment today.</h2>
          <p>
            Free to start. Self-host it or run it in the cloud. Your code and your keys stay yours.
          </p>
          <div className="hero__cta" style={{ marginTop: 26 }}>
            <a className="btn btn--primary btn--lg" href={site.product.appUrl}>Start free</a>
            <Link className="btn btn--ghost btn--lg" href="/pricing">View pricing</Link>
          </div>
        </div>
      </section>
    </>
  );
}
