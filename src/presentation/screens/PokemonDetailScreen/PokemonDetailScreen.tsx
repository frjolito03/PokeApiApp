import React, { useCallback } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  formatDisplayName,
  formatKilograms,
  formatMeters,
  formatPokedexNumber,
} from '../../../core/utils/formatters';
import { ErrorState } from '../../components/ErrorState';
import { OfflineBanner } from '../../components/OfflineBanner';
import { TypeBadge } from '../../components/TypeBadge';
import { useFavorites } from '../../favorites/FavoritesContext';
import { usePokemonDetail } from '../../hooks/usePokemonDetail';
import { useNavigation } from '../../navigation/NavigationContext';
import { PokemonDetailParams } from '../../navigation/types';
import { spacing } from '../../theme/spacing';
import { useTheme } from '../../theme/useTheme';
import { getFriendlyErrorMessage } from '../../utils/errorMessages';
import { DetailHeader } from './components/DetailHeader';
import { DetailSkeleton } from './components/DetailSkeleton';
import { StatBar } from './components/StatBar';

interface PokemonDetailScreenProps {
  params: PokemonDetailParams;
}

export function PokemonDetailScreen({ params }: PokemonDetailScreenProps) {
  const { palette } = useTheme();
  const { goBack } = useNavigation();
  const { detail, isLoading, error, isFromCache, retry } = usePokemonDetail(params.pokemonId);
  const { isFavorite, toggleFavorite } = useFavorites();

  const handleToggleFavorite = useCallback(() => {
    if (detail) {
      toggleFavorite(detail);
    }
  }, [detail, toggleFavorite]);

  const headerTitle = detail
    ? formatDisplayName(detail.name)
    : formatDisplayName(params.pokemonName);

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <DetailHeader
        title={headerTitle}
        onBack={goBack}
        isFavorite={detail ? isFavorite(detail.id) : false}
        onToggleFavorite={detail ? handleToggleFavorite : undefined}
      />
      {isFromCache && detail ? <OfflineBanner /> : null}

      {isLoading && !detail ? <DetailSkeleton /> : null}

      {error && !detail ? (
        <ErrorState message={getFriendlyErrorMessage(error)} onRetry={retry} />
      ) : null}

      {detail ? (
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={[styles.pokedexNumber, { color: palette.textSecondary }]}>
            {formatPokedexNumber(detail.id)}
          </Text>
          <Image
            source={{ uri: detail.imageUrl }}
            style={styles.image}
            resizeMode="contain"
            accessibilityLabel={`Imagen de ${formatDisplayName(detail.name)}`}
          />

          <View style={styles.typesRow}>
            {detail.types.map((type) => (
              <TypeBadge key={type.name} typeName={type.name} />
            ))}
          </View>

          <View
            style={[
              styles.section,
              { backgroundColor: palette.surface, borderColor: palette.border },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: palette.text }]}>Detalles</Text>
            <View style={styles.detailsRow}>
              <DetailMetric label="Altura" value={formatMeters(detail.heightMeters)} />
              <DetailMetric label="Peso" value={formatKilograms(detail.weightKilograms)} />
              <DetailMetric
                label="Exp. base"
                value={detail.baseExperience !== null ? String(detail.baseExperience) : '—'}
              />
            </View>
          </View>

          <View
            style={[
              styles.section,
              { backgroundColor: palette.surface, borderColor: palette.border },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: palette.text }]}>Habilidades</Text>
            {detail.abilities.map((ability) => (
              <Text key={ability.name} style={[styles.abilityText, { color: palette.text }]}>
                • {formatDisplayName(ability.name)}
                {ability.isHidden ? ' (oculta)' : ''}
              </Text>
            ))}
          </View>

          <View
            style={[
              styles.section,
              { backgroundColor: palette.surface, borderColor: palette.border },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: palette.text }]}>Estadísticas</Text>
            {detail.stats.map((stat) => (
              <StatBar key={stat.name} stat={stat} />
            ))}
          </View>
        </ScrollView>
      ) : null}
    </View>
  );
}

interface DetailMetricProps {
  label: string;
  value: string;
}

function DetailMetric({ label, value }: DetailMetricProps) {
  const { palette } = useTheme();
  return (
    <View style={styles.metric}>
      <Text style={[styles.metricValue, { color: palette.text }]}>{value}</Text>
      <Text style={[styles.metricLabel, { color: palette.textSecondary }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  pokedexNumber: {
    alignSelf: 'center',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  image: { width: 180, height: 180, alignSelf: 'center' },
  typesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  section: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: spacing.md },
  detailsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  metric: { alignItems: 'center', flex: 1 },
  metricValue: { fontSize: 16, fontWeight: '700' },
  metricLabel: { fontSize: 12, marginTop: 2 },
  abilityText: { fontSize: 14, marginBottom: spacing.xs },
});
