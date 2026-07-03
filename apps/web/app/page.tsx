export default function Home() {
  return (
    <main className="wrap">
      <span className="badge">Attestor · pre-alpha (M0)</span>
      <h1>Prepare for CASA Tier 2 — without the scramble.</h1>
      <p className="sub">
        Connect your GitHub repo and website, bring your own LLM key, and get an
        automated, evidence-backed pre-assessment against the App Defense Alliance
        CASA requirements. Not an authorized lab — we get you ready for one.
      </p>

      <div className="card">
        <h3>1 · Connect</h3>
        <p>Install the read-only GitHub App and add your production URL.</p>
      </div>
      <div className="card">
        <h3>2 · Scan</h3>
        <p>Static code analysis + website checks + DAST, mapped to every requirement.</p>
      </div>
      <div className="card">
        <h3>3 · Close the gaps</h3>
        <p>Track status, collect evidence, and export a package your assessor accepts.</p>
      </div>

      <p className="sub" style={{ marginTop: 32 }}>
        Building in the open ·{" "}
        <a href="https://github.com/Peppi-Labs/attestor">Peppi-Labs/attestor</a>
      </p>
    </main>
  );
}
