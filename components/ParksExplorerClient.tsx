'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Footprints,
  Camera,
  Tent,
  Binoculars,
  Fish,
  Bike,
  Accessibility,
  LayoutGrid,
  List,
  X,
  RotateCcw,
  ArrowUpDown,
  Search,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { NPSPark } from '@/types/nps';
import ParkCard from './ParkCard';
import ParkQuickViewModal from './ParkQuickViewModal';

interface ParksExplorerClientProps {
  initialParks: NPSPark[];
  states: string[];
  initialState?: string;
  initialSearch?: string;
  initialActivity?: string;
}

const POPULAR_ACTIVITIES = [
  { name: 'Hiking', icon: Footprints },
  { name: 'Photography', icon: Camera },
  { name: 'Camping', icon: Tent },
  { name: 'Wildlife Watching', icon: Binoculars },
  { name: 'Fishing', icon: Fish },
  { name: 'Biking', icon: Bike },
  { name: 'Accessibility', icon: Accessibility },
];

type SortOption = 'name-asc' | 'name-desc' | 'state' | 'activities';

export default function ParksExplorerClient({
  initialParks,
  states,
  initialState = '',
  initialSearch = '',
  initialActivity = '',
}: ParksExplorerClientProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedState, setSelectedState] = useState(initialState);
  const [selectedActivity, setSelectedActivity] = useState(initialActivity);
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [quickViewPark, setQuickViewPark] = useState<NPSPark | null>(null);
  const [showAllStates, setShowAllStates] = useState(false);

  // Sync state to URL without full page reloads
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set('search', searchTerm.trim());
    if (selectedState) params.set('state', selectedState);
    if (selectedActivity) params.set('activity', selectedActivity);

    const queryString = params.toString();
    const newUrl = queryString ? `/parks?${queryString}` : '/parks';
    window.history.replaceState(null, '', newUrl);
  }, [searchTerm, selectedState, selectedActivity]);

  // Real-time filtering
  const filteredParks = useMemo(() => {
    return initialParks.filter((park) => {
      // Search matching (name, state, description, activity)
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const matchesName = park.fullName.toLowerCase().includes(query);
        const matchesCode = park.parkCode.toLowerCase().includes(query);
        const matchesState = park.states.toLowerCase().includes(query);
        const matchesDesc = park.description?.toLowerCase().includes(query);
        const matchesAct = park.activities?.some((a) =>
          a.name.toLowerCase().includes(query)
        );

        if (!matchesName && !matchesCode && !matchesState && !matchesDesc && !matchesAct) {
          return false;
        }
      }

      // State matching
      if (selectedState) {
        const parkStates = park.states
          .split(',')
          .map((s) => s.trim().toUpperCase());
        if (!parkStates.includes(selectedState.toUpperCase())) {
          return false;
        }
      }

      // Activity matching
      if (selectedActivity) {
        const hasAct = park.activities?.some((a) =>
          a.name.toLowerCase().includes(selectedActivity.toLowerCase())
        );
        if (!hasAct) {
          return false;
        }
      }

      return true;
    });
  }, [initialParks, searchTerm, selectedState, selectedActivity]);

  // Real-time sorting
  const sortedParks = useMemo(() => {
    const list = [...filteredParks];
    switch (sortBy) {
      case 'name-asc':
        return list.sort((a, b) => a.fullName.localeCompare(b.fullName));
      case 'name-desc':
        return list.sort((a, b) => b.fullName.localeCompare(a.fullName));
      case 'state':
        return list.sort((a, b) => a.states.localeCompare(b.states));
      case 'activities':
        return list.sort(
          (a, b) => (b.activities?.length || 0) - (a.activities?.length || 0)
        );
      default:
        return list;
    }
  }, [filteredParks, sortBy]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedState('');
    setSelectedActivity('');
    setSortBy('name-asc');
  };

  const hasActiveFilters = Boolean(
    searchTerm.trim() || selectedState || selectedActivity
  );

  const INITIAL_VISIBLE_STATES = 14;
  const visibleStates = showAllStates
    ? states
    : states.slice(0, INITIAL_VISIBLE_STATES);

  return (
    <div className="w-full">
      {/* Header & Interactive Control Station */}
      <section className="bg-stone-warm/60 border-b border-parchment py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <span className="font-mono text-xs uppercase tracking-wider text-raw-umber font-semibold block mb-2">
              National Parks Directory
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-canopy tracking-tight">
              Explore America&apos;s Parks
            </h1>
            <p className="text-sm sm:text-base text-canopy/75 mt-2">
              Instant live filtering across all national parks, monuments, and historical sites.
            </p>
          </div>

          {/* Real-time Interactive Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative flex items-center">
              <div className="absolute left-4 pointer-events-none flex items-center text-forest-green/70">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Live search by name, state, or activity..."
                className="w-full pl-12 pr-12 py-3.5 bg-white/95 border border-parchment focus:border-forest-green focus:ring-2 focus:ring-forest-green/20 text-canopy placeholder-sage/70 rounded-2xl text-base shadow-sm transition-all outline-none"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 p-1.5 text-sage hover:text-canopy rounded-full hover:bg-stone-warm transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* State Filter Pills */}
          <div className="max-w-4xl mx-auto mb-6">
            <p className="text-xs font-mono uppercase tracking-wider text-raw-umber font-semibold mb-2.5 text-center">
              Filter by State or Territory:
            </p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center items-center">
              <button
                type="button"
                onClick={() => setSelectedState('')}
                className={`px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-all shadow-sm ${
                  !selectedState
                    ? 'bg-forest-green text-white shadow-forest-green/20'
                    : 'bg-white/85 text-canopy hover:bg-white border border-parchment'
                }`}
              >
                All States
              </button>
              {visibleStates.map((st) => {
                const isSelected = selectedState === st;
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setSelectedState(isSelected ? '' : st)}
                    className={`px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-all shadow-sm ${
                      isSelected
                        ? 'bg-forest-green text-white shadow-forest-green/20'
                        : 'bg-white/85 text-canopy hover:bg-white border border-parchment'
                    }`}
                  >
                    {st}
                  </button>
                );
              })}
              {states.length > INITIAL_VISIBLE_STATES && (
                <button
                  type="button"
                  onClick={() => setShowAllStates(!showAllStates)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-mono font-medium bg-sand hover:bg-parchment text-raw-umber border border-parchment transition-colors shadow-sm"
                >
                  {showAllStates ? (
                    <>
                      <span>Fewer</span>
                      <ChevronUp className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      <span>+{states.length - INITIAL_VISIBLE_STATES} more</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Activity Filter Chips */}
          <div className="max-w-4xl mx-auto mb-6">
            <p className="text-xs font-mono uppercase tracking-wider text-raw-umber font-semibold mb-2.5 text-center">
              Popular Activities:
            </p>
            <div className="flex flex-wrap gap-2 justify-center items-center">
              <button
                type="button"
                onClick={() => setSelectedActivity('')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all shadow-sm ${
                  !selectedActivity
                    ? 'bg-forest-green text-white shadow-forest-green/20'
                    : 'bg-white/85 text-canopy hover:bg-white border border-parchment'
                }`}
              >
                All Activities
              </button>
              {POPULAR_ACTIVITIES.map((act) => {
                const isSelected = selectedActivity === act.name;
                const IconComponent = act.icon;
                return (
                  <button
                    key={act.name}
                    type="button"
                    onClick={() =>
                      setSelectedActivity(isSelected ? '' : act.name)
                    }
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all shadow-sm ${
                      isSelected
                        ? 'bg-forest-green text-white shadow-forest-green/20'
                        : 'bg-white/85 text-canopy hover:bg-white border border-parchment'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span>{act.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Filter Badges */}
          {hasActiveFilters && (
            <div className="pt-4 border-t border-parchment/60 flex flex-wrap items-center justify-center gap-2">
              <span className="font-mono text-xs text-raw-umber mr-1">
                Active filters:
              </span>

              {searchTerm.trim() && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-white text-canopy border border-parchment shadow-sm">
                  <span>Search: &ldquo;{searchTerm}&rdquo;</span>
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="hover:text-sinopia"
                    aria-label="Remove search filter"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}

              {selectedState && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-white text-canopy border border-parchment shadow-sm font-mono">
                  <span>State: {selectedState}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedState('')}
                    className="hover:text-sinopia"
                    aria-label="Remove state filter"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}

              {selectedActivity && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-white text-canopy border border-parchment shadow-sm">
                  <span>Activity: {selectedActivity}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedActivity('')}
                    className="hover:text-sinopia"
                    aria-label="Remove activity filter"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}

              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-sinopia hover:text-espresso hover:bg-sinopia/10 transition-colors ml-2"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset All</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Main Parks Catalog Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Results Bar: Count, Sort Dropdown, and View Mode Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-parchment">
          <div>
            <p className="font-mono text-sm text-canopy">
              Showing <span className="font-bold text-forest-green">{sortedParks.length}</span> park{sortedParks.length !== 1 ? 's' : ''}
              {hasActiveFilters && (
                <span className="text-canopy/60 ml-1">
                  (filtered from {initialParks.length} total)
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-white border border-parchment rounded-xl px-3 py-1.5 shadow-sm text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-raw-umber" />
              <label htmlFor="park-sort-select" className="font-mono text-canopy/70">
                Sort:
              </label>
              <select
                id="park-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-transparent font-medium text-canopy focus:outline-none cursor-pointer"
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="state">State</option>
                <option value="activities">Most Activities</option>
              </select>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center bg-stone-warm p-1 rounded-xl border border-parchment">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white text-forest-green shadow-sm'
                    : 'text-canopy/60 hover:text-canopy'
                }`}
                title="Grid View"
                aria-label="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-white text-forest-green shadow-sm'
                    : 'text-canopy/60 hover:text-canopy'
                }`}
                title="List View"
                aria-label="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Animated Cards Layout */}
        {sortedParks.length > 0 ? (
          <motion.div
            layout
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'
                : 'flex flex-col gap-4'
            }
          >
            <AnimatePresence mode="popLayout">
              {sortedParks.map((park) => (
                <ParkCard
                  key={park.id}
                  park={park}
                  viewMode={viewMode}
                  onQuickView={(p) => setQuickViewPark(p)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center bg-white border border-parchment rounded-2xl p-12 max-w-xl mx-auto shadow-sm my-8">
            <h3 className="text-xl font-bold text-canopy mb-2">
              No matching parks found
            </h3>
            <p className="text-sm text-canopy/70 mb-6">
              We couldn&apos;t find any parks matching your current filters. Try resetting or adjusting your search term.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-forest-green hover:bg-moss text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}
      </section>

      {/* Shared Quick View Modal for zero duplicate mounts */}
      <ParkQuickViewModal
        park={quickViewPark}
        isOpen={Boolean(quickViewPark)}
        onClose={() => setQuickViewPark(null)}
      />
    </div>
  );
}
