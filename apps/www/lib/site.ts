/**
 * Single source of truth for company + product details used across the marketing site
 * and legal pages. Owned by Dashible Inc. (the entity behind peppi.ai).
 *
 * TODO before launch — confirm the fields marked CONFIRM:
 *  - company.address (peppi.ai does not publish one)
 *  - the exact contact-email domain (defaulted to the corporate domain)
 *  - product.appUrl / product.domain once DNS is decided
 */
export const site = {
  product: {
    name: "Attestor",
    tagline: "CASA Tier 2, without the scramble.",
    description:
      "Attestor is an automated, evidence-backed pre-assessment platform for the Google / App Defense Alliance CASA Tier 2 security review. Connect your repo and site, bring your own LLM key, and drive every requirement to closed.",
    domain: "attestor.dev", // CONFIRM
    appUrl: "https://app.attestor.dev", // CONFIRM
    repoUrl: "https://github.com/Peppi-Labs/attestor",
  },
  company: {
    legalName: "Dashible Inc.",
    shortName: "Dashible",
    // CONFIRM: peppi.ai publishes no mailing address; update before launch.
    address: "Dashible Inc., Delaware, United States",
    governingLaw: "State of Delaware, United States",
    foundedNote: "The team behind peppi.ai.",
  },
  contact: {
    // Uses the Dashible-owned peppi.ai domain (support@/privacy@ confirmed live on peppi.ai).
    support: "support@peppi.ai",
    privacy: "privacy@peppi.ai",
    legal: "legal@peppi.ai",
    security: "security@peppi.ai",
    sales: "sales@peppi.ai",
  },
  // Base URL of the product app that receives contact submissions + hosts the admin portal.
  appApiBase: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  legal: {
    effectiveDate: "July 3, 2026",
    lastUpdated: "July 3, 2026",
  },
} as const;

export const nav = [
  { label: "Product", href: "/#product" },
  { label: "How it works", href: "/#how" },
  { label: "Security", href: "/security" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
] as const;

export const footerNav = {
  Product: [
    { label: "Overview", href: "/#product" },
    { label: "How it works", href: "/#how" },
    { label: "Pricing", href: "/pricing" },
    { label: "Security", href: "/security" },
    { label: "FAQ", href: "/faq" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "GitHub", href: site.product.repoUrl },
  ],
  Legal: [
    { label: "Terms", href: "/legal/terms" },
    { label: "Privacy", href: "/legal/privacy" },
    { label: "Security", href: "/security" },
  ],
} as const;
