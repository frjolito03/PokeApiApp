import { useCallback, useEffect, useState } from 'react';

import { AppError } from '../../domain/errors/AppError';
import { PokemonDetail } from '../../domain/models/PokemonDetail';
import { useDependencies } from '../dependencies/DependenciesContext';

export interface UsePokemonDetailResult {
  detail: PokemonDetail | null;
  isLoading: boolean;
  error: AppError | null;
  isFromCache: boolean;
  retry: () => void;
}

export function usePokemonDetail(idOrName: string | number): UsePokemonDetailResult {
  const { getPokemonDetailUseCase } = useDependencies();

  const [detail, setDetail] = useState<PokemonDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AppError | null>(null);
  const [isFromCache, setIsFromCache] = useState(false);

  const fetchDetail = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getPokemonDetailUseCase.execute(idOrName);
      setDetail(result.data);
      setIsFromCache(result.isFromCache);
    } catch (caught) {
      setError(caught as AppError);
    } finally {
      setIsLoading(false);
    }
  }, [getPokemonDetailUseCase, idOrName]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDetail();
  }, [fetchDetail]);

  return { detail, isLoading, error, isFromCache, retry: fetchDetail };
}
