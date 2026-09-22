export enum ScreenName {
  PokemonList = 'PokemonList',
  PokemonDetail = 'PokemonDetail',
  Favorites = 'Favorites',
}

export interface PokemonDetailParams {
  pokemonId: number;
  pokemonName: string;
}

export type NavigationEntry =
  | { screen: ScreenName.PokemonList }
  | { screen: ScreenName.PokemonDetail; params: PokemonDetailParams }
  | { screen: ScreenName.Favorites };
