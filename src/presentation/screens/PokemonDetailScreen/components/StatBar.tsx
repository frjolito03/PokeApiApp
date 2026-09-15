import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { formatDisplayName } from '../../../../core/utils/formatters';
import { PokemonStat } from '../../../../domain/models/PokemonDetail';
import { spacing } from '../../../theme/spacing';
import { useTheme } from '../../../theme/useTheme';

interface StatBarProps {
  stat: PokemonStat;
}

const LOW_COLOR = '#E15554';
const MID_COLOR = '#F2B705';
const HIGH_COLOR = '#4CAF50';

export function StatBar({ stat }: StatBarProps) {
  const { palette } = useTheme();
  const [widthAnim] = useState(() => new Animated.Value(0));
  const ratio = Math.min(stat.baseValue / stat.maxValue, 1);

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: ratio,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [ratio, widthAnim]);

  const barColor = ratio > 0.66 ? HIGH_COLOR : ratio > 0.33 ? MID_COLOR : LOW_COLOR;

  return (
    <View style={styles.row}>
      <Text style={[styles.label, { color: palette.textSecondary }]}>
        {formatDisplayName(stat.name)}
      </Text>
      <View style={[styles.track, { backgroundColor: palette.surfaceAlt }]}>
        <Animated.View
          style={[
            styles.fill,
            {
              backgroundColor: barColor,
              width: widthAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
            },
          ]}
        />
      </View>
      <Text style={[styles.value, { color: palette.text }]}>{stat.baseValue}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  label: { width: 90, fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
  track: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginHorizontal: spacing.sm,
  },
  fill: { height: '100%', borderRadius: 4 },
  value: { width: 32, fontSize: 12, textAlign: 'right', fontWeight: '600' },
});
