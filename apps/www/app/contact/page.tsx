import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Contact" };

const channels = [
  { h: "Support", email: site.contact.support, p: "Product help and general questions." },
  { h: "Sales", email: site.contact.sales, p: "Plans, volume, and enterprise needs." },
  { h: "Security", email: site.contact.security, p: "Responsible disclosure and security questions." },
  { h: "Privacy", email: site.contact.privacy, p: "Data requests and privacy inquiries." },
];

export default function Contact() {
  return (
    <section className="section container">
      <div className="sec-head">
        <span className="eyebrow">Contact</span>
        <h2>Talk to us.</h2>
        <p>Whether you&apos;re staring down a CASA deadline or just curious — we&apos;re here.</p>
      </div>

      <div className="split" style={{ alignItems: "start" }}>
        <ContactForm />
        <div className="grid" style={{ gap: 14 }}>
          {channels.map((c) => (
            <div className="card" key={c.h} style={{ padding: 18 }}>
              <h3 style={{ fontSize: 16 }}>{c.h}</h3>
              <p style={{ fontSize: 14 }}>{c.p}</p>
              <a href={`mailto:${c.email}`} style={{ color: "var(--accent)", fontSize: 14, fontWeight: 600 }}>
                {c.email}
              </a>
            </div>
          ))}
          <p className="muted" style={{ fontSize: 13 }}>
            {site.company.legalName} · {site.company.address}
          </p>
        </div>
      </div>
    </section>
  );
}
