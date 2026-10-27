'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Eye,
  Scale,
  ArrowRight,
  Check,
  Pause,
  Play,
} from 'lucide-react';
import { NPSPark } from '@/types/nps';
import SearchBar from './SearchBar';
import ParkQuickViewModal from './ParkQuickViewModal';
import FavoriteButton from './FavoriteButton';
import { useComparison } from '@/hooks/useComparison';

interface HeroCarouselProps {
  featuredParks: NPSPark[];
}

const AUTOPLAY_INTERVAL = 6000; // 6 seconds

export default function HeroCarousel({ featuredParks }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [quickViewPark, setQuickViewPark] = useState<NPSPark | null>(null);
  const { isInComparison, toggleComparison } = useComparison();

  const parksCount = featuredParks.length;

  const nextSlide = useCallback(() => {
    if (parksCount === 0) return;
    setCurrentIndex((prev) => (prev + 1) % parksCount);
  }, [parksCount]);

  const prevSlide = useCallback(() => {
    if (parksCount === 0) return;
    setCurrentIndex((prev) => (prev - 1 + parksCount) % parksCount);
  }, [parksCount]);

  // Autoplay timer
  useEffect(() => {
    if (isPaused || parksCount <= 1) return;
    const interval = setInterval(nextSlide, AUTOPLAY_INTERVAL);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide, parksCount]);

  // Fallback if no parks provided
  if (parksCount === 0) {
    return (
      <section className="relative overflow-hidden bg-topo-pattern border-b border-parchment py-16 sm:py-24 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-canopy tracking-tight mb-4">
            Explore National Parks
          </h1>
          <p className="text-canopy/75 mb-8">
            Discover real-time alerts, visitor information, and wilderness guides across America.
          </p>
          <div className="max-w-2xl mx-auto">
            <SearchBar placeholder="Search by park name or state (e.g., Yellowstone or CA)..." />
          </div>
        </div>
      </section>
    );
  }

  const currentPark = featuredParks[currentIndex];
  const imageUrl = currentPark.images?.[0]?.url || '/placeholder-park.jpg';
  const inComparison = isInComparison(currentPark.parkCode);

  return (
    <div
      className="relative w-full bg-canopy text-white overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image Carousel with cross-fade */}
      <div className="relative h-[480px] sm:h-[560px] lg:h-[620px] w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPark.id || currentPark.parkCode}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={imageUrl}
              alt={currentPark.images?.[0]?.altText || currentPark.fullName}
              fill
              priority={currentIndex === 0}
              className="object-cover"
              sizes="100vw"
            />
            {/* Rich gradient overlays for crisp readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-canopy via-canopy/50 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-canopy/80 via-transparent to-transparent hidden md:block" />
          </motion.div>
        </AnimatePresence>

        {/* Floating Top Controls: Navigation Arrows & Pause */}
        <div className="absolute top-6 right-6 z-20 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-colors"
            title={isPaused ? 'Resume autoplay' : 'Pause autoplay'}
            aria-label={isPaused ? 'Resume autoplay' : 'Pause autoplay'}
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={prevSlide}
            className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-colors"
            aria-label="Previous featured park"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-colors"
            aria-label="Next featured park"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Hero Content Stage */}
        <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12 sm:pb-16">
          <div className="max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPark.id || currentPark.parkCode}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="space-y-4"
              >
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold tracking-wider px-3 py-1 rounded-full bg-xanthous text-canopy uppercase">
                    Featured Destination
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full bg-white/25 backdrop-blur-md text-white border border-white/20">
                    <MapPin className="w-3.5 h-3.5 text-xanthous" />
                    {currentPark.states}
                  </span>
                  <span className="font-mono text-xs text-white/80 uppercase">
                    {currentPark.parkCode}
                  </span>
                </div>

                {/* Park Name */}
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white drop-shadow-md">
                  {currentPark.fullName}
                </h1>

                {/* Excerpt */}
                <p className="text-sm sm:text-base text-white/90 line-clamp-2 sm:line-clamp-3 leading-relaxed drop-shadow">
                  {currentPark.description}
                </p>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Link
                    href={`/parks/${currentPark.parkCode}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-forest-green hover:bg-moss text-white font-semibold rounded-xl text-sm transition-all shadow-lg focus:outline-none focus:ring-2 focus:ring-white/40"
                  >
                    <span>Explore Park</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => setQuickViewPark(currentPark)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-medium rounded-xl text-sm border border-white/25 transition-all"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Quick View</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleComparison(currentPark.parkCode)}
                    className={`inline-flex items-center gap-1.5 px-4 py-2.5 backdrop-blur-md font-medium rounded-xl text-sm border transition-all ${
                      inComparison
                        ? 'bg-xanthous text-canopy border-xanthous font-semibold'
                        : 'bg-white/20 hover:bg-white/30 text-white border-white/25'
                    }`}
                  >
                    {inComparison ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>In Compare</span>
                      </>
                    ) : (
                      <>
                        <Scale className="w-4 h-4" />
                        <span>Compare</span>
                      </>
                    )}
                  </button>

                  <div className="ml-1">
                    <FavoriteButton
                      parkCode={currentPark.parkCode}
                      className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/25 text-white"
                    />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slide Progress Bars */}
          <div className="mt-8 flex items-center gap-2">
            {featuredParks.map((p, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={p.id || p.parkCode}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className="relative h-1.5 rounded-full overflow-hidden transition-all duration-300 focus:outline-none"
                  style={{ width: isActive ? '48px' : '16px' }}
                  aria-label={`Go to slide ${idx + 1}`}
                >
                  <div className="w-full h-full bg-white/30" />
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-xanthous"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{
                        duration: isPaused ? 0 : AUTOPLAY_INTERVAL / 1000,
                        ease: 'linear',
                      }}
                      style={{ originX: 0 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Integrated Search Bar Section below hero stage */}
      <div className="bg-alabaster text-canopy border-b border-parchment py-8 sm:py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-5">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-canopy">
              Find Your Next Adventure
            </h2>
            <p className="text-xs sm:text-sm text-canopy/70 mt-1 font-normal">
              Search over 400 national parks, recreation areas, and historic trails
            </p>
          </div>

          <div className="max-w-2xl mx-auto mb-4">
            <SearchBar placeholder="Search by park name, state, or keywords..." />
          </div>

          {/* Quick Filter Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="font-mono text-raw-umber mr-1 text-[11px] uppercase tracking-wider font-semibold">
              Popular States:
            </span>
            {['CA', 'UT', 'WA', 'ME', 'AZ', 'WY'].map((st) => (
              <Link
                key={st}
                href={`/parks?state=${st}`}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-stone-warm text-canopy border border-parchment font-mono shadow-sm transition-all hover:border-forest-green/40"
              >
                {st}
              </Link>
            ))}
            <span className="text-parchment mx-1">|</span>
            <span className="font-mono text-raw-umber mr-1 text-[11px] uppercase tracking-wider font-semibold">
              Activities:
            </span>
            {['Hiking', 'Camping', 'Wildlife Watching'].map((act) => (
              <Link
                key={act}
                href={`/parks?activity=${encodeURIComponent(act)}`}
                className="px-3 py-1 rounded-lg bg-white hover:bg-stone-warm text-canopy border border-parchment font-medium shadow-sm transition-all hover:border-forest-green/40"
              >
                {act}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <ParkQuickViewModal
        park={quickViewPark}
        isOpen={Boolean(quickViewPark)}
        onClose={() => setQuickViewPark(null)}
      />
    </div>
  );
}
