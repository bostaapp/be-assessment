import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { verifyToken } from '../service/token.service';
import { UserService } from '../../components/user/service/user.service';

const userService = new UserService();
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  try {
    if (authHeader && authHeader.startsWith('Bearer')) {
      const token = authHeader.split(' ')[1];
      const reverseToken: any = verifyToken(token);
      const userExist = await userService.userExist({ _id: reverseToken._id });
      if (userExist) {
        req['userId'] = reverseToken._id;
        return next();
      }
    }
  } catch (err) {
    //TODO : throw error
  }
  return res.status(StatusCodes.UNAUTHORIZED).send({
    message: 'unauthorized',
  });
};
