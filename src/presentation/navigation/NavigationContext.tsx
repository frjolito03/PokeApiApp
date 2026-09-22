import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { BackHandler } from 'react-native';

import { NavigationEntry, PokemonDetailParams, ScreenName } from './types';

interface NavigationContextValue {
  current: NavigationEntry;
  canGoBack: boolean;
  navigateToDetail: (params: PokemonDetailParams) => void;
  navigateToFavorites: () => void;
  goBack: () => void;
}

const NavigationContext = createContext<NavigationContextValue | undefined>(undefined);

const initialStack: NavigationEntry[] = [{ screen: ScreenName.PokemonList }];

export function NavigationProvider({ children }: PropsWithChildren) {
  const [stack, setStack] = useState<NavigationEntry[]>(initialStack);

  const navigateToDetail = useCallback((params: PokemonDetailParams) => {
    setStack((previous) => [...previous, { screen: ScreenName.PokemonDetail, params }]);
  }, []);

  const navigateToFavorites = useCallback(() => {
    setStack((previous) => [...previous, { screen: ScreenName.Favorites }]);
  }, []);

  const goBack = useCallback(() => {
    setStack((previous) => (previous.length > 1 ? previous.slice(0, -1) : previous));
  }, []);

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (stack.length > 1) {
        goBack();
        return true;
      }
      return false;
    });

    return () => subscription.remove();
  }, [stack.length, goBack]);

  const value = useMemo<NavigationContextValue>(
    () => ({
      current: stack[stack.length - 1],
      canGoBack: stack.length > 1,
      navigateToDetail,
      navigateToFavorites,
      goBack,
    }),
    [stack, navigateToDetail, navigateToFavorites, goBack]
  );

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
}

export function useNavigation(): NavigationContextValue {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation debe usarse dentro de <NavigationProvider>.');
  }
  return context;
}
