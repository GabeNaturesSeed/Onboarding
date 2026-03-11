import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GabeGS — AI-Powered E-Commerce Growth Platform",
  description: "The BI dashboard, Klaviyo automation, and AI development environment that replaces your agency. One-time setup, infinite leverage.",
  openGraph: {
    title: "GabeGS — AI-Powered E-Commerce Growth Platform",
    description: "Dashboard + Klaviyo flows + Claude Code vibe coding. Everything an e-commerce store needs to grow, for a fraction of what agencies charge.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="antialiased">
      <body>{children}</body>
    </html>
  );
}
