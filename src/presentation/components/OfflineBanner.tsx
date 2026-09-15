import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { spacing } from '../theme/spacing';
import { useTheme } from '../theme/useTheme';

export function OfflineBanner() {
  const { palette } = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: palette.warning }]}
      accessibilityRole="text"
      accessibilityLabel="Sin conexión, mostrando datos guardados localmente"
    >
      <Text style={styles.text}>Sin conexión · mostrando datos guardados</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  text: { color: '#1B1B1F', fontSize: 12, fontWeight: '600' },
});
