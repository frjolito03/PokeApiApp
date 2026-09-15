import { useCallback, useEffect, useRef, useState } from 'react';

import { DEFAULT_PAGE_SIZE } from '../../core/constants/api';
import { AppError } from '../../domain/errors/AppError';
import { PokemonSummary } from '../../domain/models/PokemonSummary';
import { useDependencies } from '../dependencies/DependenciesContext';

type FetchMode = 'initial' | 'more' | 'retry';

export interface UsePokemonListResult {
  items: PokemonSummary[];
  isInitialLoading: boolean;
  isLoadingMore: boolean;
  error: AppError | null;
  isFromCache: boolean;
  hasMore: boolean;
  loadMore: () => void;
  retry: () => void;
}

export function usePokemonList(pageSize: number = DEFAULT_PAGE_SIZE): UsePokemonListResult {
  const { getPokemonListUseCase } = useDependencies();

  const [items, setItems] = useState<PokemonSummary[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const [isFromCache, setIsFromCache] = useState(false);
  const [nextOffset, setNextOffset] = useState<number | null>(0);

  const isFetchingRef = useRef(false);

  const fetchPage = useCallback(
    async (offset: number, mode: FetchMode) => {
      if (isFetchingRef.current) {
        return;
      }
      isFetchingRef.current = true;

      if (mode === 'more') {
        setIsLoadingMore(true);
      } else {
        setIsInitialLoading(true);
      }
      setError(null);

      try {
        const result = await getPokemonListUseCase.execute(pageSize, offset);

        setIsFromCache(result.isFromCache);
        setNextOffset(result.data.nextOffset);
        setItems((previous) => {
          if (result.isFromCache) {
            return result.data.items;
          }
          const merged = new Map(previous.map((item) => [item.id, item] as const));
          for (const item of result.data.items) {
            merged.set(item.id, item);
          }
          return Array.from(merged.values()).sort((a, b) => a.id - b.id);
        });
      } catch (caught) {
        setError(caught as AppError);
      } finally {
        setIsInitialLoading(false);
        setIsLoadingMore(false);
        isFetchingRef.current = false;
      }
    },
    [getPokemonListUseCase, pageSize]
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPage(0, 'initial');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMore = useCallback(() => {
    if (nextOffset === null || isFetchingRef.current || isFromCache) {
      return;
    }
    fetchPage(nextOffset, 'more');
  }, [nextOffset, isFromCache, fetchPage]);

  const retry = useCallback(() => {
    fetchPage(0, 'retry');
  }, [fetchPage]);

  return {
    items,
    isInitialLoading,
    isLoadingMore,
    error,
    isFromCache,
    hasMore: nextOffset !== null,
    loadMore,
    retry,
  };
}
