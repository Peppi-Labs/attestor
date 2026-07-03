import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(`https://${site.product.domain}`),
  title: {
    default: `${site.product.name} — ${site.product.tagline}`,
    template: `%s · ${site.product.name}`,
  },
  description: site.product.description,
  openGraph: {
    title: `${site.product.name} — ${site.product.tagline}`,
    description: site.product.description,
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
