import { CacheResult } from '../models/CacheResult';
import { PokemonDetail } from '../models/PokemonDetail';
import { IPokemonRepository } from '../repositories/IPokemonRepository';

export class GetPokemonDetailUseCase {
  constructor(private readonly repository: IPokemonRepository) {}

  execute(idOrName: string | number): Promise<CacheResult<PokemonDetail>> {
    return this.repository.getPokemonDetail(idOrName);
  }
}
