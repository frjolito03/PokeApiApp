import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { formatDisplayName } from '../../core/utils/formatters';
import { getPokemonTypeColor } from '../theme/pokemonTypeColors';
import { radius, spacing } from '../theme/spacing';

interface TypeBadgeProps {
  typeName: string;
}

export function TypeBadge({ typeName }: TypeBadgeProps) {
  const color = getPokemonTypeColor(typeName);
  const label = formatDisplayName(typeName);

  return (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <Text style={styles.label} accessibilityLabel={`Tipo ${label}`}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
  },
  label: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
});
