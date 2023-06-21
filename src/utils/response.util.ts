import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const respondWithJson = (
  res: Response,
  statusCode: StatusCodes,
  data: any = {},
): Response<any, Record<string, any>> => {
  return res.status(statusCode || StatusCodes.OK).json({
    data,
  });
};
