'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onChange?: (query: string) => void;
  className?: string;
  defaultValue?: string;
}

export default function SearchBar({
  placeholder = "Search for parks by name or state...",
  onSearch,
  onChange,
  className = "",
  defaultValue = "",
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);
  const router = useRouter();

  useEffect(() => {
    if (defaultValue !== undefined) {
      setQuery(defaultValue);
    }
  }, [defaultValue]);

  const handleChange = (value: string) => {
    setQuery(value);
    if (onChange) {
      onChange(value);
    }
  };

  const handleClear = () => {
    setQuery('');
    if (onChange) {
      onChange('');
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (query.trim()) {
      if (onSearch) {
        onSearch(query.trim());
      } else {
        // default behavior > nav to parks page with query
        router.push(`/parks?search=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`w-full ${className}`}>
      <div className="relative flex items-center">
        <div className="absolute left-4 pointer-events-none flex items-center text-forest-green/70">
          <Search className="w-5 h-5" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-28 sm:pr-32 py-3.5 bg-white/90 border border-parchment focus:border-forest-green focus:ring-2 focus:ring-forest-green/15 text-canopy placeholder-sage/70 rounded-2xl text-base shadow-sm transition-all outline-none"
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-24 sm:right-28 p-1.5 text-sage hover:text-canopy rounded-full hover:bg-stone-warm transition-colors"
            title="Clear search"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          type="submit"
          className="absolute right-2 px-3.5 sm:px-4 py-2 bg-forest-green hover:bg-moss text-white font-medium rounded-xl transition-all duration-200 flex items-center gap-1.5 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-forest-green/30"
          aria-label="Submit search"
        >
          <span className="hidden xs:inline sm:inline">Search</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
