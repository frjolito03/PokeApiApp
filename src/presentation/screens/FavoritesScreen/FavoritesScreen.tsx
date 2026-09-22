import React, { useCallback } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { PokemonSummary } from '../../../domain/models/PokemonSummary';
import { EmptyState } from '../../components/EmptyState';
import { useFavorites } from '../../favorites/FavoritesContext';
import { useNavigation } from '../../navigation/NavigationContext';
import { spacing } from '../../theme/spacing';
import { useTheme } from '../../theme/useTheme';
import { DetailHeader } from '../PokemonDetailScreen/components/DetailHeader';
import { PokemonListItemCard } from '../PokemonListScreen/components/PokemonListItemCard';

const NUM_COLUMNS = 2;

export function FavoritesScreen() {
  const { palette } = useTheme();
  const { goBack, navigateToDetail } = useNavigation();
  const { favorites, isFavorite, toggleFavorite } = useFavorites();

  const handlePress = useCallback(
    (pokemon: PokemonSummary) => {
      navigateToDetail({ pokemonId: pokemon.id, pokemonName: pokemon.name });
    },
    [navigateToDetail]
  );

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <DetailHeader title="Favoritos" onBack={goBack} />

      {favorites.length === 0 ? (
        <EmptyState
          title="No tenés favoritos todavía"
          description="Marcá la estrella de un Pokémon para verlo acá."
        />
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => String(item.id)}
          numColumns={NUM_COLUMNS}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <PokemonListItemCard
              pokemon={item}
              onPress={handlePress}
              isFavorite={isFavorite(item.id)}
              onToggleFavorite={toggleFavorite}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { paddingBottom: spacing.xl },
});
