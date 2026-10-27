'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  MapPin,
  Ticket,
  Clock,
  CloudSun,
  Compass,
  ArrowRight,
  Scale,
  Check,
} from 'lucide-react';
import { NPSPark } from '@/types/nps';
import FavoriteButton from './FavoriteButton';
import { useComparison } from '@/hooks/useComparison';

interface ParkQuickViewModalProps {
  park: NPSPark | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ParkQuickViewModal({
  park,
  isOpen,
  onClose,
}: ParkQuickViewModalProps) {
  const { isInComparison, toggleComparison } = useComparison();

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!park) return null;

  const inComparison = isInComparison(park.parkCode);
  const imageUrl = park.images?.[0]?.url || '/placeholder-park.jpg';
  const imageAlt = park.images?.[0]?.altText || park.fullName;

  const feeDisplay = (() => {
    if (!park.entranceFees || park.entranceFees.length === 0) {
      return 'Free Entry';
    }
    const cost = parseFloat(park.entranceFees[0].cost);
    if (isNaN(cost) || cost === 0) {
      return 'Free Entry';
    }
    return `$${cost.toFixed(0)} (${park.entranceFees[0].title || 'Standard Entrance'})`;
  })();

  const hoursSummary = (() => {
    if (!park.operatingHours || park.operatingHours.length === 0) {
      return 'Standard park hours apply; check seasonal schedule.';
    }
    const hours = park.operatingHours[0];
    if (hours.description) return hours.description;
    if (hours.standardHours) {
      return `Monday: ${hours.standardHours.monday || 'Open'}, Sunday: ${
        hours.standardHours.sunday || 'Open'
      }`;
    }
    return 'Open year-round with seasonal weather exceptions.';
  })();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-canopy/60 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-park-title"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', duration: 0.45, bounce: 0.15 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-parchment flex flex-col max-h-[90vh] z-10"
          >
            {/* Header Image Stage */}
            <div className="relative h-60 sm:h-72 w-full bg-stone-warm overflow-hidden flex-shrink-0">
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 700px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-canopy/80 via-canopy/20 to-black/30" />

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-canopy shadow-md backdrop-blur-md transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Floating Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-full bg-white/90 text-canopy shadow-sm uppercase border border-parchment">
                  {park.parkCode.toUpperCase()}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-white/90 text-canopy shadow-sm border border-parchment">
                  <MapPin className="w-3.5 h-3.5 text-sinopia" />
                  {park.states}
                </span>
              </div>

              {/* Park Title on Image Banner */}
              <div className="absolute bottom-4 left-4 right-4 z-10">
                {park.designation && (
                  <p className="font-mono text-xs uppercase tracking-wider text-xanthous font-semibold mb-1">
                    {park.designation}
                  </p>
                )}
                <h2
                  id="modal-park-title"
                  className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-sm"
                >
                  {park.fullName}
                </h2>
              </div>
            </div>

            {/* Scrollable Content Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-canopy">
              {/* Description */}
              <p className="text-sm sm:text-base leading-relaxed text-canopy/80">
                {park.description}
              </p>

              {/* Key Insights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Entrance Fee */}
                <div className="bg-stone-warm/60 border border-parchment p-3.5 rounded-2xl flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-forest-green/10 text-forest-green flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Ticket className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-raw-umber font-semibold block">
                      Entrance Fee
                    </span>
                    <p className="text-sm font-bold text-canopy truncate">
                      {feeDisplay}
                    </p>
                  </div>
                </div>

                {/* Operating Hours Preview */}
                <div className="bg-stone-warm/60 border border-parchment p-3.5 rounded-2xl flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-xanthous/20 text-raw-umber flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-raw-umber font-semibold block">
                      Operating Hours
                    </span>
                    <p className="text-xs text-canopy/80 line-clamp-2">
                      {hoursSummary}
                    </p>
                  </div>
                </div>
              </div>

              {/* Weather Info */}
              {park.weatherInfo && (
                <div className="bg-sand/70 border border-parchment p-4 rounded-2xl flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sinopia/10 text-sinopia flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CloudSun className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-raw-umber font-semibold block mb-1">
                      Weather & Climate
                    </span>
                    <p className="text-xs sm:text-sm text-canopy/80 leading-relaxed line-clamp-3">
                      {park.weatherInfo}
                    </p>
                  </div>
                </div>
              )}

              {/* Activities */}
              {park.activities && park.activities.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-raw-umber font-semibold mb-2.5">
                    <Compass className="w-4 h-4 text-forest-green" />
                    <span>Popular Activities ({park.activities.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {park.activities.slice(0, 10).map((act) => (
                      <span
                        key={act.id || act.name}
                        className="text-xs bg-stone-warm text-canopy border border-parchment px-2.5 py-1 rounded-full font-medium"
                      >
                        {act.name}
                      </span>
                    ))}
                    {park.activities.length > 10 && (
                      <span className="text-xs font-mono text-raw-umber px-2 py-1">
                        +{park.activities.length - 10} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 sm:p-5 bg-stone-warm/50 border-t border-parchment flex items-center justify-between gap-3 flex-shrink-0">
              <div className="flex items-center gap-2">
                <FavoriteButton parkCode={park.parkCode} />
                <button
                  type="button"
                  onClick={() => toggleComparison(park.parkCode)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    inComparison
                      ? 'bg-forest-green text-white border-forest-green'
                      : 'bg-white hover:bg-stone-warm text-canopy border-parchment'
                  }`}
                  aria-label={
                    inComparison ? 'Remove from compare' : 'Add to compare'
                  }
                >
                  {inComparison ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>In Compare</span>
                    </>
                  ) : (
                    <>
                      <Scale className="w-3.5 h-3.5 text-forest-green" />
                      <span>Compare</span>
                    </>
                  )}
                </button>
              </div>

              <Link
                href={`/parks/${park.parkCode}`}
                onClick={onClose}
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-forest-green hover:bg-moss text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-forest-green/30"
              >
                <span>View Full Park Page</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
