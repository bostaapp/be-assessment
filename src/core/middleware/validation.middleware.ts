import { NextFunction, Request, Response } from 'express';
import {
  loginValidation,
  registerValidation,
} from '../../components/user/validation/user.validation';
import { StatusCodes } from 'http-status-codes';
import { createCheckValidationSchema, updateCheckValidationSchema } from '../../components/check/validation/check.validation';

export const registerValidationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = registerValidation.validate(req.body);
  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).send({ message: error.details });
  }
  next();
};

export const loginValidationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = loginValidation.validate(req.body);
  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).send({ message: error.details });
  }
  next();
};

export const createCheckValidationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.body);
  const { error } = createCheckValidationSchema.validate(req.body);
  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).send({ message: error.details });
  }
  next();
};

export const updateCheckValidationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = updateCheckValidationSchema.validate(req.body);
  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).send({ message: error.details });
  }
  next();
};
