import { AppError, AppErrorType } from '../../domain/errors/AppError';
import { CacheResult } from '../../domain/models/CacheResult';
import { Page } from '../../domain/models/Page';
import { PokemonDetail } from '../../domain/models/PokemonDetail';
import { PokemonSummary } from '../../domain/models/PokemonSummary';
import { IPokemonRepository } from '../../domain/repositories/IPokemonRepository';
import { PokemonLocalDataSource } from '../datasources/local/PokemonLocalDataSource';
import { PokeApiRemoteDataSource } from '../datasources/remote/PokeApiRemoteDataSource';
import { PokemonMapper } from '../mappers/PokemonMapper';

// Estrategia: red primero, caché local como respaldo si la red falla.
export class PokemonRepository implements IPokemonRepository {
  constructor(
    private readonly remoteDataSource: PokeApiRemoteDataSource,
    private readonly localDataSource: PokemonLocalDataSource
  ) {}

  async getPokemonList(limit: number, offset: number): Promise<CacheResult<Page<PokemonSummary>>> {
    try {
      const dto = await this.remoteDataSource.fetchPokemonList(limit, offset);
      const page: Page<PokemonSummary> = {
        items: dto.results.map(PokemonMapper.toSummary),
        nextOffset: dto.next ? offset + limit : null,
        total: dto.count,
      };

      await this.localDataSource.mergeAndSaveList(page);
      return { data: page, isFromCache: false };
    } catch (error) {
      const cached = await this.localDataSource.getCachedList();
      if (cached && cached.items.length > 0) {
        return { data: cached, isFromCache: true };
      }
      throw this.toAppError(error);
    }
  }

  async getPokemonDetail(idOrName: string | number): Promise<CacheResult<PokemonDetail>> {
    try {
      const dto = await this.remoteDataSource.fetchPokemonDetail(idOrName);
      const detail = PokemonMapper.toDetail(dto);
      await this.localDataSource.saveDetail(detail);
      return { data: detail, isFromCache: false };
    } catch (error) {
      const cached = await this.localDataSource.getCachedDetail(idOrName);
      if (cached) {
        return { data: cached, isFromCache: true };
      }
      throw this.toAppError(error);
    }
  }

  private toAppError(error: unknown): AppError {
    if (error instanceof AppError) {
      return error;
    }
    return new AppError(AppErrorType.Unknown, 'Ocurrió un error inesperado.', error);
  }
}
