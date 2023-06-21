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
  E14000: {
    code: 'E14000',
    message: 'Email already exists',
    statusCode: StatusCodes.BAD_REQUEST,
  },
  E14001: {
    code: 'E14001',
    message: 'User not found',
    statusCode: StatusCodes.BAD_REQUEST,
  },
  E14002: {
    code: 'E14002',
    message: 'User not found',
    statusCode: StatusCodes.UNAUTHORIZED,
  },
  E14003: {
    code: 'E14003',
    message: "You aren't allowed to perform this action",
    statusCode: StatusCodes.FORBIDDEN,
  },
};
