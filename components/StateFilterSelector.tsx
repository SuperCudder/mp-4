'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface StateFilterSelectorProps {
  states: string[];
  activeState?: string;
  currentActivity?: string;
  currentSearch?: string;
}

export default function StateFilterSelector({
  states,
  activeState,
  currentActivity,
  currentSearch,
}: StateFilterSelectorProps) {
  const INITIAL_VISIBLE_COUNT = 14;
  const isSelectedOutsideInitial =
    activeState && states.slice(INITIAL_VISIBLE_COUNT).includes(activeState);

  const [expanded, setExpanded] = useState<boolean>(!!isSelectedOutsideInitial);

  const visibleStates = expanded ? states : states.slice(0, INITIAL_VISIBLE_COUNT);
  const remainingCount = Math.max(0, states.length - INITIAL_VISIBLE_COUNT);

  // Helper to build URL preserving other query params
  const buildUrl = (stateCode: string | null) => {
    const params = new URLSearchParams();
    if (currentSearch) params.set('search', currentSearch);
    if (stateCode) params.set('state', stateCode);
    if (currentActivity) params.set('activity', currentActivity);

    const queryStr = params.toString();
    return queryStr ? `/parks?${queryStr}` : '/parks';
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 justify-center items-center">
        {/* All States Button */}
        <Link
          href={buildUrl(null)}
          className={`px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-all shadow-sm ${
            !activeState
              ? 'bg-forest-green text-white shadow-forest-green/20'
              : 'bg-white/85 text-canopy hover:bg-white border border-parchment hover:border-forest-green/40'
          }`}
        >
          All States
        </Link>

        {/* State Pills */}
        {visibleStates.map((s) => {
          const isSelected = activeState === s;
          return (
            <Link
              key={s}
              href={buildUrl(isSelected ? null : s)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-all shadow-sm ${
                isSelected
                  ? 'bg-forest-green text-white shadow-forest-green/20'
                  : 'bg-white/85 text-canopy hover:bg-white border border-parchment hover:border-forest-green/40'
              }`}
            >
              {s}
            </Link>
          );
        })}

        {/* Expand / Collapse Button */}
        {remainingCount > 0 && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-mono font-medium bg-sand hover:bg-parchment text-raw-umber border border-parchment transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-forest-green/30"
          >
            {expanded ? (
              <>
                <span>Show fewer states</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <span>+{remainingCount} more states</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
