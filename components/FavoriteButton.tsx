'use client';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';

interface FavoriteButtonProps {
  parkCode: string;
  className?: string;
}

export default function FavoriteButton({ parkCode, className = '' }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite, isLoaded } = useFavorites();

  if (!isLoaded) {
    return null; // dont render until localStorage is loaded
  }

  const favorited = isFavorite(parkCode);

  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.85 }}
      onClick={(e) => {
        e.preventDefault(); // prevent nav if inside a link
        e.stopPropagation();
        toggleFavorite(parkCode);
      }}
      className={`inline-flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-forest-green ${
        className || 'p-2.5 rounded-full bg-white/85 backdrop-blur-md border border-parchment/80 shadow-sm hover:bg-white'
      }`}
      title={favorited ? 'Remove from favorites' : 'Add to favorites'}
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart
        className={`w-5 h-5 transition-colors ${
          favorited
            ? 'fill-sinopia text-sinopia'
            : 'text-canopy/70 hover:text-sinopia'
        }`}
      />
    </motion.button>
  );
}
