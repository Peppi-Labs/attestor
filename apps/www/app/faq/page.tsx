import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "FAQ" };

const faqs = [
  {
    q: "Is Attestor an authorized CASA lab?",
    a: "No. Attestor prepares you for a CASA Tier 2 assessment and does not issue letters of validation. Final Tier 2 validation is performed by an App Defense Alliance authorized lab via a DAST scan. Attestor gets your assessment and evidence in order so that process is fast and cheap.",
  },
  {
    q: "What is CASA Tier 2, and why did I get an email about it?",
    a: "CASA (Cloud Application Security Assessment) is the security review the App Defense Alliance runs for apps that request sensitive Google API/OAuth scopes. If your app uses restricted scopes, Google requires a Tier 2 assessment — based on the OWASP ASVS — completed by a set deadline, renewed annually.",
  },
  {
    q: "Do you store or train on my source code?",
    a: "No. We fetch a read-only snapshot of your repo at a specific commit to run a scan, and we do not persist the code afterward — only the derived findings and the commit hash. Analysis runs against your own LLM provider using your key; we never train on your data.",
  },
  {
    q: "How does 'bring your own LLM key' work?",
    a: "You add your Anthropic, OpenAI, or OpenAI-compatible key. It is encrypted at rest, write-only (we show only the last four characters), and decrypted only in the worker running your scan. Because you supply the key, your analysis cost is your provider's cost, and your data goes to your provider.",
  },
  {
    q: "What access do you need to my GitHub?",
    a: "A read-only GitHub App with the minimum permissions (contents and metadata, read-only), installed only on the repos you choose. Tokens are short-lived and minted on demand; you can revoke access at any time by uninstalling the app.",
  },
  {
    q: "Will you scan my live website?",
    a: "Only hosts you explicitly authorize. Passive website checks and DAST are gated behind an authorization attestation and locked to the hosts you confirm you own. Active DAST scanning is opt-in with a configured rate and window.",
  },
  {
    q: "How do the requirements stay up to date?",
    a: "Requirements are sourced from the App Defense Alliance ASA-WG repository. A sync job tracks changes; new versions are reviewed and published, then offered to you as a controlled upgrade that preserves your existing status, notes, and evidence.",
  },
  {
    q: "Can I self-host?",
    a: "Yes. Attestor is open source. Run it with Docker Compose or a one-click template and manage your own users and data. The cloud version adds hosted DAST, billing, and managed operations.",
  },
];

export default function FAQ() {
  return (
    <section className="section container">
      <div className="sec-head">
        <span className="eyebrow">FAQ</span>
        <h2>Questions, answered.</h2>
        <p>
          Still stuck? Email{" "}
          <a href={`mailto:${site.contact.support}`}>{site.contact.support}</a>.
        </p>
      </div>
      <div className="faq">
        {faqs.map((f) => (
          <details className="qa" key={f.q}>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
