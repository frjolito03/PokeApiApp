export interface PokemonListResultDto {
  name: string;
  url: string;
}

export interface PokemonListResponseDto {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListResultDto[];
}
