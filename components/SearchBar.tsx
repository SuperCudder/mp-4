'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onChange?: (query: string) => void;
  className?: string;
}

export default function SearchBar({
  placeholder = "Search for parks by name or state...",
  onSearch,
  onChange,
  className = "",
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleChange = (value: string) => {
    setQuery(value);
    if (onChange) {
      onChange(value);
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
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-gray-800 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sinopia focus:border-xanthous text-white placeholder-gray-400"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-raw-umber text-white font-semibold rounded-lg hover:bg-xanthous hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-forest-green focus:ring-offset-2 shadow-md"
        >
          Search
        </button>
      </div>
    </form>
  );
}
