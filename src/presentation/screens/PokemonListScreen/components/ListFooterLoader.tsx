import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { spacing } from '../../../theme/spacing';
import { useTheme } from '../../../theme/useTheme';

export function ListFooterLoader() {
  const { palette } = useTheme();
  return (
    <View style={styles.container}>
      <ActivityIndicator color={palette.primary} accessibilityLabel="Cargando más Pokémon" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: spacing.lg, alignItems: 'center' },
});
