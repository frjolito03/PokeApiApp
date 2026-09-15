import { CacheResult } from '../models/CacheResult';
import { Page } from '../models/Page';
import { PokemonSummary } from '../models/PokemonSummary';
import { IPokemonRepository } from '../repositories/IPokemonRepository';

export class GetPokemonListUseCase {
  constructor(private readonly repository: IPokemonRepository) {}

  execute(limit: number, offset: number): Promise<CacheResult<Page<PokemonSummary>>> {
    return this.repository.getPokemonList(limit, offset);
  }
}
