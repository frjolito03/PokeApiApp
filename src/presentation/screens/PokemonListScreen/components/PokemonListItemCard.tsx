import React from 'react';
import { Image, Pressable, StyleSheet, Text } from 'react-native';

import { formatDisplayName, formatPokedexNumber } from '../../../../core/utils/formatters';
import { PokemonSummary } from '../../../../domain/models/PokemonSummary';
import { radius, spacing } from '../../../theme/spacing';
import { useTheme } from '../../../theme/useTheme';

interface PokemonListItemCardProps {
  pokemon: PokemonSummary;
  onPress: (pokemon: PokemonSummary) => void;
  isFavorite: boolean;
  onToggleFavorite: (pokemonId: number) => void;
}

export function PokemonListItemCard({
  pokemon,
  onPress,
  isFavorite,
  onToggleFavorite,
}: PokemonListItemCardProps) {
  const { palette } = useTheme();
  const displayName = formatDisplayName(pokemon.name);

  return (
    <Pressable
      onPress={() => onPress(pokemon)}
      accessibilityRole="button"
      accessibilityLabel={`${displayName}, número ${pokemon.id}`}
      accessibilityHint="Abre el detalle de este Pokémon"
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: palette.surface,
          borderColor: palette.border,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <Pressable
        onPress={(event) => {
          event.stopPropagation();
          onToggleFavorite(pokemon.id);
        }}
        hitSlop={8}
        style={styles.favoriteButton}
        accessibilityRole="button"
        accessibilityLabel={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      >
        <Text style={styles.favoriteIcon}>{isFavorite ? '⭐' : '☆'}</Text>
      </Pressable>

      <Text style={[styles.number, { color: palette.textSecondary }]}>
        {formatPokedexNumber(pokemon.id)}
      </Text>
      <Image
        source={{ uri: pokemon.imageUrl }}
        style={styles.image}
        resizeMode="contain"
        accessible={false}
      />
      <Text style={[styles.name, { color: palette.text }]} numberOfLines={1}>
        {displayName}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
  },
  number: { fontSize: 12, alignSelf: 'flex-start', fontWeight: '600' },
  image: { width: 80, height: 80, marginVertical: spacing.xs },
  name: { fontSize: 14, fontWeight: '600' },
  favoriteButton: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    zIndex: 1,
  },
  favoriteIcon: { fontSize: 18 },
});
