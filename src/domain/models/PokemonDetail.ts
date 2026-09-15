export interface PokemonType {
  name: string;
}

export interface PokemonAbility {
  name: string;
  isHidden: boolean;
}

export interface PokemonStat {
  name: string;
  baseValue: number;
  maxValue: number;
}

export interface PokemonDetail {
  id: number;
  name: string;
  imageUrl: string;
  heightMeters: number;
  weightKilograms: number;
  baseExperience: number | null;
  types: PokemonType[];
  abilities: PokemonAbility[];
  stats: PokemonStat[];
}
