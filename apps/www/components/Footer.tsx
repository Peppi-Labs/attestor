import Link from "next/link";
import { footerNav, site } from "@/lib/site";

export function Footer() {
  const year = 2026;
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <div className="brand" style={{ marginBottom: 12 }}>
              <span className="brand__mark">A</span>
              {site.product.name}
            </div>
            <p className="muted" style={{ fontSize: 14, maxWidth: 320 }}>
              {site.product.tagline} Built by {site.company.legalName}.
            </p>
            <p className="footer__disclaimer">
              Not an authorized CASA lab. {site.product.name} prepares you for a Tier 2
              assessment and does not issue letters of validation. &quot;CASA&quot; is associated
              with the App Defense Alliance program; {site.company.shortName} is independent
              and unaffiliated.
            </p>
          </div>
          {Object.entries(footerNav).map(([group, links]) => (
            <div key={group}>
              <h4>{group}</h4>
              <ul>
                {links.map((l) => (
                  <li key={l.href}>
                    {l.href.startsWith("http") ? (
                      <a href={l.href}>{l.label}</a>
                    ) : (
                      <Link href={l.href}>{l.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer__bottom">
          <span>
            © {year} {site.company.legalName}. All rights reserved.
          </span>
          <span>
            <Link href="/legal/terms">Terms</Link> ·{" "}
            <Link href="/legal/privacy">Privacy</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
