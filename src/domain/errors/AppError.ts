export enum AppErrorType {
  Network = 'NETWORK',
  NotFound = 'NOT_FOUND',
  Unknown = 'UNKNOWN',
}

export class AppError extends Error {
  readonly type: AppErrorType;
  readonly cause?: unknown;

  constructor(type: AppErrorType, message: string, cause?: unknown) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.cause = cause;
  }
}
