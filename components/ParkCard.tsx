'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, ArrowUpRight, Scale, Eye, Check } from 'lucide-react';
import { NPSPark } from '@/types/nps';
import FavoriteButton from './FavoriteButton';
import ParkQuickViewModal from './ParkQuickViewModal';
import { useComparison } from '@/hooks/useComparison';

interface ParkCardProps {
  park: NPSPark;
  viewMode?: 'grid' | 'list';
  onQuickView?: (park: NPSPark) => void;
}

export default function ParkCard({
  park,
  viewMode = 'grid',
  onQuickView,
}: ParkCardProps) {
  const [internalModalOpen, setInternalModalOpen] = useState(false);
  const { isInComparison, toggleComparison } = useComparison();

  const imageUrl = park.images?.[0]?.url || '/placeholder-park.jpg';
  const imageAlt = park.images?.[0]?.altText || park.fullName;
  const inComparison = isInComparison(park.parkCode);

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(park);
    } else {
      setInternalModalOpen(true);
    }
  };

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleComparison(park.parkCode);
  };

  // Entrance fee display logic
  const feeDisplay = (() => {
    if (!park.entranceFees || park.entranceFees.length === 0) {
      return 'Free Entry';
    }
    const cost = parseFloat(park.entranceFees[0].cost);
    if (isNaN(cost) || cost === 0) {
      return 'Free Entry';
    }
    return `$${cost.toFixed(0)} Entry`;
  })();

  const topActivities = park.activities?.slice(0, 3) || [];

  // ================= COMPACT LIST VIEW =================
  if (viewMode === 'list') {
    return (
      <>
        <motion.div
          layout
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98 }}
          whileHover={{ y: -3, scale: 1.005 }}
          transition={{ duration: 0.25 }}
          className="group w-full"
        >
          <div className="bg-white border border-parchment/80 rounded-2xl overflow-hidden shadow-eco hover:shadow-eco-hover transition-all duration-300 flex flex-col sm:flex-row items-stretch">
            {/* Thumbnail */}
            <div className="relative w-full sm:w-56 h-44 sm:h-auto bg-stone-warm overflow-hidden flex-shrink-0">
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                sizes="(max-width: 640px) 100vw, 240px"
              />
              <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
                <span className="font-mono text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-canopy border border-parchment/70 uppercase">
                  {park.parkCode.toUpperCase()}
                </span>
              </div>
            </div>

            {/* List Body */}
            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between min-w-0">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-raw-umber">
                      <MapPin className="w-3.5 h-3.5 text-sinopia" />
                      {park.states}
                    </span>
                    {park.designation && (
                      <span className="text-xs font-mono uppercase text-canopy/60">
                        • {park.designation}
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-xs text-canopy/80 font-medium">
                    {feeDisplay}
                  </span>
                </div>

                <Link
                  href={`/parks/${park.parkCode}`}
                  className="block group-hover:text-forest-green transition-colors"
                >
                  <h3 className="text-lg sm:text-xl font-bold text-canopy line-clamp-1 mb-1.5">
                    {park.fullName}
                  </h3>
                </Link>

                <p className="text-canopy/75 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-3">
                  {park.description}
                </p>

                {topActivities.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {topActivities.map((act) => (
                      <span
                        key={act.id || act.name}
                        className="text-[11px] bg-sand text-raw-umber border border-parchment px-2 py-0.5 rounded-full font-medium"
                      >
                        {act.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Actions Row */}
              <div className="pt-3 border-t border-parchment/60 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <FavoriteButton
                    parkCode={park.parkCode}
                    className="p-1.5 rounded-lg bg-stone-warm hover:bg-parchment text-canopy transition-colors"
                  />
                  <button
                    type="button"
                    onClick={handleToggleCompare}
                    className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      inComparison
                        ? 'bg-forest-green text-white border-forest-green'
                        : 'bg-stone-warm hover:bg-parchment text-canopy border-parchment'
                    }`}
                    title={inComparison ? 'Remove from compare' : 'Add to compare'}
                  >
                    {inComparison ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Compared</span>
                      </>
                    ) : (
                      <>
                        <Scale className="w-3 h-3 text-forest-green" />
                        <span>Compare</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleQuickView}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-stone-warm hover:bg-parchment text-canopy border border-parchment transition-colors"
                  >
                    <Eye className="w-3 h-3 text-forest-green" />
                    <span>Quick View</span>
                  </button>
                </div>

                <Link
                  href={`/parks/${park.parkCode}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-forest-green hover:text-moss transition-colors"
                >
                  <span>Explore</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {!onQuickView && (
          <ParkQuickViewModal
            park={park}
            isOpen={internalModalOpen}
            onClose={() => setInternalModalOpen(false)}
          />
        )}
      </>
    );
  }

  // ================= GRID VIEW =================
  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ y: -6, scale: 1.01 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="group h-full flex flex-col"
      >
        <div className="bg-white border border-parchment/80 rounded-2xl overflow-hidden shadow-eco hover:shadow-eco-hover transition-all duration-300 h-full flex flex-col">
          {/* Park Image Stage */}
          <div className="relative h-52 w-full bg-stone-warm overflow-hidden flex-shrink-0">
            {park.images?.[0]?.url ? (
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sage font-mono text-sm">
                No image available
              </div>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-canopy/50 via-transparent to-black/20 opacity-80" />

            {/* Top Badges */}
            <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-1.5">
              <span className="font-mono text-[11px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-canopy border border-parchment/70 shadow-sm uppercase">
                {park.parkCode.toUpperCase()}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-canopy border border-parchment/70 shadow-sm">
                <MapPin className="w-3 h-3 text-sinopia" />
                {park.states}
              </span>
            </div>

            {/* Top Right Actions */}
            <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
              <FavoriteButton parkCode={park.parkCode} />
            </div>

            {/* Quick View Button overlaid on image bottom-right */}
            <div className="absolute bottom-3 right-3 z-10">
              <button
                type="button"
                onClick={handleQuickView}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-white/90 hover:bg-white text-canopy backdrop-blur-md shadow-sm border border-parchment/80 transition-all hover:scale-105"
                title="Quick preview"
              >
                <Eye className="w-3 h-3 text-forest-green" />
                <span>Quick View</span>
              </button>
            </div>
          </div>

          {/* Park Info Card Body */}
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div>
              {/* Designation */}
              {park.designation && (
                <p className="font-mono text-xs uppercase tracking-wider text-raw-umber font-semibold mb-1">
                  {park.designation}
                </p>
              )}

              {/* Park Full Name */}
              <Link href={`/parks/${park.parkCode}`}>
                <h3 className="text-xl font-bold text-canopy group-hover:text-forest-green transition-colors line-clamp-1 mb-2">
                  {park.fullName}
                </h3>
              </Link>

              {/* Park Description */}
              <p className="text-canopy/75 text-sm line-clamp-3 leading-relaxed mb-4">
                {park.description}
              </p>

              {/* Top 3 Activities Tags */}
              {topActivities.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {topActivities.map((act) => (
                    <span
                      key={act.id || act.name}
                      className="text-xs bg-sand text-raw-umber border border-parchment px-2.5 py-0.5 rounded-full font-medium"
                    >
                      {act.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Row */}
            <div className="pt-4 border-t border-parchment/60 flex items-center justify-between gap-2 text-xs">
              <span className="font-mono text-canopy/80 font-medium">
                {feeDisplay}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleToggleCompare}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold border transition-all ${
                    inComparison
                      ? 'bg-forest-green text-white border-forest-green'
                      : 'bg-stone-warm hover:bg-parchment text-canopy border-parchment'
                  }`}
                  title={inComparison ? 'Remove from compare' : 'Add to compare'}
                >
                  {inComparison ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Compared</span>
                    </>
                  ) : (
                    <>
                      <Scale className="w-3 h-3 text-forest-green" />
                      <span>Compare</span>
                    </>
                  )}
                </button>

                <Link
                  href={`/parks/${park.parkCode}`}
                  className="inline-flex items-center gap-1 font-semibold text-forest-green group-hover:text-moss transition-colors ml-1"
                >
                  <span>Explore</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {!onQuickView && (
        <ParkQuickViewModal
          park={park}
          isOpen={internalModalOpen}
          onClose={() => setInternalModalOpen(false)}
        />
      )}
    </>
  );
}
