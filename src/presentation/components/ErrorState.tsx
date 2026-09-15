import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { spacing } from '../theme/spacing';
import { useTheme } from '../theme/useTheme';
import { PrimaryButton } from './PrimaryButton';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  const { palette } = useTheme();

  return (
    <View style={styles.container} accessibilityRole="alert">
      <Text style={styles.emoji}>⚠️</Text>
      <Text style={[styles.message, { color: palette.text }]}>{message}</Text>
      <View style={styles.spacer} />
      <PrimaryButton
        label="Reintentar"
        onPress={onRetry}
        accessibilityHint="Vuelve a intentar la carga de datos"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  emoji: { fontSize: 40, marginBottom: spacing.md },
  message: { fontSize: 16, textAlign: 'center', lineHeight: 22 },
  spacer: { height: spacing.lg },
});
