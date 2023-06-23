import { StatusCodes } from 'http-status-codes';

export const ERROR_TYPES = {
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
};

export const ERRORS = {
  E1000: {
    code: 'E1000',
    message: ERROR_TYPES.INTERNAL_SERVER_ERROR,
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
  },
  //Auth Errors
  E2000: {
    code: 'E2000',
    message: 'UnAuthorized',
    statusCode: StatusCodes.UNAUTHORIZED,
  },
  E2001: {
    code: 'E2001',
    message: 'No Auth Token Provided',
    statusCode: StatusCodes.UNAUTHORIZED,
  },
  E2002: {
    code: 'E2002',
    message: 'Not a verified email',
    statusCode: StatusCodes.UNAUTHORIZED,
  },
  // No AppError Found
  E3000: {
    code: 'E3000',
    message: 'Something went wrong',
    statusCode: StatusCodes.BAD_REQUEST,
  },
  E4000: {
    code: 'E4000',
    message: 'Not Found',
    statusCode: StatusCodes.NOT_FOUND,
  },
  E4001: {
    code: 'E4001',
    message: 'Validation Failed',
    statusCode: StatusCodes.BAD_REQUEST,
  },
};

export const USER_ERRORS = {
  E5000: {
    code: 'E5000',
    message: 'Email already exists',
    statusCode: StatusCodes.BAD_REQUEST,
  },
  E5001: {
    code: 'E5001',
    message: 'User not found',
    statusCode: StatusCodes.BAD_REQUEST,
  },
  E5002: {
    code: 'E5002',
    message: 'User not found',
    statusCode: StatusCodes.UNAUTHORIZED,
  },
  E5003: {
    code: 'E5003',
    message: "You aren't allowed to perform this action",
    statusCode: StatusCodes.FORBIDDEN,
  },
};

export const URLCHECK_ERRORS = {
  E6000: {
    code: 'E6000',
    message: 'URLCheck is already existed',
    statusCode: StatusCodes.BAD_REQUEST,
  },
  E6001: {
    code: 'E6001',
    message: 'URLCheck not found',
    statusCode: StatusCodes.BAD_REQUEST,
  },
};
