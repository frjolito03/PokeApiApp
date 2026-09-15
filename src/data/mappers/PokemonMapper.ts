import { MAX_STAT_VALUE } from '../../core/constants/api';
import { decimetersToMeters, hectogramsToKilograms } from '../../core/utils/formatters';
import { buildSpriteUrl, extractIdFromResourceUrl } from '../../core/utils/pokemonResource';
import { PokemonDetail } from '../../domain/models/PokemonDetail';
import { PokemonSummary } from '../../domain/models/PokemonSummary';
import { PokemonDetailResponseDto } from '../datasources/remote/dto/PokemonDetailResponseDto';
import { PokemonListResultDto } from '../datasources/remote/dto/PokemonListResponseDto';

const bySlot = (a: { slot: number }, b: { slot: number }) => a.slot - b.slot;

export class PokemonMapper {
  static toSummary(dto: PokemonListResultDto): PokemonSummary {
    const id = extractIdFromResourceUrl(dto.url);
    return {
      id,
      name: dto.name,
      imageUrl: buildSpriteUrl(id),
    };
  }

  static toDetail(dto: PokemonDetailResponseDto): PokemonDetail {
    const artworkUrl = dto.sprites.other?.['official-artwork']?.front_default;

    return {
      id: dto.id,
      name: dto.name,
      imageUrl: artworkUrl ?? dto.sprites.front_default ?? buildSpriteUrl(dto.id),
      heightMeters: decimetersToMeters(dto.height),
      weightKilograms: hectogramsToKilograms(dto.weight),
      baseExperience: dto.base_experience,
      types: [...dto.types].sort(bySlot).map((slot) => ({ name: slot.type.name })),
      abilities: [...dto.abilities]
        .sort(bySlot)
        .map((slot) => ({ name: slot.ability.name, isHidden: slot.is_hidden })),
      stats: dto.stats.map((slot) => ({
        name: slot.stat.name,
        baseValue: slot.base_stat,
        maxValue: MAX_STAT_VALUE,
      })),
    };
  }
}
