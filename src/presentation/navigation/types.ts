export enum ScreenName {
  PokemonList = 'PokemonList',
  PokemonDetail = 'PokemonDetail',
}

export interface PokemonDetailParams {
  pokemonId: number;
  pokemonName: string;
}

export type NavigationEntry =
  | { screen: ScreenName.PokemonList }
  | { screen: ScreenName.PokemonDetail; params: PokemonDetailParams };
