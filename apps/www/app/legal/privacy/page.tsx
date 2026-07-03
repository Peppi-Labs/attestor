import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function Privacy() {
  const P = site.product.name;
  const C = site.company.legalName;
  return (
    <section className="section container">
      <div className="prose">
        <h1>Privacy Policy</h1>
        <p className="updated">Last updated: {site.legal.lastUpdated}</p>

        <div className="callout">
          <p>
            This policy explains what {P} collects, how we use it, and the choices you have. This
            template should be reviewed by counsel before production use.
          </p>
        </div>

        <h2>1. Overview</h2>
        <p>
          {P} is operated by {C} (&quot;{site.company.shortName},&quot; &quot;we,&quot;
          &quot;us&quot;). This policy applies to the {P} website and hosted service. We designed
          {" "}{P} to minimize the data we hold: we analyze the code and web assets you connect, but
          we do not keep your source code after a scan, and we never train on your content.
        </p>

        <h2>2. Information we collect</h2>
        <ul>
          <li><strong>Account &amp; organization data:</strong> name, email, authentication
            details, organization and team membership, and role.</li>
          <li><strong>Connected repositories (read-only):</strong> we fetch a temporary, read-only
            snapshot of a repository at a specific commit to run a scan. We retain the derived
            findings and the commit identifier — <strong>not</strong> your source code (see
            Retention).</li>
          <li><strong>Website &amp; scan data:</strong> for hosts you authorize, the results of
            website checks and dynamic (DAST) scans, and related evidence artifacts.</li>
          <li><strong>Secrets you provide:</strong> LLM provider keys and integration tokens,
            stored encrypted and write-only (we display only the last four characters).</li>
          <li><strong>Usage &amp; device data:</strong> log data, IP address, and basic analytics
            needed to operate, secure, and improve the Service.</li>
          <li><strong>Billing data:</strong> handled by our payment processor; we do not store full
            card numbers.</li>
        </ul>

        <h2>3. How we use your information</h2>
        <ul>
          <li>to provide the Service — run scans, generate assessments and evidence, and track your
            progress;</li>
          <li>to authenticate you, enforce access controls, and maintain security and audit logs;</li>
          <li>to operate billing and support;</li>
          <li>to maintain, debug, and improve the Service; and</li>
          <li>to comply with law and enforce our <a href="/legal/terms">Terms</a>.</li>
        </ul>

        <h2>4. What we never do</h2>
        <ul>
          <li>We do not sell your personal information or Customer Content.</li>
          <li>We do not use your code or scan data to train machine-learning models.</li>
          <li>We do not send your content to any LLM other than the provider whose key you supply.</li>
        </ul>

        <h2>5. When we share data</h2>
        <p>
          We share limited data only with vetted service providers acting on our behalf under data
          protection agreements — for example, cloud hosting and storage, our payment processor,
          and email delivery. When you supply an LLM key, relevant snippets of your content are
          sent to <strong>your chosen provider</strong> to perform analysis, under your account and
          their terms. We may disclose information if required by law or to protect the rights,
          safety, and security of our users and the Service. If we are involved in a merger or
          acquisition, we will provide notice before your information becomes subject to a different
          policy.
        </p>

        <h2>6. Retention</h2>
        <p>
          We keep account and assessment data for as long as your account is active. Repository
          snapshots are transient and are discarded after a scan completes; we retain only the
          derived findings and commit identifier. You can configure retention for scan artifacts,
          export your data, and request deletion. On account deletion we remove your data within a
          commercially reasonable period, except where retention is required by law.
        </p>

        <h2>7. Security</h2>
        <p>
          We use industry-standard measures including encryption in transit and at rest, envelope
          encryption for secrets, tenant isolation enforced at both the application and database
          layers, role-based access control, required multi-factor authentication for
          administrators, and audit logging. No method of transmission or storage is perfectly
          secure, but we work continuously to protect your data. See our{" "}
          <a href="/security">Security page</a> for more.
        </p>

        <h2>8. Your rights &amp; choices</h2>
        <p>
          Depending on where you live (including under the GDPR, UK GDPR, and CCPA/CPRA), you may
          have rights to access, correct, delete, port, or restrict the processing of your personal
          information, and to object to certain processing. We do not sell or &quot;share&quot;
          personal information as those terms are defined under California law. To exercise your
          rights, email{" "}
          <a href={`mailto:${site.contact.privacy}`}>{site.contact.privacy}</a>; we will respond
          within the timeframe required by applicable law (generally within 30 days).
        </p>

        <h2>9. International users</h2>
        <p>
          We operate in the United States and may process data there and in other countries. Where
          required, we use appropriate safeguards for cross-border transfers. By using the Service,
          you understand your information may be processed in the United States.
        </p>

        <h2>10. Children</h2>
        <p>
          {P} is not intended for anyone under 18, and we do not knowingly collect personal
          information from children.
        </p>

        <h2>11. Changes to this policy</h2>
        <p>
          We may update this policy from time to time. Material changes will be posted here with a
          new &quot;Last updated&quot; date and, where appropriate, additional notice.
        </p>

        <h2>12. Contact us</h2>
        <p>
          Questions or requests? Email{" "}
          <a href={`mailto:${site.contact.privacy}`}>{site.contact.privacy}</a> or write to {C},{" "}
          {site.company.address}.
        </p>
      </div>
    </section>
  );
}
