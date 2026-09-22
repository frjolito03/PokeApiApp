import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { spacing } from '../../../theme/spacing';
import { useTheme } from '../../../theme/useTheme';

interface DetailHeaderProps {
  title: string;
  onBack: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function DetailHeader({ title, onBack, isFavorite, onToggleFavorite }: DetailHeaderProps) {
  const { palette } = useTheme();

  return (
    <View style={styles.container}>
      <Pressable
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Volver al listado"
        hitSlop={12}
        style={({ pressed }) => [styles.backButton, { opacity: pressed ? 0.6 : 1 }]}
      >
        <Text style={[styles.backArrow, { color: palette.text }]}>←</Text>
      </Pressable>
      <Text
        style={[styles.title, { color: palette.text }]}
        numberOfLines={1}
        accessibilityRole="header"
      >
        {title}
      </Text>
      <Pressable
        onPress={onToggleFavorite}
        accessibilityRole="button"
        accessibilityLabel={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        hitSlop={12}
        style={({ pressed }) => [styles.backButton, { opacity: pressed ? 0.6 : 1 }]}
      >
        <Text style={styles.backArrow}>{isFavorite ? '⭐' : '☆'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  backButton: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  backArrow: { fontSize: 22, fontWeight: '700' },
  title: { flex: 1, fontSize: 20, fontWeight: '800', textAlign: 'center' },
});
