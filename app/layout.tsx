import type { Metadata, Viewport } from "next";
import "./globals.css";
import Link from "next/link";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import CompareDock from "@/components/CompareDock";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "NPS Buddy | %s",
    default: "NPS Buddy | National Park Guide",
  },
  description: "Explore U.S. National Parks, view live safety alerts, compare destinations, and save your favorites",
  icons: {
    icon: "/icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${jetbrainsMono.variable}`}>
      <body
        className="font-sans bg-alabaster text-canopy antialiased min-h-screen flex flex-col selection:bg-sage-light selection:text-forest-green"
        suppressHydrationWarning
      >
        {/* Navigation Bar */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          {children}
        </main>

        {/* Persistent Comparison Dock */}
        <CompareDock />

        {/* Elegant Footer */}
        <footer className="bg-stone-warm border-t border-parchment text-canopy mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-parchment/60">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg text-canopy">NPS Buddy</span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-forest-green/10 text-forest-green">
                    Park Guide
                  </span>
                </div>
                <p className="text-xs text-canopy/75">
                  Your companion for exploring America&apos;s national parks, monuments, and historic trails.
                </p>
              </div>

              <div className="flex flex-wrap gap-6 text-sm font-medium text-canopy/80">
                <Link href="/" className="hover:text-forest-green transition-colors">
                  Home
                </Link>
                <Link href="/parks" className="hover:text-forest-green transition-colors">
                  Browse Parks
                </Link>
                <Link href="/alerts" className="hover:text-forest-green transition-colors">
                  Safety Alerts
                </Link>
                <Link href="/compare" className="hover:text-forest-green transition-colors">
                  Compare Parks
                </Link>
                <Link href="/favorites" className="hover:text-forest-green transition-colors">
                  Saved Favorites
                </Link>
              </div>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-canopy/60">
              <p>
                Built with Next.js & Tailwind CSS • Powered by the National Park Service API
              </p>
              <p>
                Independent guide • Not affiliated with the official U.S. National Park Service
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
