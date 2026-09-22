import React, { useCallback } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { PokemonSummary } from '../../../domain/models/PokemonSummary';
import { EmptyState } from '../../components/EmptyState';
import { ErrorState } from '../../components/ErrorState';
import { OfflineBanner } from '../../components/OfflineBanner';
import { useFavorites } from '../../favorites/FavoritesContext';
import { usePokemonList } from '../../hooks/usePokemonList';
import { useNavigation } from '../../navigation/NavigationContext';
import { spacing } from '../../theme/spacing';
import { useTheme } from '../../theme/useTheme';
import { getFriendlyErrorMessage } from '../../utils/errorMessages';
import { ListFooterLoader } from './components/ListFooterLoader';
import { ListSkeleton } from './components/ListSkeleton';
import { PokemonListItemCard } from './components/PokemonListItemCard';

const NUM_COLUMNS = 2;

export function PokemonListScreen() {
  const { palette } = useTheme();
  const { navigateToDetail, navigateToFavorites } = useNavigation();
  const { items, isInitialLoading, isLoadingMore, error, isFromCache, hasMore, loadMore, retry } =
    usePokemonList();
  const { isFavorite, toggleFavorite } = useFavorites();

  const handlePress = useCallback(
    (pokemon: PokemonSummary) => {
      navigateToDetail({ pokemonId: pokemon.id, pokemonName: pokemon.name });
    },
    [navigateToDetail]
  );

  const renderContent = () => {
    if (isInitialLoading && items.length === 0) {
      return <ListSkeleton />;
    }

    if (error && items.length === 0) {
      return <ErrorState message={getFriendlyErrorMessage(error)} onRetry={retry} />;
    }

    if (!isInitialLoading && items.length === 0) {
      return (
        <EmptyState
          title="No hay Pokémon para mostrar"
          description="Intenta nuevamente más tarde."
        />
      );
    }

    return (
      <FlatList
        data={items}
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
        onEndReachedThreshold={0.5}
        onEndReached={hasMore ? loadMore : undefined}
        ListFooterComponent={isLoadingMore ? <ListFooterLoader /> : null}
        removeClippedSubviews
        initialNumToRender={12}
        maxToRenderPerBatch={12}
        windowSize={7}
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: palette.text }]} accessibilityRole="header">
          Pokédex
        </Text>
        <Pressable
          onPress={navigateToFavorites}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Ver favoritos"
        >
          <Text style={styles.favoritesLink}>⭐ Favoritos</Text>
        </Pressable>
      </View>
      {isFromCache && items.length > 0 ? <OfflineBanner /> : null}
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  title: { fontSize: 28, fontWeight: '800' },
  favoritesLink: { fontSize: 14, fontWeight: '600' },
  listContent: { paddingBottom: spacing.xl },
});
