'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Scale,
  ArrowLeft,
  Search,
  X,
  Heart,
  Sparkles,
  Ticket,
  Clock,
  CloudSun,
  MapPin,
  RotateCcw,
  Check,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { NPSPark } from '@/types/nps';
import { useFavorites } from '@/hooks/useFavorites';
import { useComparison } from '@/hooks/useComparison';

function CompareContent() {
  const searchParams = useSearchParams();
  const { favorites, isLoaded: isFavoritesLoaded, isFavorite, toggleFavorite } = useFavorites();
  const {
    comparison,
    addToComparison,
    removeFromComparison,
    clearComparison,
  } = useComparison();

  const [parks, setParks] = useState<NPSPark[]>([]);
  const [selectedParks, setSelectedParks] = useState<(NPSPark | null)[]>([null, null, null]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSlotSearchIndex, setActiveSlotSearchIndex] = useState<number | null>(null);
  const [slotSearchTerms, setSlotSearchTerms] = useState<[string, string, string]>(['', '', '']);

  // Fetch all parks once
  useEffect(() => {
    const fetchParks = async () => {
      try {
        const response = await fetch('/api/parks');
        const data: NPSPark[] = await response.json();
        setParks(data);

        // Pre-populate comparison slots from URL query or comparison hook
        const parksQuery = searchParams.get('parks');
        let initialCodes: string[] = [];

        if (parksQuery) {
          initialCodes = parksQuery
            .split(',')
            .map((c) => c.trim().toLowerCase())
            .filter(Boolean);
        } else if (comparison.length > 0) {
          initialCodes = comparison;
        }

        if (initialCodes.length > 0) {
          const initialSelected: (NPSPark | null)[] = [null, null, null];
          let slotIdx = 0;

          for (const code of initialCodes) {
            if (slotIdx >= 3) break;
            const matched = data.find((p) => p.parkCode.toLowerCase() === code);
            if (matched && !initialSelected.some((s) => s?.id === matched.id)) {
              initialSelected[slotIdx] = matched;
              slotIdx++;
            }
          }

          setSelectedParks(initialSelected);
        }
      } catch (error) {
        console.error('Error fetching parks for comparison:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchParks();
  }, [searchParams, comparison]);

  const updateUrlParams = (currentSelected: (NPSPark | null)[]) => {
    if (typeof window !== 'undefined') {
      const validCodes = currentSelected
        .filter((p): p is NPSPark => Boolean(p))
        .map((p) => p.parkCode.toLowerCase());
      const url = new URL(window.location.href);
      if (validCodes.length > 0) {
        url.searchParams.set('parks', validCodes.join(','));
      } else {
        url.searchParams.delete('parks');
      }
      window.history.replaceState({}, '', url.toString());
    }
  };

  const selectPark = (index: number, park: NPSPark) => {
    const newSelected = [...selectedParks];
    const oldPark = newSelected[index];
    if (oldPark) {
      removeFromComparison(oldPark.parkCode);
    }
    newSelected[index] = park;
    setSelectedParks(newSelected);
    addToComparison(park.parkCode);
    setActiveSlotSearchIndex(null);
    setSlotSearchTerms((prev) => {
      const updated = [...prev] as [string, string, string];
      updated[index] = '';
      return updated;
    });
    updateUrlParams(newSelected);
  };

  const removePark = (index: number) => {
    const target = selectedParks[index];
    if (target) {
      removeFromComparison(target.parkCode);
    }
    const newSelected = [...selectedParks];
    newSelected[index] = null;
    setSelectedParks(newSelected);
    updateUrlParams(newSelected);
  };

  const clearAllSlots = () => {
    const newSelected: (NPSPark | null)[] = [null, null, null];
    setSelectedParks(newSelected);
    clearComparison();
    setActiveSlotSearchIndex(null);
    updateUrlParams(newSelected);
  };

  // Quick fill empty slots from user favorites
  const favoriteParksList = useMemo(() => {
    if (!isFavoritesLoaded || favorites.length === 0 || parks.length === 0) return [];
    return favorites
      .map((code) => parks.find((p) => p.parkCode.toLowerCase() === code.toLowerCase()))
      .filter((p): p is NPSPark => Boolean(p));
  }, [favorites, isFavoritesLoaded, parks]);

  const handleQuickAddFavorite = (park: NPSPark) => {
    if (selectedParks.some((p) => p?.id === park.id)) return;

    const emptyIndex = selectedParks.findIndex((p) => p === null);
    if (emptyIndex !== -1) {
      selectPark(emptyIndex, park);
    } else {
      selectPark(0, park);
    }
  };

  const handleLoadTopFavorites = () => {
    const newSelected = [...selectedParks];
    for (const fav of favoriteParksList) {
      const alreadySelected = newSelected.some((p) => p?.id === fav.id);
      if (!alreadySelected) {
        const emptyIndex = newSelected.findIndex((p) => p === null);
        if (emptyIndex !== -1) {
          newSelected[emptyIndex] = fav;
          addToComparison(fav.parkCode);
        }
      }
    }
    setSelectedParks(newSelected);
    updateUrlParams(newSelected);
  };

  // Compute shared activities across 2 or more selected parks
  const sharedActivities = useMemo(() => {
    const activeParks = selectedParks.filter((p): p is NPSPark => Boolean(p));
    if (activeParks.length < 2) return new Set<string>();

    const activityCounts: Record<string, number> = {};
    activeParks.forEach((park) => {
      const seenInThisPark = new Set<string>();
      park.activities?.forEach((act) => {
        if (!seenInThisPark.has(act.name)) {
          seenInThisPark.add(act.name);
          activityCounts[act.name] = (activityCounts[act.name] || 0) + 1;
        }
      });
    });

    return new Set(
      Object.entries(activityCounts)
        .filter(([, count]) => count >= 2)
        .map(([name]) => name)
    );
  }, [selectedParks]);

  const activeSelectedCount = selectedParks.filter(Boolean).length;

  return (
    <div className="bg-alabaster min-h-screen text-canopy selection:bg-moss/20">
      {/* Header Section */}
      <section className="bg-white border-b border-parchment py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <Link
              href="/parks"
              className="inline-flex items-center gap-2 text-stone-600 hover:text-canopy bg-stone-warm/80 hover:bg-stone-warm px-3.5 py-1.5 rounded-full border border-parchment text-xs font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Parks</span>
            </Link>

            {activeSelectedCount > 0 && (
              <button
                onClick={clearAllSlots}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-stone-500 hover:text-sinopia transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Comparison ({activeSelectedCount}/3)</span>
              </button>
            )}
          </div>

          <div className="max-w-3xl space-y-2">
            <div className="flex items-center gap-2 text-moss">
              <Scale className="w-5 h-5 text-forest-green" />
              <span className="font-mono text-xs uppercase tracking-widest font-semibold">
                Side-by-Side Comparison
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-canopy">
              Compare Parks
            </h1>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-sans">
              Compare features, activities, and entrance fees across up to 3 national parks side by side.
            </p>
          </div>

          {/* Quick-Fill From Favorites Bar */}
          {favoriteParksList.length > 0 && (
            <div className="pt-4 border-t border-parchment flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-canopy">
                <Heart className="w-4 h-4 text-sinopia fill-sinopia" />
                <span>Saved Favorites:</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {favoriteParksList.slice(0, 6).map((fav) => {
                  const isSelected = selectedParks.some((p) => p?.id === fav.id);
                  return (
                    <button
                      key={fav.id}
                      onClick={() => handleQuickAddFavorite(fav)}
                      disabled={isSelected}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all border ${
                        isSelected
                          ? 'bg-stone-warm/50 text-stone-400 border-parchment/60 cursor-default'
                          : 'bg-white hover:bg-forest-green hover:text-white text-canopy border-parchment shadow-sm'
                      }`}
                    >
                      <span>{fav.name}</span>
                      {isSelected ? (
                        <Check className="w-3 h-3 text-moss" />
                      ) : (
                        <span className="text-moss hover:text-white font-mono font-bold">+</span>
                      )}
                    </button>
                  );
                })}

                {activeSelectedCount < 3 && favoriteParksList.length > 1 && (
                  <button
                    onClick={handleLoadTopFavorites}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sand hover:bg-stone-warm text-forest-green border border-parchment transition-colors shadow-sm ml-auto sm:ml-0"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-forest-green" />
                    <span>Compare Top Favorites</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main 3-Slot Comparison Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {selectedParks.map((park, slotIndex) => {
            const currentSearchTerm = slotSearchTerms[slotIndex];

            // Filter available parks for slot picker
            const slotFilteredParks = parks.filter((candidate) => {
              const alreadySelectedElsewhere = selectedParks.some(
                (p, idx) => idx !== slotIndex && p?.id === candidate.id
              );
              if (alreadySelectedElsewhere) return false;

              if (!currentSearchTerm.trim()) return true;
              const q = currentSearchTerm.toLowerCase();
              return (
                candidate.fullName.toLowerCase().includes(q) ||
                candidate.states.toLowerCase().includes(q) ||
                candidate.parkCode.toLowerCase().includes(q)
              );
            });

            return (
              <motion.div
                key={slotIndex}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-parchment rounded-2xl shadow-eco overflow-hidden flex flex-col transition-shadow hover:shadow-eco-hover"
              >
                {park && activeSlotSearchIndex !== slotIndex ? (
                  /* ======================================================== */
                  /* FILLED PARK COLUMN */
                  /* ======================================================== */
                  <div className="flex flex-col h-full">
                    {/* Park Header Image */}
                    <div className="relative h-56 w-full bg-sand overflow-hidden">
                      {park.images?.[0]?.url ? (
                        <Image
                          src={park.images[0].url}
                          alt={park.images[0].altText || park.fullName}
                          fill
                          className="object-cover transition-transform duration-500 hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-400 font-mono text-xs">
                          No photo available
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-canopy/90 via-canopy/20 to-transparent" />

                      {/* Top Action Buttons */}
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                        <button
                          onClick={() => toggleFavorite(park.parkCode)}
                          className={`p-1.5 rounded-full backdrop-blur-md border border-white/20 transition-all ${
                            isFavorite(park.parkCode)
                              ? 'bg-sinopia text-white'
                              : 'bg-black/50 hover:bg-black/75 text-white'
                          }`}
                          title={
                            isFavorite(park.parkCode)
                              ? 'Remove from Favorites'
                              : 'Add to Favorites'
                          }
                          aria-label="Toggle Favorite"
                        >
                          <Heart
                            className={`w-3.5 h-3.5 ${
                              isFavorite(park.parkCode) ? 'fill-white' : ''
                            }`}
                          />
                        </button>
                        <button
                          onClick={() => setActiveSlotSearchIndex(slotIndex)}
                          className="bg-black/50 hover:bg-black/75 backdrop-blur-md text-sand hover:text-white px-2.5 py-1 rounded-full text-[11px] font-medium border border-white/20 transition-colors shadow-sm flex items-center gap-1"
                          title="Swap park for this slot"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Swap</span>
                        </button>
                        <button
                          onClick={() => removePark(slotIndex)}
                          className="bg-black/50 hover:bg-sinopia backdrop-blur-md text-white p-1.5 rounded-full border border-white/20 transition-colors shadow-sm"
                          title="Remove from comparison"
                          aria-label="Remove park"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Badges */}
                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-mono text-sand">
                        <span className="bg-forest-green/90 backdrop-blur-sm px-2.5 py-0.5 rounded-full border border-white/10 uppercase tracking-widest text-[10px]">
                          {park.parkCode.toUpperCase()}
                        </span>
                        <span className="bg-black/50 backdrop-blur-sm px-2.5 py-0.5 rounded-full border border-white/10 text-[11px] flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-xanthous" />
                          {park.states}
                        </span>
                      </div>
                    </div>

                    {/* Park Identity & Details Body */}
                    <div className="p-5 flex-1 flex flex-col space-y-5">
                      <div>
                        <span className="text-[10px] font-mono text-sage uppercase tracking-wider block">
                          {park.designation || 'National Park'}
                        </span>
                        <h2 className="text-xl font-bold text-canopy leading-snug line-clamp-2">
                          {park.fullName}
                        </h2>
                      </div>

                      {/* Entrance Fee Matrix Row */}
                      <div className="p-3.5 rounded-xl bg-stone-warm/60 border border-parchment space-y-1">
                        <div className="flex items-center justify-between text-xs text-sage font-medium">
                          <div className="flex items-center gap-1.5">
                            <Ticket className="w-3.5 h-3.5 text-forest-green" />
                            <span>Standard Entrance Fee</span>
                          </div>
                          {(!park.entranceFees?.[0]?.cost ||
                            Number(park.entranceFees?.[0]?.cost) === 0) && (
                            <span className="text-[10px] uppercase font-bold text-forest-green bg-sage-light px-2 py-0.5 rounded-full">
                              Free Entry
                            </span>
                          )}
                        </div>
                        <p className="font-mono text-xl font-bold text-forest-green">
                          {park.entranceFees?.[0]?.cost && Number(park.entranceFees[0].cost) > 0
                            ? `$${park.entranceFees[0].cost}`
                            : 'Free Admission'}
                        </p>
                        {park.entranceFees?.[0]?.title && (
                          <p className="text-[11px] text-stone-500 line-clamp-1">
                            {park.entranceFees[0].title}
                          </p>
                        )}
                      </div>

                      {/* Operating Hours Summary */}
                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center gap-1.5 text-sage font-medium">
                          <Clock className="w-3.5 h-3.5 text-moss" />
                          <span>Operating Schedule</span>
                        </div>
                        <p className="text-stone-600 line-clamp-2 leading-relaxed bg-sand/50 p-2.5 rounded-xl border border-parchment/60 font-sans">
                          {park.operatingHours?.[0]?.description ||
                            'Open year-round with seasonal facility schedules.'}
                        </p>
                      </div>

                      {/* Climate & Weather */}
                      {park.weatherInfo && (
                        <div className="space-y-1.5 text-xs">
                          <div className="flex items-center gap-1.5 text-sage font-medium">
                            <CloudSun className="w-3.5 h-3.5 text-moss" />
                            <span>Weather & Climate</span>
                          </div>
                          <p className="text-stone-600 line-clamp-3 leading-relaxed bg-sand/50 p-2.5 rounded-xl border border-parchment/60 font-sans">
                            {park.weatherInfo}
                          </p>
                        </div>
                      )}

                      {/* Shared & Total Activities Visualizer */}
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-sage flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-forest-green" />
                            Activities
                          </span>
                          <span className="font-mono text-stone-500 text-[11px]">
                            {park.activities?.length || 0} total
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {park.activities?.slice(0, 8).map((activity) => {
                            const isShared = sharedActivities.has(activity.name);
                            return (
                              <span
                                key={activity.id}
                                className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${
                                  isShared
                                    ? 'bg-sage-light text-forest-green border-moss/40 font-semibold flex items-center gap-1 shadow-sm'
                                    : 'bg-stone-warm text-stone-700 border-parchment'
                                }`}
                                title={
                                  isShared
                                    ? 'Shared across 2 or more selected parks!'
                                    : undefined
                                }
                              >
                                {isShared && <Sparkles className="w-2.5 h-2.5 text-moss" />}
                                {activity.name}
                              </span>
                            );
                          })}
                          {(park.activities?.length || 0) > 8 && (
                            <span className="text-[10px] font-mono text-stone-400 self-center px-1">
                              +{(park.activities?.length || 0) - 8} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Link to Full Park Details */}
                      <div className="pt-3 border-t border-parchment">
                        <Link
                          href={`/parks/${park.parkCode}`}
                          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-forest-green hover:bg-moss text-white rounded-xl text-xs font-semibold transition-colors shadow-eco"
                        >
                          <span>View Full Park Details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ======================================================== */
                  /* EMPTY SLOT / INLINE INSTANT SEARCH COMBOBOX */
                  /* ======================================================== */
                  <div className="p-6 flex flex-col h-full min-h-[500px] justify-between">
                    <div className="space-y-4">
                      {/* Slot Header */}
                      <div className="flex items-center justify-between border-b border-parchment pb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-stone-warm text-canopy font-mono text-xs flex items-center justify-center font-bold border border-parchment">
                            {slotIndex + 1}
                          </span>
                          <span className="font-mono text-xs text-sage uppercase tracking-wider">
                            Comparison Slot {slotIndex + 1} of 3
                          </span>
                        </div>

                        {park && activeSlotSearchIndex === slotIndex && (
                          <button
                            onClick={() => setActiveSlotSearchIndex(null)}
                            className="text-xs text-stone-500 hover:text-canopy font-mono"
                          >
                            Cancel
                          </button>
                        )}
                      </div>

                      {/* Search Input for this Slot */}
                      <div className="relative">
                        <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          placeholder="Search by park name, state, or code..."
                          value={currentSearchTerm}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSlotSearchTerms((prev) => {
                              const updated = [...prev] as [string, string, string];
                              updated[slotIndex] = val;
                              return updated;
                            });
                          }}
                          className="w-full pl-9 pr-8 py-2.5 bg-stone-warm/50 border border-parchment rounded-xl text-xs text-canopy placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-forest-green focus:bg-white transition-all font-sans"
                        />
                        {currentSearchTerm && (
                          <button
                            onClick={() => {
                              setSlotSearchTerms((prev) => {
                                const updated = [...prev] as [string, string, string];
                                updated[slotIndex] = '';
                                return updated;
                              });
                            }}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Instant Filtered Results List */}
                      <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
                        {isLoading ? (
                          <div className="p-6 text-center text-xs text-stone-400 font-mono">
                            Loading parks...
                          </div>
                        ) : slotFilteredParks.length === 0 ? (
                          <div className="p-6 text-center text-xs text-stone-400 font-sans">
                            No unselected parks match &ldquo;{currentSearchTerm}&rdquo;
                          </div>
                        ) : (
                          slotFilteredParks.slice(0, 10).map((candidate) => (
                            <button
                              key={candidate.id}
                              onClick={() => selectPark(slotIndex, candidate)}
                              className="w-full text-left p-3 rounded-xl border border-parchment hover:border-moss/40 hover:bg-stone-warm/70 transition-all flex items-center justify-between group"
                            >
                              <div className="min-w-0 pr-2">
                                <p className="font-semibold text-xs text-canopy truncate group-hover:text-forest-green">
                                  {candidate.fullName}
                                </p>
                                <p className="font-mono text-[10px] text-stone-500">
                                  {candidate.states} • {candidate.parkCode.toUpperCase()}
                                </p>
                              </div>
                              <span className="text-xs font-mono font-semibold text-moss opacity-0 group-hover:opacity-100 transition-opacity">
                                Add +
                              </span>
                            </button>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-parchment text-center">
                      <p className="text-[11px] text-stone-400 font-mono">
                        Select a park to compare features
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Comparison Guide & Tips */}
        <div className="mt-10 bg-white border border-parchment p-6 sm:p-8 rounded-2xl shadow-eco">
          <div className="flex items-center gap-2.5 mb-3 text-forest-green">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-bold text-canopy text-base sm:text-lg">
              Comparison Guide
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-stone-600 font-sans">
            <div className="p-3.5 bg-stone-warm/40 rounded-xl border border-parchment/60 space-y-1">
              <span className="font-semibold text-canopy block font-mono">Entrance Fees</span>
              <p>Compare standard vehicle passes and free entry days to plan trip expenses.</p>
            </div>
            <div className="p-3.5 bg-stone-warm/40 rounded-xl border border-parchment/60 space-y-1">
              <span className="font-semibold text-canopy block font-mono">Shared Activities</span>
              <p>Highlighted green badges indicate experiences offered across 2 or more selected parks.</p>
            </div>
            <div className="p-3.5 bg-stone-warm/40 rounded-xl border border-parchment/60 space-y-1">
              <span className="font-semibold text-canopy block font-mono">Operating Schedules</span>
              <p>Review season-specific facility schedules and visitor center open hours.</p>
            </div>
            <div className="p-3.5 bg-stone-warm/40 rounded-xl border border-parchment/60 space-y-1">
              <span className="font-semibold text-canopy block font-mono">Real-Time Alerts</span>
              <p>Visit the dedicated park page for current safety notices, road conditions, and closures.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="bg-alabaster min-h-screen p-8 text-center flex items-center justify-center font-mono text-sm text-canopy">
          Loading comparison...
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  );
}
