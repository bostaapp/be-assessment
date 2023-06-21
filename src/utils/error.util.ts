export default class AppError extends Error {
  public readonly code: string;
  public readonly message: string;
  public readonly httpStatusCode: number;

  constructor(err: IAppError, message?: string) {
    super(message);
    this.code = err.code;
    this.message = message || err.message;
    this.httpStatusCode = err.statusCode;

    Object.setPrototypeOf(this, AppError.prototype);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

export const createNewAppError = (error: IAppError, message?: string): AppError => {
  return new AppError(error, message);
};
