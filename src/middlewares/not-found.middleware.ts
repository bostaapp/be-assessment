import { Request, Response } from 'express';
import { ERRORS } from '../constants/error';

const notFoundMiddleware = (req: Request, res: Response) => {
  return res.status(ERRORS.E4000.statusCode).json({
    code: ERRORS.E4000.code,
    message: ERRORS.E4000.message,
  });
};

export default notFoundMiddleware;
