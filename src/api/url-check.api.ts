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

export const list = async (req: Request, res: Response): Promise<Response<IUrlCheck[], Record<string, string>>> => {
  const user = req.locals.user;
  Logger.info('START list');
  const options: IListUrlCheckOptions = await urlCheckValidation.SCHEMA_LIST_URL_CHECK_QUERY.validateAsync(req.query);

  const [urlChecks, count] = await urlCheckService.list(user, options);

  Logger.info('FINISH LIST', { urlChecks });
  return respondWithJson(res, StatusCodes.OK, {
    urlChecks,
    totalCount: count,
    pageNumber: options.pageNumber,
    pageSize: options.pageSize,
  });
};

export const getUrlCheckById = async (
  req: Request,
  res: Response,
): Promise<Response<IUrlCheck, Record<string, number>>> => {
  const id = req.params.urlCheckId;
  const user = req.locals.user;

  const urlCheck = await urlCheckValidation.isUrlCheckExistedById(id, user);
  return respondWithJson(res, StatusCodes.OK, { urlCheck });
};

export const update = async (req: Request, res: Response): Promise<Response<IUrlCheck, Record<string, number>>> => {
  const urlCheckId = req.params.urlCheckId;
  const user = req.locals.user;

  await urlCheckValidation.isUrlCheckExistedById(urlCheckId, user);
  const urlCheck: IUpdateUrlCheckBody = await urlCheckValidation.SCHEMA_UPDATE_URL_CHECK_BODY.validateAsync(req.body);
  if (urlCheck.url) await urlCheckValidation.isUpdatedUrlCheckExistedForSameUser(urlCheckId, urlCheck.url, user);

  const updatedUrlCheck = await urlCheckService.updateUrlCheck(urlCheckId, urlCheck, user);
  return respondWithJson(res, StatusCodes.OK, { updatedUrlCheck });
};

export const remove = async (req: Request, res: Response): Promise<Response<void, Record<string, number>>> => {
  const urlCheckId = req.params.urlCheckId;
  const user = req.locals.user;

  await urlCheckValidation.isUrlCheckExistedById(urlCheckId, user);
  await urlCheckService.remove(urlCheckId);
  return respondWithJson(res, StatusCodes.OK);
};
