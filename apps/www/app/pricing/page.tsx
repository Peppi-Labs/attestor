import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Pricing" };

const plans = [
  {
    name: "Open Source",
    price: "$0",
    unit: "self-hosted",
    desc: "Run the whole platform yourself. Yours forever.",
    cta: "Get the code",
    href: site.product.repoUrl,
    featured: false,
    features: [
      "Unlimited users",
      "1 project",
      "Static code + website checks",
      "Import your own DAST report",
      "Bring your own LLM key",
      "Community support",
    ],
  },
  {
    name: "Team",
    price: "$—",
    unit: "/ month",
    desc: "For a team driving one or more apps through CASA.",
    cta: "Start free trial",
    href: site.product.appUrl,
    featured: true,
    features: [
      "Up to 10 users",
      "3 projects",
      "Code + website + hosted baseline DAST",
      "Evidence package export (PDF)",
      "Always-current requirement sync",
      "Email support",
    ],
  },
  {
    name: "Business",
    price: "$—",
    unit: "/ month",
    desc: "For orgs managing compliance at scale.",
    cta: "Talk to us",
    href: `mailto:${site.contact.sales}`,
    featured: false,
    features: [
      "25+ users",
      "Unlimited projects",
      "Active DAST + authenticated scans",
      "SSO / SAML + audit export",
      "Shareable read-only reports",
      "Priority support",
    ],
  },
];

export default function Pricing() {
  return (
    <>
      <section className="section container">
        <div className="sec-head">
          <span className="eyebrow">Pricing</span>
          <h2>Because you bring your own LLM key, we can be generous.</h2>
          <p>
            Self-host free forever, or let us run it. Prices below are placeholders while we
            finalize plans — <Link href="/contact">tell us what you need</Link>.
          </p>
        </div>
        <div className="pricing">
          {plans.map((p) => (
            <div key={p.name} className={`price-card${p.featured ? " price-card--featured" : ""}`}>
              {p.featured && <span className="price-card__badge">Most popular</span>}
              <h3>{p.name}</h3>
              <div className="price">
                {p.price} <span>{p.unit}</span>
              </div>
              <p className="desc">{p.desc}</p>
              <ul>
                {p.features.map((f) => (
                  <li key={f}>
                    <span className="tick">✓</span> {f}
                  </li>
                ))}
              </ul>
              <a className={`btn ${p.featured ? "btn--primary" : "btn--ghost"}`} href={p.href}>
                {p.cta}
              </a>
            </div>
          ))}
        </div>
        <p className="center muted" style={{ marginTop: 28, fontSize: 14 }}>
          All plans: your code is never persisted after a scan, your LLM key is encrypted and
          write-only, and requirements always track the App Defense Alliance source.
        </p>
      </section>
    </>
  );
}
