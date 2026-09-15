import { PokemonLocalDataSource } from '../../data/datasources/local/PokemonLocalDataSource';
import { PokeApiRemoteDataSource } from '../../data/datasources/remote/PokeApiRemoteDataSource';
import { PokemonRepository } from '../../data/repositories/PokemonRepository';
import { IPokemonRepository } from '../../domain/repositories/IPokemonRepository';
import { GetPokemonDetailUseCase } from '../../domain/usecases/GetPokemonDetailUseCase';
import { GetPokemonListUseCase } from '../../domain/usecases/GetPokemonListUseCase';

export interface AppContainer {
  getPokemonListUseCase: GetPokemonListUseCase;
  getPokemonDetailUseCase: GetPokemonDetailUseCase;
}

// Composition root: conecta las implementaciones concretas con el dominio.
export function createContainer(): AppContainer {
  const remoteDataSource = new PokeApiRemoteDataSource();
  const localDataSource = new PokemonLocalDataSource();
  const pokemonRepository: IPokemonRepository = new PokemonRepository(
    remoteDataSource,
    localDataSource
  );

  return {
    getPokemonListUseCase: new GetPokemonListUseCase(pokemonRepository),
    getPokemonDetailUseCase: new GetPokemonDetailUseCase(pokemonRepository),
  };
}

export const container: AppContainer = createContainer();
