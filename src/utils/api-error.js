import httpStatus from 'http-status';

class APIError extends Error {
  constructor({ message, status = httpStatus.INTERNAL_SERVER_ERROR, errorCode, meta = {} }) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.errorCode = errorCode;
    this.meta = meta;
  }
}

export default APIError;
