'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { useComparison } from '@/hooks/useComparison';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Browse Parks', href: '/parks' },
  { name: 'Alerts', href: '/alerts' },
  { name: 'Compare', href: '/compare' },
  { name: 'Favorites', href: '/favorites' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { favorites, isLoaded: isFavoritesLoaded } = useFavorites();
  const { comparison, isLoaded: isComparisonLoaded } = useComparison();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-alabaster/85 backdrop-blur-md border-b border-parchment transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand mark & title */}
          <Link
            href="/"
            className="group flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-green rounded-lg py-1 px-1.5 -ml-1.5 transition-opacity hover:opacity-90"
          >
            {/* Custom minimalist geometric topographic mark */}
            <div className="relative w-10 h-10 rounded-xl bg-forest-green/10 border border-forest-green/20 flex items-center justify-center text-forest-green overflow-hidden group-hover:border-forest-green/40 transition-colors">
              <svg
                className="w-6 h-6 transform group-hover:scale-105 transition-transform duration-300"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 3L3 27H29L16 3Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 11L9 24H23L16 11Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeOpacity="0.8"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 18L13 24H19L16 18Z"
                  fill="currentColor"
                  fillOpacity="0.3"
                />
                <circle cx="16" cy="8" r="1.5" fill="#D4A359" />
              </svg>
            </div>

            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-canopy leading-none">
                NPS Buddy
              </span>
              <span className="text-[11px] font-medium tracking-wide text-raw-umber mt-0.5">
                National Park Guide
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname === item.href || pathname.startsWith(item.href + '/');

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-3.5 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-forest-green font-semibold'
                      : 'text-canopy/75 hover:text-canopy'
                  }`}
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    {item.name}

                    {/* Favorites counter badge */}
                    {item.name === 'Favorites' && isFavoritesLoaded && (
                      <AnimatePresence>
                        {favorites.length > 0 && (
                          <motion.span
                            key="fav-count"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                            className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[11px] font-mono font-bold leading-none text-white bg-sinopia rounded-full shadow-sm"
                          >
                            {favorites.length}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    )}

                    {/* Compare counter badge */}
                    {item.name === 'Compare' && isComparisonLoaded && (
                      <AnimatePresence>
                        {comparison.length > 0 && (
                          <motion.span
                            key="compare-count"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                            className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[11px] font-mono font-bold leading-none text-white bg-forest-green rounded-full shadow-sm"
                          >
                            {comparison.length}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    )}
                  </span>

                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-2 right-2 h-[2px] bg-forest-green rounded-full"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-canopy hover:text-forest-green hover:bg-stone-warm transition-colors focus:outline-none focus:ring-2 focus:ring-forest-green"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer with AnimatePresence */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-parchment bg-alabaster/95 backdrop-blur-md overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => {
                const isActive =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname === item.href || pathname.startsWith(item.href + '/');

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-forest-green/10 text-forest-green font-semibold'
                        : 'text-canopy/80 hover:bg-stone-warm hover:text-canopy'
                    }`}
                  >
                    <span>{item.name}</span>
                    <div className="flex items-center gap-1.5">
                      {item.name === 'Favorites' &&
                        isFavoritesLoaded &&
                        favorites.length > 0 && (
                          <span className="inline-flex items-center justify-center min-w-[20px] h-[20px] px-1.5 text-xs font-mono font-bold leading-none text-white bg-sinopia rounded-full">
                            {favorites.length}
                          </span>
                        )}
                      {item.name === 'Compare' &&
                        isComparisonLoaded &&
                        comparison.length > 0 && (
                          <span className="inline-flex items-center justify-center min-w-[20px] h-[20px] px-1.5 text-xs font-mono font-bold leading-none text-white bg-forest-green rounded-full">
                            {comparison.length}
                          </span>
                        )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
