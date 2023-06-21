import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import * as authValidation from '../validations/auth.validation';
import * as authService from '../services/auth.service';
import * as userValidation from '../validations/user.validation';
import { respondWithJson } from '../utils/response.util';

export const register = async (req: Request, res: Response): Promise<Response<IRegister, Record<string, number>>> => {
  const authData: IRegister = await authValidation.SCHEMA_REGISTER_BODY.validateAsync(req.body);
  await userValidation.isEmailExisted(authData.email);

  const createdUser = await authService.register(authData);
  return respondWithJson(res, StatusCodes.CREATED, createdUser);
};
