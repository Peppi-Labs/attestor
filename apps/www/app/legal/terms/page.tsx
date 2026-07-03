import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Terms of Service" };

export default function Terms() {
  const P = site.product.name;
  const C = site.company.legalName;
  return (
    <section className="section container">
      <div className="prose">
        <h1>Terms of Service</h1>
        <p className="updated">Last updated: {site.legal.lastUpdated}</p>

        <div className="callout">
          <p>
            This is a plain-language summary and a binding agreement. Please read it. If you do
            not agree, do not use {P}. This template should be reviewed by counsel before
            production use.
          </p>
        </div>

        <h2>1. Acceptance</h2>
        <p>
          These Terms of Service (&quot;Terms&quot;) are a contract between you (and any
          organization you represent, &quot;you&quot;) and {C} (&quot;{site.company.shortName}
          ,&quot; &quot;we,&quot; &quot;us&quot;), the operator of {P} (the &quot;Service&quot;).
          By creating an account, connecting a repository or website, or otherwise using the
          Service, you agree to these Terms.
        </p>

        <h2>2. Eligibility &amp; authority</h2>
        <p>
          You must be at least 18 and able to form a binding contract. If you use the Service on
          behalf of an organization, you represent that you are authorized to bind that
          organization to these Terms.
        </p>

        <h2>3. The Service — what {P} is and is not</h2>
        <p>
          {P} helps you prepare for a Google / App Defense Alliance CASA Tier 2 assessment by
          analyzing code and web assets you connect and organizing your requirements and evidence.
        </p>
        <p>
          <strong>{P} is not an authorized CASA lab and does not issue letters of validation.</strong>{" "}
          We do not perform the official Tier 2 assessment, and using {P} does not guarantee that
          you will pass any assessment or obtain any certification. &quot;CASA&quot; and &quot;App
          Defense Alliance&quot; are the marks of their respective owners; {site.company.shortName}{" "}
          is independent and unaffiliated.
        </p>

        <h2>4. Your account</h2>
        <p>
          You are responsible for safeguarding your account, enabling available security features
          (including multi-factor authentication for administrators), and for all activity under
          your account. Notify us promptly of any unauthorized use.
        </p>

        <h2>5. Acceptable use &amp; authorization to scan</h2>
        <p>You agree not to use the Service to:</p>
        <ul>
          <li>connect, scan, or test any repository, website, or system you do not own or lack
            explicit authorization to assess;</li>
          <li>violate any law, infringe intellectual property, or breach any third-party rights;</li>
          <li>attempt to access another customer&apos;s data, or probe, disrupt, or circumvent the
            Service&apos;s security or tenant isolation;</li>
          <li>upload malware, or use the Service to attack or overload any third party.</li>
        </ul>
        <p>
          <strong>Scan authorization.</strong> Before {P} performs any website or dynamic
          (DAST) scan, you must attest that you are authorized to assess the target host. You are
          solely responsible for that authorization, and you will indemnify us for claims arising
          from scans you initiate or authorize.
        </p>

        <h2>6. Third-party services, your keys, and connected accounts</h2>
        <p>
          The Service integrates with third parties you choose — including your source-code host
          (e.g., GitHub) and your large-language-model (&quot;LLM&quot;) provider. You are
          responsible for your use of those services and for any keys or credentials you provide.
          When you supply an LLM key, analysis of your content is performed through your provider
          under your account and their terms; you are responsible for the associated costs and for
          your provider&apos;s handling of the content sent to it.
        </p>

        <h2>7. Not professional, legal, or compliance advice</h2>
        <p>
          {P}&apos;s output — including automated statuses, findings, remediation suggestions, and
          priorities — is informational and generated in part by automated and machine-learning
          systems. It may be incomplete or wrong and must be independently verified by qualified
          personnel. {P} is not a substitute for professional security, legal, or compliance
          advice, or for an authorized assessment.
        </p>

        <h2>8. Content &amp; ownership</h2>
        <p>
          As between you and us, you retain all rights to the code, data, and materials you connect
          or submit (&quot;Customer Content&quot;). You grant us a limited license to process
          Customer Content solely to provide the Service. We own the Service itself and all
          related software and intellectual property, except for components made available under
          their own open-source licenses. Feedback you provide may be used without restriction.
        </p>

        <h2>9. Billing &amp; subscriptions</h2>
        <p>
          Paid plans are billed in advance on a recurring basis through our payment processor.
          Fees are non-refundable except where required by law or expressly stated. We may change
          prices with reasonable notice; changes apply to the next billing cycle. You are
          responsible for applicable taxes and for any third-party costs (such as your LLM
          provider usage).
        </p>

        <h2>10. Open source &amp; self-hosting</h2>
        <p>
          Portions of {P} are made available under an open-source license in our public
          repository, and your use of that source code is governed by that license. These Terms
          govern your use of the hosted Service we operate. When you self-host, you are the
          operator of your own instance and responsible for its security and compliance.
        </p>

        <h2>11. Termination</h2>
        <p>
          You may stop using the Service and delete your account at any time. We may suspend or
          terminate access if you breach these Terms or to protect the Service or others. On
          termination, your right to use the hosted Service ends and we may delete your data in
          accordance with our <a href="/legal/privacy">Privacy Policy</a>.
        </p>

        <h2>12. Disclaimers</h2>
        <p>
          THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE,&quot; WITHOUT
          WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING WARRANTIES OF
          MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. WE DO NOT
          WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR THAT ITS OUTPUT IS
          ACCURATE OR COMPLETE, OR THAT USING IT WILL RESULT IN PASSING ANY ASSESSMENT.
        </p>

        <h2>13. Limitation of liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, {C.toUpperCase()} WILL NOT BE LIABLE FOR ANY
          INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF
          PROFITS, DATA, OR GOODWILL. OUR TOTAL LIABILITY FOR ANY CLAIM ARISING OUT OF OR RELATING
          TO THE SERVICE WILL NOT EXCEED THE GREATER OF (A) THE AMOUNTS YOU PAID US FOR THE SERVICE
          IN THE 12 MONTHS BEFORE THE CLAIM, OR (B) ONE HUNDRED U.S. DOLLARS ($100).
        </p>

        <h2>14. Indemnification</h2>
        <p>
          You will defend, indemnify, and hold harmless {C} from claims, damages, and expenses
          arising out of your Customer Content, your use of the Service, scans or connections you
          initiate or authorize, or your breach of these Terms.
        </p>

        <h2>15. Changes to these Terms</h2>
        <p>
          We may update these Terms from time to time. Material changes will be posted here with a
          new &quot;Last updated&quot; date and, where appropriate, additional notice. Continued
          use after changes take effect constitutes acceptance.
        </p>

        <h2>16. Governing law &amp; disputes</h2>
        <p>
          These Terms are governed by the laws of the {site.company.governingLaw}, without regard
          to its conflict-of-laws rules. The state and federal courts located in Delaware will have
          exclusive jurisdiction over any dispute not subject to arbitration, and you consent to
          their jurisdiction and venue.
        </p>

        <h2>17. Contact</h2>
        <p>
          Questions about these Terms? Email{" "}
          <a href={`mailto:${site.contact.legal}`}>{site.contact.legal}</a> or write to {C},{" "}
          {site.company.address}.
        </p>
      </div>
    </section>
  );
}
