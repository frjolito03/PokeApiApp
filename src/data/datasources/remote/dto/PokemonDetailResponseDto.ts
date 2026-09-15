export interface PokemonDetailSpritesDto {
  front_default: string | null;
  other?: {
    ['official-artwork']?: {
      front_default: string | null;
    };
  };
}

export interface PokemonDetailTypeSlotDto {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonDetailAbilitySlotDto {
  is_hidden: boolean;
  slot: number;
  ability: {
    name: string;
    url: string;
  };
}

export interface PokemonDetailStatSlotDto {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface PokemonDetailResponseDto {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number | null;
  sprites: PokemonDetailSpritesDto;
  types: PokemonDetailTypeSlotDto[];
  abilities: PokemonDetailAbilitySlotDto[];
  stats: PokemonDetailStatSlotDto[];
}
