import { PokemonDetailResponseDto } from '../../datasources/remote/dto/PokemonDetailResponseDto';
import { PokemonListResultDto } from '../../datasources/remote/dto/PokemonListResponseDto';
import { PokemonMapper } from '../PokemonMapper';

describe('PokemonMapper.toSummary', () => {
  it('mapea el DTO de listado a un PokemonSummary con id derivado de la URL', () => {
    const dto: PokemonListResultDto = {
      name: 'bulbasaur',
      url: 'https://pokeapi.co/api/v2/pokemon/1/',
    };

    const summary = PokemonMapper.toSummary(dto);

    expect(summary).toEqual({
      id: 1,
      name: 'bulbasaur',
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
    });
  });
});

describe('PokemonMapper.toDetail', () => {
  const baseDto: PokemonDetailResponseDto = {
    id: 1,
    name: 'bulbasaur',
    height: 7,
    weight: 69,
    base_experience: 64,
    sprites: {
      front_default: 'https://example.com/front.png',
      other: {
        'official-artwork': { front_default: 'https://example.com/artwork.png' },
      },
    },
    types: [
      { slot: 2, type: { name: 'poison', url: '' } },
      { slot: 1, type: { name: 'grass', url: '' } },
    ],
    abilities: [
      { is_hidden: true, slot: 3, ability: { name: 'chlorophyll', url: '' } },
      { is_hidden: false, slot: 1, ability: { name: 'overgrow', url: '' } },
    ],
    stats: [
      { base_stat: 45, effort: 0, stat: { name: 'hp', url: '' } },
      { base_stat: 49, effort: 0, stat: { name: 'attack', url: '' } },
    ],
  };

  it('convierte unidades y arma la forma de dominio', () => {
    const detail = PokemonMapper.toDetail(baseDto);

    expect(detail.id).toBe(1);
    expect(detail.name).toBe('bulbasaur');
    expect(detail.heightMeters).toBe(0.7);
    expect(detail.weightKilograms).toBe(6.9);
    expect(detail.baseExperience).toBe(64);
    expect(detail.imageUrl).toBe('https://example.com/artwork.png');
  });

  it('ordena tipos y habilidades por slot', () => {
    const detail = PokemonMapper.toDetail(baseDto);

    expect(detail.types.map((t) => t.name)).toEqual(['grass', 'poison']);
    expect(detail.abilities.map((a) => a.name)).toEqual(['overgrow', 'chlorophyll']);
    expect(detail.abilities.find((a) => a.name === 'chlorophyll')?.isHidden).toBe(true);
  });

  it('usa el sprite estático como respaldo si no hay artwork oficial', () => {
    const dto: PokemonDetailResponseDto = {
      ...baseDto,
      sprites: { front_default: null },
    };

    const detail = PokemonMapper.toDetail(dto);

    expect(detail.imageUrl).toBe(
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png'
    );
  });
});
