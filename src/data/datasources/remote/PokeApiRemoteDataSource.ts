import { POKE_API_BASE_URL } from '../../../core/constants/api';
import { AppError, AppErrorType } from '../../../domain/errors/AppError';
import { PokemonDetailResponseDto } from './dto/PokemonDetailResponseDto';
import { PokemonListResponseDto } from './dto/PokemonListResponseDto';

export class PokeApiRemoteDataSource {
  async fetchPokemonList(limit: number, offset: number): Promise<PokemonListResponseDto> {
    const response = await this.performRequest(
      `${POKE_API_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`
    );
    return (await response.json()) as PokemonListResponseDto;
  }

  async fetchPokemonDetail(idOrName: string | number): Promise<PokemonDetailResponseDto> {
    const response = await this.performRequest(`${POKE_API_BASE_URL}/pokemon/${idOrName}`);
    return (await response.json()) as PokemonDetailResponseDto;
  }

  private async performRequest(url: string): Promise<Response> {
    let response: Response;

    try {
      response = await fetch(url);
    } catch (cause) {
      throw new AppError(
        AppErrorType.Network,
        'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
        cause
      );
    }

    if (response.status === 404) {
      throw new AppError(AppErrorType.NotFound, 'El Pokémon solicitado no existe.');
    }

    if (!response.ok) {
      throw new AppError(
        AppErrorType.Unknown,
        `Ocurrió un error inesperado del servidor (${response.status}).`
      );
    }

    return response;
  }
}
