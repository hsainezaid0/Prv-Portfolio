import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers/Providers";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import { SiteBackground } from "@/components/background/SiteBackground";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { ChatWidget } from "@/components/ui/ChatWidget";
import { SkipLink } from "@/components/ui/SkipLink";
import { links, person } from "@/content/profile";
import "./globals.css";

// next/font downloads the fonts at build time and serves them from your own domain.
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(links.site),
  title: {
    default: "Zaid Hsaine | Software development & cybersecurity",
    template: "%s | Zaid Hsaine",
  },
  description: person.intro.en,
  keywords: [
    "Zaid Hsaine",
    "cybersecurity",
    "alternance cybersécurité",
    "Snort",
    "network security",
    "EPITECH Paris",
    "EMSI",
    "portfolio",
    "Next.js",
    "TypeScript",
  ],
  authors: [{ name: person.name, url: links.site }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: links.site,
    title: "Zaid Hsaine | Portfolio",
    description: "Software development and cybersecurity projects by Zaid Hsaine.",
    images: [{ url: "/profile.jpg", width: 240, height: 240, alt: person.name }],
    locale: "en_US",
    alternateLocale: ["fr_FR"],
  },
  twitter: { card: "summary", title: "Zaid Hsaine | Portfolio", images: ["/profile.jpg"] },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8faff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0a1f" },
  ],
};

// Runs before the page paints, so the right theme shows immediately (no flash).
const themeScript = `(function(){try{var s=localStorage.getItem("cyb-theme");var d=s?s==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.dataset.theme=d?"dark":"light";}catch(e){document.documentElement.dataset.theme="dark";}})();`;

// Structured data so search engines understand who the site is about.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: person.name,
  url: links.site,
  image: `${links.site}/profile.jpg`,
  jobTitle: "Computer science student",
  affiliation: [
    { "@type": "CollegeOrUniversity", name: "EMSI" },
    { "@type": "CollegeOrUniversity", name: "EPITECH Paris" },
  ],
  knowsAbout: ["Cybersecurity", "Network intrusion detection", "Web development", "Embedded systems"],
  sameAs: [links.github],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-dvh bg-bg text-fg antialiased">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Providers>
          {/* Shared by every page: background, navigation, footer, palette, assistant. */}
          <SiteBackground />
          <SkipLink />
          <Header />
          <main id="main" tabIndex={-1} className="relative overflow-x-clip pb-24 outline-none lg:pb-0">
            {children}
          </main>
          <Footer />
          <MobileNav />
          <CommandPalette />
          <ChatWidget />
        </Providers>
      </body>
    </html>
  );
}
