import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Attestor — CASA Tier 2 self-assessment",
  description:
    "Open-source platform to prepare for a Google / App Defense Alliance CASA Tier 2 security assessment.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
