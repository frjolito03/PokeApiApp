export enum ScreenName {
  PokemonList = 'PokemonList',
  PokemonDetail = 'PokemonDetail',
  PokemonFavoriteDetail = 'PokemonFavoriteDetail',
}

export interface PokemonDetailParams {
  pokemonId: number;
  pokemonName: string;
}

export type NavigationEntry =
  | { screen: ScreenName.PokemonList }
  | { screen: ScreenName.PokemonDetail; params: PokemonDetailParams }
  | { screen: ScreenName.PokemonFavoriteDetail };
  
