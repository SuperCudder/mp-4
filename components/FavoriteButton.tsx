'use client';

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
    <button
      onClick={(e) => {
        e.preventDefault(); // prevent nav if inside a link
        toggleFavorite(parkCode);
      }}
      className={`transition-all ${className}`}
      title={favorited ? 'Remove from favorites' : 'Add to favorites'}
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <span className="text-2xl">
        {favorited ? '❤️' : '🤍'}
      </span>
    </button>
  );
}
