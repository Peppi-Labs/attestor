import Link from "next/link";
import { nav, site } from "@/lib/site";

export function Header() {
  return (
    <header className="header">
      <div className="container header__inner">
        <Link href="/" className="brand">
          <span className="brand__mark">A</span>
          {site.product.name}
        </Link>
        <nav className="navlinks">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className="navlink">
              {n.label}
            </a>
          ))}
        </nav>
        <div className="header__cta">
          <a className="btn btn--ghost" href={site.product.appUrl}>
            Sign in
          </a>
          <a className="btn btn--primary" href={site.product.appUrl}>
            Start free
          </a>
        </div>
      </div>
    </header>
  );
}
