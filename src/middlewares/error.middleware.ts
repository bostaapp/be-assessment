import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import AppError from '../utils/error.util';
import { ERRORS, ERROR_TYPES } from '../constants/error';
import Logger from '../utils/logger.util';

const isAppError = (err: Error): err is AppError => err instanceof AppError;
const isJoiError = (err: Error): err is Joi.ValidationError => err instanceof Joi.ValidationError;

/* eslint @typescript-eslint/no-unused-vars: "off" */
const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): Response<unknown, Record<string, unknown>> => {
  //Check is validation Error
  if (isJoiError(err)) {
    return res.status(ERRORS.E4001.statusCode).json({
      code: ERRORS.E4001.code,
      message: err.message,
    });
  }
  //Check is AppError
  if (isAppError(err)) {
    return res.status(err.httpStatusCode).json({
      code: err.code,
      message: err.message,
    });
  }

  //Return Internal Server Error
  Logger.error(ERROR_TYPES.INTERNAL_SERVER_ERROR, err);

  return res.status(ERRORS.E1000.statusCode).json({
    code: ERRORS.E1000.code,
    message: ERRORS.E1000.message,
  });
};

export default errorMiddleware;
