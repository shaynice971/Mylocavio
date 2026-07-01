import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import CookieBanner from "@/components/CookieBanner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mylocavio.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MyLocavio — Gestion locative simplifiée",
    template: "%s — MyLocavio",
  },
  description:
    "La solution de gestion locative pour les propriétaires bailleurs particuliers : quittances PDF, baux conformes ALUR, relances de loyers impayés.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "MyLocavio — Gestion locative simplifiée",
    description:
      "La solution de gestion locative pour les propriétaires bailleurs particuliers.",
    url: siteUrl,
    siteName: "MyLocavio",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "MyLocavio — Gestion locative simplifiée",
    description:
      "La solution de gestion locative pour les propriétaires bailleurs particuliers.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#2A9FD6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={cn(inter.variable)}>
      <body className="font-sans antialiased bg-white text-gray-900">
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
