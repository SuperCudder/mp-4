'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, X, ArrowRight, Trash2 } from 'lucide-react';
import { useComparison } from '@/hooks/useComparison';

export default function CompareDock() {
  const { comparison, removeFromComparison, clearComparison, isLoaded } = useComparison();

  if (!isLoaded || comparison.length === 0) {
    return null;
  }

  const compareUrl = `/compare?parks=${encodeURIComponent(comparison.join(','))}`;

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ y: 80, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 80, opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-[95vw] sm:max-w-xl w-full px-2"
        aria-label="Comparison Tray"
      >
        <div className="bg-white/95 backdrop-blur-md border border-parchment/90 rounded-2xl shadow-eco-hover p-2.5 sm:p-3 flex items-center justify-between gap-3">
          {/* Left: Indicator & Park Badges */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="hidden xs:flex items-center justify-center w-8 h-8 rounded-xl bg-forest-green/10 text-forest-green flex-shrink-0">
              <Scale className="w-4 h-4" />
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {comparison.map((code) => (
                <motion.span
                  key={code}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="inline-flex items-center gap-1 font-mono text-xs font-bold uppercase bg-stone-warm text-canopy px-2.5 py-1 rounded-lg border border-parchment"
                >
                  <span>{code}</span>
                  <button
                    type="button"
                    onClick={() => removeFromComparison(code)}
                    className="p-0.5 rounded hover:bg-parchment text-canopy/60 hover:text-sinopia transition-colors"
                    aria-label={`Remove ${code} from comparison`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.span>
              ))}

              {/* Empty placeholder slots up to 3 */}
              {Array.from({ length: 3 - comparison.length }).map((_, i) => (
                <span
                  key={`empty-${i}`}
                  className="hidden sm:inline-flex items-center font-mono text-[11px] text-canopy/35 border border-dashed border-parchment px-2 py-1 rounded-lg"
                >
                  + Add
                </span>
              ))}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              type="button"
              onClick={clearComparison}
              className="p-2 text-canopy/60 hover:text-sinopia rounded-xl hover:bg-stone-warm transition-colors"
              title="Clear comparison"
              aria-label="Clear comparison list"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <Link
              href={compareUrl}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 bg-forest-green hover:bg-moss text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-forest-green/30"
            >
              <span>Compare ({comparison.length}/3)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
