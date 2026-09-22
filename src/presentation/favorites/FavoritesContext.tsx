import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { PokemonSummary } from '../../domain/models/PokemonSummary';

interface FavoritesContextValue {
  favorites: PokemonSummary[];
  isFavorite: (pokemonId: number) => boolean;
  toggleFavorite: (pokemon: PokemonSummary) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

export function FavoritesProvider({ children }: PropsWithChildren) {
  const [favoritesById, setFavoritesById] = useState<Map<number, PokemonSummary>>(new Map());

  const toggleFavorite = useCallback((pokemon: PokemonSummary) => {
    setFavoritesById((previous) => {
      const next = new Map(previous);
      if (next.has(pokemon.id)) {
        next.delete(pokemon.id);
      } else {
        next.set(pokemon.id, pokemon);
      }
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (pokemonId: number) => favoritesById.has(pokemonId),
    [favoritesById]
  );

  const value = useMemo<FavoritesContextValue>(
    () => ({
      favorites: Array.from(favoritesById.values()).sort((a, b) => a.id - b.id),
      isFavorite,
      toggleFavorite,
    }),
    [favoritesById, isFavorite, toggleFavorite]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites(): FavoritesContextValue {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites debe usarse dentro de <FavoritesProvider>.');
  }
  return context;
}
