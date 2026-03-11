import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ecomm Onboarding Dashboard",
  description: "E-commerce client onboarding and intelligence hub",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
