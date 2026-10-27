'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  GitCompare,
  Trash2,
  Compass,
  Sparkles,
  ArrowLeft,
  X,
  Check,
} from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { NPSPark } from '@/types/nps';
import ParkCard from '@/components/ParkCard';

export default function FavoritesPage() {
  const { favorites, clearFavorites, isLoaded } = useFavorites();
  const [favoritedParks, setFavoritedParks] = useState<NPSPark[]>([]);
  const [isLoadingParks, setIsLoadingParks] = useState(true);
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);

  useEffect(() => {
    if (isLoaded && favorites.length > 0) {
      // Fetch details for all favorited parks
      const fetchFavorites = async () => {
        try {
          const response = await fetch('/api/parks');
          const allParks: NPSPark[] = await response.json();
          const filtered = allParks.filter((park) =>
            favorites.some((code) => code.toLowerCase() === park.parkCode.toLowerCase())
          );
          setFavoritedParks(filtered);
        } catch (error) {
          console.error('Error fetching favorite parks:', error);
        } finally {
          setIsLoadingParks(false);
        }
      };

      fetchFavorites();
    } else if (isLoaded) {
      setFavoritedParks([]);
      setIsLoadingParks(false);
    }
  }, [favorites, isLoaded]);

  const executeClearAll = () => {
    clearFavorites();
    setFavoritedParks([]);
    setIsConfirmingClear(false);
  };

  // Loading skeleton state
  if (!isLoaded || isLoadingParks) {
    return (
      <div className="bg-alabaster min-h-screen text-canopy selection:bg-moss/20">
        <section className="bg-white border-b border-parchment py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-4">
            <div className="h-8 w-32 bg-stone-warm rounded-full animate-pulse" />
            <div className="h-10 w-64 bg-stone-warm rounded-xl animate-pulse" />
            <div className="h-4 w-80 bg-stone-warm rounded animate-pulse" />
          </div>
        </section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="inline-flex items-center gap-2 text-stone-500 font-sans text-sm">
            <Compass className="w-5 h-5 animate-spin text-forest-green" />
            <span>Loading your saved parks...</span>
          </div>
        </div>
      </div>
    );
  }

  const compareUrl = `/compare?parks=${favorites.slice(0, 3).join(',')}`;

  return (
    <div className="bg-alabaster min-h-screen text-canopy selection:bg-moss/20">
      {/* Header Section */}
      <section className="bg-white border-b border-parchment py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <Link
            href="/parks"
            className="inline-flex items-center gap-2 text-stone-600 hover:text-canopy bg-stone-warm/80 hover:bg-stone-warm px-3.5 py-1.5 rounded-full border border-parchment text-xs font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Parks</span>
          </Link>

          <div className="max-w-3xl space-y-2">
            <div className="flex items-center gap-2 text-moss">
              <Heart className="w-5 h-5 text-sinopia fill-sinopia" />
              <span className="font-mono text-xs uppercase tracking-widest font-semibold">
                Saved Parks
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-canopy">
              Favorite Parks
            </h1>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-sans">
              Your saved collection of national parks. Compare features, check alerts, and plan your visits.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {favorites.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white border border-parchment rounded-3xl shadow-eco p-10 sm:p-16 text-center max-w-2xl mx-auto space-y-6"
          >
            <div className="w-20 h-20 rounded-full bg-stone-warm text-stone-400 flex items-center justify-center mx-auto border border-parchment">
              <Heart className="w-10 h-10 stroke-[1.5]" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-canopy">
                No Favorite Parks Yet
              </h2>
              <p className="text-stone-600 text-sm leading-relaxed font-sans max-w-md mx-auto">
                Explore national parks and click the heart icon on any park card to save it to your favorites for quick access.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/parks"
                className="inline-flex items-center gap-2 px-6 py-3 bg-forest-green hover:bg-moss text-white font-semibold rounded-xl text-sm transition-all shadow-eco hover:shadow-eco-hover"
              >
                <Compass className="w-4 h-4" />
                <span>Browse Parks</span>
              </Link>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Actions Bar */}
            <div className="bg-white border border-parchment rounded-2xl shadow-eco p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-mono text-stone-600">
                <span className="w-2 h-2 rounded-full bg-moss" />
                <span>
                  Showing <strong className="text-canopy">{favoritedParks.length}</strong> saved park
                  {favoritedParks.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
                {/* 1-Click Compare Favorites Button */}
                <Link
                  href={compareUrl}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-forest-green hover:bg-moss text-white text-xs font-semibold rounded-xl transition-all shadow-sm"
                >
                  <GitCompare className="w-4 h-4 text-xanthous" />
                  <span>Compare All Saved ({Math.min(favorites.length, 3)})</span>
                </Link>

                {/* Clear All Favorites with Inline Confirmation */}
                {!isConfirmingClear ? (
                  <button
                    onClick={() => setIsConfirmingClear(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-stone-600 hover:text-sinopia bg-stone-warm/50 hover:bg-sinopia/10 border border-parchment rounded-xl transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All</span>
                  </button>
                ) : (
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="inline-flex items-center gap-2 bg-sinopia/10 border border-sinopia/30 p-1.5 rounded-xl text-xs"
                    >
                      <span className="text-sinopia font-semibold pl-2">
                        Clear all {favorites.length} saved?
                      </span>
                      <button
                        onClick={executeClearAll}
                        className="px-2.5 py-1 bg-sinopia hover:bg-sinopia/90 text-white rounded-lg font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Check className="w-3 h-3" />
                        <span>Yes</span>
                      </button>
                      <button
                        onClick={() => setIsConfirmingClear(false)}
                        className="px-2.5 py-1 bg-white hover:bg-stone-warm text-stone-700 rounded-lg font-medium border border-parchment transition-colors"
                      >
                        <X className="w-3 h-3" />
                        <span>Cancel</span>
                      </button>
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            </div>

            {/* Favorites Grid */}
            {favoritedParks.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {favoritedParks.map((park) => (
                  <div key={park.id} className="relative group">
                    <ParkCard park={park} />
                  </div>
                ))}
              </motion.div>
            ) : (
              <div className="bg-white border border-parchment rounded-2xl p-8 text-center text-stone-500 font-sans text-sm">
                Some saved park details are currently loading from the National Park Service.
              </div>
            )}

            {/* Favorites Guide & Quick Tips */}
            <div className="bg-white border border-parchment rounded-2xl shadow-eco p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-2 text-forest-green">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-bold text-canopy text-base sm:text-lg">
                  Favorites Guide
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-stone-600 font-sans pt-2">
                <div className="p-3.5 bg-stone-warm/40 rounded-xl border border-parchment/60 space-y-1">
                  <span className="font-semibold text-canopy block font-mono">Compare Parks</span>
                  <p>Use the Compare Saved button to view up to 3 saved parks side-by-side.</p>
                </div>
                <div className="p-3.5 bg-stone-warm/40 rounded-xl border border-parchment/60 space-y-1">
                  <span className="font-semibold text-canopy block font-mono">Current Alerts</span>
                  <p>Check the active alerts feed for road closures and weather hazards before visiting.</p>
                </div>
                <div className="p-3.5 bg-stone-warm/40 rounded-xl border border-parchment/60 space-y-1">
                  <span className="font-semibold text-canopy block font-mono">Saved in Browser</span>
                  <p>Your saved parks are stored safely in local browser storage across visits.</p>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
