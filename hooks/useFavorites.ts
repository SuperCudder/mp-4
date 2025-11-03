'use client';

/* client side fav tracking so users can quickly and easily find their chosen relevant parks and services */
import { useState, useEffect } from 'react';

const FAVORITES_KEY = 'nps-favorites';
/* custom hook for favs */
export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  /* load favs from local (browser) on mount */
  useEffect(() => { /* hook does not update on fav change */
    try { /* try catch for err handling but mostly for lazy logging */
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) { /* if favs parse as json or throw if nothing found*/
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
    setIsLoaded(true);
  }, []);

  /* save favorites to local whenever changed */
  useEffect(() => { /* hook updates on fav change */
    if (isLoaded) {
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites)); /* map to string for later processing */
      } catch (error) {
        console.error('Error saving favorites:', error);
      }
    }
  }, [favorites, isLoaded]);

  const isFavorite = (parkCode: string) => favorites.includes(parkCode);

  /* toggle func for fav button */
  const toggleFavorite = (parkCode: string) => {
      setFavorites((prev) =>
          isFavorite(parkCode) /* check if park code is fav, if it isnt add it if it is remove it */
              ? prev.filter((code) => code !== parkCode)
              : [...prev, parkCode] //add
      );
  };

  const clearFavorites = () => setFavorites([]);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    isLoaded,
  };
}
