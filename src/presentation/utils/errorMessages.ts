import { AppError, AppErrorType } from '../../domain/errors/AppError';

export function getFriendlyErrorMessage(error: unknown): string {
  if (error instanceof AppError) {
    switch (error.type) {
      case AppErrorType.Network:
        return 'Sin conexión a internet. Verifica tu red e intenta nuevamente.';
      case AppErrorType.NotFound:
        return 'No encontramos este Pokémon.';
      case AppErrorType.Unknown:
      default:
        return 'Ocurrió un error inesperado. Intenta nuevamente.';
    }
  }
  return 'Ocurrió un error inesperado. Intenta nuevamente.';
}
