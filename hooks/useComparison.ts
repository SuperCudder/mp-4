'use client';

import { useState, useEffect, useCallback } from 'react';

const COMPARISON_KEY = 'nps-comparison';
const SYNC_EVENT = 'nps-comparison-sync';
const MAX_COMPARISON = 3;

/**
 * Hook to manage park comparison state (up to 3 parks),
 * synced across components and tabs via localStorage & custom window events.
 */
export function useComparison() {
  const [comparison, setComparison] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadFromStorage = useCallback(() => {
    try {
      const stored = localStorage.getItem(COMPARISON_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setComparison(parsed.slice(0, MAX_COMPARISON));
          return;
        }
      }
      setComparison([]);
    } catch (error) {
      console.error('Error loading comparison:', error);
      setComparison([]);
    }
  }, []);

  useEffect(() => {
    loadFromStorage();
    setIsLoaded(true);

    const handleSync = () => {
      loadFromStorage();
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === COMPARISON_KEY) {
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

  const isInComparison = (parkCode: string): boolean => {
    return comparison.some((c) => c.toLowerCase() === parkCode.toLowerCase());
  };

  const addToComparison = (parkCode: string) => {
    try {
      const stored = localStorage.getItem(COMPARISON_KEY);
      const currentList: string[] = stored ? JSON.parse(stored) : comparison;
      const normalized = parkCode.toLowerCase();

      if (currentList.some((c) => c.toLowerCase() === normalized)) {
        return;
      }

      let nextComparison: string[];
      if (currentList.length >= MAX_COMPARISON) {
        // When 3 slots filled, replace the last item cleanly
        nextComparison = [...currentList.slice(0, MAX_COMPARISON - 1), normalized];
      } else {
        nextComparison = [...currentList, normalized];
      }

      localStorage.setItem(COMPARISON_KEY, JSON.stringify(nextComparison));
      setComparison(nextComparison);
      window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: nextComparison }));
    } catch (error) {
      console.error('Error adding to comparison:', error);
    }
  };

  const removeFromComparison = (parkCode: string) => {
    try {
      const stored = localStorage.getItem(COMPARISON_KEY);
      const currentList: string[] = stored ? JSON.parse(stored) : comparison;
      const nextComparison = currentList.filter(
        (code) => code.toLowerCase() !== parkCode.toLowerCase()
      );

      localStorage.setItem(COMPARISON_KEY, JSON.stringify(nextComparison));
      setComparison(nextComparison);
      window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: nextComparison }));
    } catch (error) {
      console.error('Error removing from comparison:', error);
    }
  };

  const toggleComparison = (parkCode: string) => {
    if (isInComparison(parkCode)) {
      removeFromComparison(parkCode);
    } else {
      addToComparison(parkCode);
    }
  };

  const clearComparison = () => {
    try {
      localStorage.removeItem(COMPARISON_KEY);
      setComparison([]);
      window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: [] }));
    } catch (error) {
      console.error('Error clearing comparison:', error);
    }
  };

  return {
    comparison,
    addToComparison,
    removeFromComparison,
    toggleComparison,
    isInComparison,
    clearComparison,
    isLoaded,
  };
}
