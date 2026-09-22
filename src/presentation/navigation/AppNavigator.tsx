import React from 'react';

import { FavoritesScreen } from '../screens/FavoritesScreen/FavoritesScreen';
import { PokemonDetailScreen } from '../screens/PokemonDetailScreen/PokemonDetailScreen';
import { PokemonListScreen } from '../screens/PokemonListScreen/PokemonListScreen';
import { useNavigation } from './NavigationContext';
import { ScreenName } from './types';

export function AppNavigator() {
  const { current } = useNavigation();

  switch (current.screen) {
    case ScreenName.PokemonDetail:
      return <PokemonDetailScreen params={current.params} />;
    case ScreenName.Favorites:
      return <FavoritesScreen />;
    case ScreenName.PokemonList:
    default:
      return <PokemonListScreen />;
  }
}
