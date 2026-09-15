import { AppError, AppErrorType } from '../../../domain/errors/AppError';
import { Page } from '../../../domain/models/Page';
import { PokemonSummary } from '../../../domain/models/PokemonSummary';
import { PokemonLocalDataSource } from '../../datasources/local/PokemonLocalDataSource';
import { PokeApiRemoteDataSource } from '../../datasources/remote/PokeApiRemoteDataSource';
import { PokemonListResponseDto } from '../../datasources/remote/dto/PokemonListResponseDto';
import { PokemonRepository } from '../PokemonRepository';

function createRemoteMock(): jest.Mocked<PokeApiRemoteDataSource> {
  return {
    fetchPokemonList: jest.fn(),
    fetchPokemonDetail: jest.fn(),
  } as unknown as jest.Mocked<PokeApiRemoteDataSource>;
}

function createLocalMock(): jest.Mocked<PokemonLocalDataSource> {
  return {
    getCachedList: jest.fn(),
    mergeAndSaveList: jest.fn(),
    getCachedDetail: jest.fn(),
    saveDetail: jest.fn(),
  } as unknown as jest.Mocked<PokemonLocalDataSource>;
}

describe('PokemonRepository.getPokemonList', () => {
  it('en éxito de red, mapea la página y la persiste en caché', async () => {
    const remote = createRemoteMock();
    const local = createLocalMock();
    const dto: PokemonListResponseDto = {
      count: 1302,
      next: 'https://pokeapi.co/api/v2/pokemon?limit=20&offset=20',
      previous: null,
      results: [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }],
    };
    remote.fetchPokemonList.mockResolvedValue(dto);

    const repository = new PokemonRepository(remote, local);
    const result = await repository.getPokemonList(20, 0);

    expect(result.isFromCache).toBe(false);
    expect(result.data.items).toEqual([
      {
        id: 1,
        name: 'bulbasaur',
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
      },
    ]);
    expect(result.data.nextOffset).toBe(20);
    expect(local.mergeAndSaveList).toHaveBeenCalledWith(result.data);
  });

  it('si la red falla, recurre a la caché local cuando existe', async () => {
    const remote = createRemoteMock();
    const local = createLocalMock();
    remote.fetchPokemonList.mockRejectedValue(
      new AppError(AppErrorType.Network, 'sin conexión')
    );
    const cachedPage: Page<PokemonSummary> = {
      items: [{ id: 1, name: 'bulbasaur', imageUrl: 'https://example.com/1.png' }],
      nextOffset: null,
      total: 1,
    };
    local.getCachedList.mockResolvedValue(cachedPage);

    const repository = new PokemonRepository(remote, local);
    const result = await repository.getPokemonList(20, 0);

    expect(result.isFromCache).toBe(true);
    expect(result.data).toEqual(cachedPage);
  });

  it('si la red falla y no hay caché, propaga el AppError', async () => {
    const remote = createRemoteMock();
    const local = createLocalMock();
    const networkError = new AppError(AppErrorType.Network, 'sin conexión');
    remote.fetchPokemonList.mockRejectedValue(networkError);
    local.getCachedList.mockResolvedValue(null);

    const repository = new PokemonRepository(remote, local);

    await expect(repository.getPokemonList(20, 0)).rejects.toBe(networkError);
  });
});
