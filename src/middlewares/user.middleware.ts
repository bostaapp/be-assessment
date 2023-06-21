import { NextFunction, Request, Response } from 'express';

import * as userService from '../services/user.service';
import { createNewAppError } from '../utils/error.util';
import { USER_ERRORS } from '../constants/error';
import Logger from '../utils/logger.util';

const userMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authId = req.locals.auth.id;
  const user: IUser = await userService.getUserByAuthId(authId);
  if (!user) {
    Logger.error(USER_ERRORS.E14002.message, { authId });
    throw createNewAppError(USER_ERRORS.E14002);
  }

  req.locals = {
    ...req.locals,
    user: user,
  };

  return next();
};

export default userMiddleware;
