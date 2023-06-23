import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import * as urlCheckValidation from '../validations/url-check.validation';
import * as urlCheckService from '../services/url-check.service';
import { respondWithJson } from '../utils/response.util';
import Logger from '../utils/logger.util';

export const create = async (req: Request, res: Response): Promise<Response<IUrlCheck, Record<string, number>>> => {
  const user = req.locals.user;

  const urlCheck: ICreateUrlCheckBody = await urlCheckValidation.SCHEMA_CREATE_URL_CHECK_BODY.validateAsync(req.body);
  await urlCheckValidation.isUrlCheckExistedByUrlForSameUser(urlCheck.url, user);

  const createdUrlCheck = await urlCheckService.create(urlCheck, user);
  return respondWithJson(res, StatusCodes.CREATED, createdUrlCheck);
};

export const list = async (
  req: Request,
  res: Response,
): Promise<Response<[IUrlCheck[], number, number, number, string], Record<string, string>>> => {
  const user = req.locals.user;
  Logger.info('START list');
  const options: IListOptions = await urlCheckValidation.SCHEMA_LIST_URL_CHECK_QUERY.validateAsync(req.query);

  const [urlChecks, count] = await urlCheckService.list(user, options);

  Logger.info('FINISH LIST', { urlChecks });
  return respondWithJson(res, StatusCodes.OK, {
    urlChecks,
    totalCount: count,
    pageNumber: options.pageNumber,
    pageSize: options.pageSize,
  });
};
