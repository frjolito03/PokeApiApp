import React from 'react';
import { StyleSheet, View } from 'react-native';

import { SkeletonBlock } from '../../../components/SkeletonBlock';
import { spacing } from '../../../theme/spacing';

export function DetailSkeleton() {
  return (
    <View
      style={styles.container}
      accessibilityLabel="Cargando detalle del Pokémon"
      accessibilityRole="progressbar"
    >
      <SkeletonBlock width={160} height={160} borderRadius={80} style={styles.center} />
      <SkeletonBlock width="50%" height={24} style={styles.center} />
      <View style={styles.row}>
        <SkeletonBlock width={70} height={26} borderRadius={13} />
        <SkeletonBlock width={70} height={26} borderRadius={13} />
      </View>
      <SkeletonBlock width="100%" height={110} style={styles.block} />
      <SkeletonBlock width="100%" height={140} style={styles.block} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg },
  center: { alignSelf: 'center', marginBottom: spacing.md },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  block: { marginBottom: spacing.md },
});
