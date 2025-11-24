import { useState, useEffect } from 'react';

const FAVORITES_KEY = 'genshin_archive_favorites';

export function useFavorites(type: 'characters' | 'teams' | 'builds') {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(`${FAVORITES_KEY}_${type}`);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (e) {
        console.error(`Failed to parse ${type} favorites:`, e);
      }
    }
    setIsLoaded(true);
  }, [type]);

  // Save to localStorage whenever favorites change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(`${FAVORITES_KEY}_${type}`, JSON.stringify(favorites));
    }
  }, [favorites, type, isLoaded]);

  const isFavorited = (id: string) => favorites.includes(id);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id)
        ? prev.filter((fav) => fav !== id)
        : [...prev, id]
    );
  };

  const addFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((fav) => fav !== id));
  };

  return {
    favorites,
    isFavorited,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    isLoaded,
  };
}
