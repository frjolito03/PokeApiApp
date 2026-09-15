import React from 'react';
import { StyleSheet, View } from 'react-native';

import { SkeletonBlock } from '../../../components/SkeletonBlock';
import { radius, spacing } from '../../../theme/spacing';
import { useTheme } from '../../../theme/useTheme';

const PLACEHOLDER_COUNT = 8;

export function ListSkeleton() {
  const { palette } = useTheme();

  return (
    <View style={styles.grid} accessibilityLabel="Cargando Pokémon" accessibilityRole="progressbar">
      {Array.from({ length: PLACEHOLDER_COUNT }).map((_, index) => (
        <View
          key={index}
          style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.border }]}
        >
          <SkeletonBlock width={80} height={80} borderRadius={radius.sm} />
          <View style={styles.gap} />
          <SkeletonBlock width="70%" height={14} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.sm,
  },
  card: {
    flexBasis: '44%',
    flexGrow: 1,
    margin: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
  },
  gap: { height: spacing.md },
});
