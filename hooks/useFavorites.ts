'use client';

/* client side fav tracking so users can quickly and easily find their chosen relevant parks and services */
import { useState, useEffect, useCallback } from 'react';

const FAVORITES_KEY = 'nps-favorites';
const SYNC_EVENT = 'nps-favorites-sync';

/* custom hook for favs */
export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadFromStorage = useCallback(() => {
    try {
      /* if favs parse as json or catch if nothing found */
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }, []);

  /* load favs from local (browser) on mount and register cross-component sync listeners */
  useEffect(() => {
    loadFromStorage();
    setIsLoaded(true);

    const handleSync = () => {
      loadFromStorage();
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === FAVORITES_KEY) {
        loadFromStorage();
      }
    };

    window.addEventListener(SYNC_EVENT, handleSync);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener(SYNC_EVENT, handleSync);
      window.removeEventListener('storage', handleStorage);
    };
  }, [loadFromStorage]);

  const isFavorite = (parkCode: string) => favorites.includes(parkCode);

  /* toggle func for fav button */
  const toggleFavorite = (parkCode: string) => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      const currentList: string[] = stored ? JSON.parse(stored) : favorites;
      const nextFavorites = currentList.includes(parkCode)
        ? currentList.filter((code) => code !== parkCode)
        : [...currentList, parkCode];

      localStorage.setItem(FAVORITES_KEY, JSON.stringify(nextFavorites));
      setFavorites(nextFavorites);
      window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: nextFavorites }));
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const clearFavorites = () => {
    try {
      localStorage.removeItem(FAVORITES_KEY);
      setFavorites([]);
      window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: [] }));
    } catch (error) {
      console.error('Error clearing favorites:', error);
    }
  };

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    isLoaded,
  };
}
