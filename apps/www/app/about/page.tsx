import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "About" };

export default function About() {
  return (
    <section className="section container">
      <div className="prose">
        <span className="eyebrow">About</span>
        <h1 style={{ marginTop: 16 }}>
          We built {site.product.name} because we had to pass CASA ourselves.
        </h1>
        <p style={{ fontSize: 18, marginTop: 20 }}>
          {site.product.name} is made by {site.company.legalName} — the team behind{" "}
          <a href="https://peppi.ai">peppi.ai</a>. When Google asked us to complete a CASA
          Tier 2 assessment, we did what most teams do: stared at a wall of OWASP requirements
          with no idea where our own app stood.
        </p>
        <p>
          So we built the tool we wished existed — one that reads your codebase and your running
          site, tells you where you stand on every requirement, hands you a concrete fix for each
          gap, and collects the exact evidence an assessor will ask for. Then we made it open
          source, because every team facing that same email deserves a head start.
        </p>

        <h2>What we believe</h2>
        <ul>
          <li>
            <strong>Your data is yours.</strong> Read-only access, code that&apos;s never
            persisted after a scan, and analysis that runs on your own LLM key.
          </li>
          <li>
            <strong>Security tools should be exemplary.</strong> A product that checks your
            security has to hold itself to the same bar — tenant isolation, encrypted secrets,
            and MFA by default.
          </li>
          <li>
            <strong>Compliance shouldn&apos;t be a black box.</strong> Every suggestion links to
            the evidence behind it, and the requirements track the public source of truth.
          </li>
        </ul>

        <div className="callout">
          <p>
            <strong>Not an authorized CASA lab.</strong> {site.product.name} prepares you for a
            Tier 2 assessment and does not issue letters of validation. &quot;CASA&quot; is
            associated with the App Defense Alliance program; {site.company.shortName} is
            independent and unaffiliated.
          </p>
        </div>

        <p style={{ marginTop: 28 }}>
          Questions or partnership ideas? <Link href="/contact">Get in touch</Link> or browse the
          code on <a href={site.product.repoUrl}>GitHub</a>.
        </p>
      </div>
    </section>
  );
}
