import { IPokemonRepository } from '../../repositories/IPokemonRepository';
import { GetPokemonListUseCase } from '../GetPokemonListUseCase';

describe('GetPokemonListUseCase', () => {
  it('delega en el repositorio con los parámetros recibidos', async () => {
    const expected = { data: { items: [], nextOffset: null, total: 0 }, isFromCache: false };
    const repository: IPokemonRepository = {
      getPokemonList: jest.fn().mockResolvedValue(expected),
      getPokemonDetail: jest.fn(),
    };

    const useCase = new GetPokemonListUseCase(repository);
    const result = await useCase.execute(20, 40);

    expect(repository.getPokemonList).toHaveBeenCalledWith(20, 40);
    expect(result).toBe(expected);
  });
});
