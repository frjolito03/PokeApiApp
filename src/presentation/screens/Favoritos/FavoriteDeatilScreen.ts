import React, { useCallback } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { PokemonSummary } from '../../../domain/models/PokemonSummary';
import { EmptyState } from '../../components/EmptyState';
import { useFavorites } from '../../screens/Favoritos/FavoriteContext';
import { useNavigation } from '../../navigation/NavigationContext';
import { spacing } from '../../theme/spacing';
import { useTheme } from '../../theme/useTheme';
import { DetailHeader } from '../PokemonDetailScreen/components/DetailHeader';
import { PokemonListItemCard } from '../PokemonListScreen/components/PokemonListItemCard';

const NUM_COLUMNS = 2;

export function FavoritesScreen() {
  const { palette } = useTheme();
  const { goBack, navigateToDetail } = useNavigation();
  const { favorites, toggleFavorite } = useFavorites();

  const handlePress = useCallback(
    (pokemon: PokemonSummary) => {
      navigateToDetail({ pokemonId: pokemon.id, pokemonName: pokemon.name });
    },
    [navigateToDetail]
  );

  return React.createElement(
    View,
    { style: [styles.container, { backgroundColor: palette.background }] },
    React.createElement(DetailHeader, {
      title: 'Favoritos',
      onBack: goBack,
      onToggleFavorite: () => {},
      isFavorite: false,
    }),
    favorites.length === 0
      ? React.createElement(EmptyState, {
          title: 'No tenés favoritos todavía',
          description: 'Marcá la estrella de un Pokémon para verlo acá.',
        })
      : React.createElement(FlatList<PokemonSummary>, {
          data: favorites,
          keyExtractor: (item: PokemonSummary) => String(item.id),
          numColumns: NUM_COLUMNS,
          contentContainerStyle: styles.listContent,
          renderItem: ({ item }: { item: PokemonSummary }) =>
            React.createElement(PokemonListItemCard, {
              pokemon: item,
              onPress: handlePress,
            }),
        })
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { paddingBottom: spacing.xl },
});