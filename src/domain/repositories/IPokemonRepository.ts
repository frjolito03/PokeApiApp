import { CacheResult } from '../models/CacheResult';
import { Page } from '../models/Page';
import { PokemonDetail } from '../models/PokemonDetail';
import { PokemonSummary } from '../models/PokemonSummary';

export interface IPokemonRepository {
  getPokemonList(limit: number, offset: number): Promise<CacheResult<Page<PokemonSummary>>>;
  getPokemonDetail(idOrName: string | number): Promise<CacheResult<PokemonDetail>>;
}
