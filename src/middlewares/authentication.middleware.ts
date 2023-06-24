import { NextFunction, Request, Response } from 'express';

import { verifyAuthoken } from '../helpers/firebase.helper';
import { ERRORS, ERROR_TYPES } from '../constants/error';
import { extractAuthorizationToken } from '../utils/request.util';
import { createNewAppError } from '../utils/error.util';
import Logger from '../utils/logger.util';

const authenticationMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = extractAuthorizationToken(req as any);
  if (!token) {
    throw createNewAppError(ERRORS.E2001);
  }

  let isEmailVerified = true;
  try {
    const decodedToken = await verifyAuthoken(token);
    if (!decodedToken.email_verified) {
      isEmailVerified = false;
      Logger.error(ERRORS.E2002.message, { email: decodedToken.email });
      throw createNewAppError(ERRORS.E2002);
    }

    req.locals = {
      auth: {
        id: decodedToken.uid,
        email: decodedToken.email,
      },
      user: null,
    };
    return next();
  } catch (error) {
    if (!isEmailVerified) throw createNewAppError(ERRORS.E2002);
    Logger.error(ERROR_TYPES.AUTH_ERROR, error);
    throw createNewAppError(ERRORS.E2000);
  }
};

export default authenticationMiddleware;
