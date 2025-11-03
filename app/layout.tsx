import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import Path from "@/app/src/icons/path.svg";
import { Trykker } from "next/font/google";

const trykker = Trykker({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = { /* data for sharing, shows professionalism  */
  title: {
    template: "NPS Buddy | %s",
    default: "NPS Buddy | Home",
  },
  description: "Explore U.S. National Parks, view alerts, events, and compare",
  icons: {
    icon: "/icon.svg",
  },
  /* ensure proper mobile rendering and touch zooming */
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
};

const linkClass = " inline-block bg-raw-umber rounded hover:bg-sinopia hover:text-gray-900 transition-colors px-4 py-2 font-medium"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${trykker.className} antialiased`} suppressHydrationWarning>
        <div className="min-h-screen flex flex-col">
          {/* Nav Header */}
          <header className="bg-xanthous text-white shadow-lg">
            <div className="w-full px-4 py-4">
              {/* responsive nav: vertical on mobile, horizontal on desktop */}
              <nav className="flex flex-col md:flex-row items-center justify-between gap-4">
                <Link href="/" className="text-2xl font-bold hover:text-sinopia transition-colors flex items-center gap-2">
                  <Path className="w-12 h-12"/>
                  <span>NPS Buddy</span>
                </Link>
                {/* nav links: stacked vertically on mobile, horizontal on larger screens */}
                <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full md:w-auto">
                  <Link href="/" className={linkClass}>
                    Home
                  </Link>
                  <Link href="/parks" className={linkClass}>
                    Browse Parks
                  </Link>
                  <Link href="/alerts" className={linkClass}>
                    Alerts
                  </Link>
                  <Link href="/compare" className={linkClass}>
                    Compare
                  </Link>
                  <Link href="/favorites" className={linkClass}>
                    Favorites
                  </Link>
                </div>
              </nav>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-paynes-gray text-gray-100 ">
            <div className="w-full px-4 py-6">
              <div className="text-center text-sm">
                <p className="mb-2">
                  Data provided by the National Park Service API
                </p>
                <p className="text-gray-300">
                  Built with Next.js • Not affiliated with the National Park Service
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
