import { NextFunction, Request, Response } from 'express';
import { loginValidation, registerValidation } from '../../components/user/validation/user.validation';
import { StatusCodes } from 'http-status-codes';

export const registerValidationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = registerValidation.validate(req.body);
  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.details });
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
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.details });
  }
  next();
};
