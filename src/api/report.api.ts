import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import * as reportValidation from '../validations/report.validation';
import * as urlCheckValidation from '../validations/url-check.validation';
import * as reportService from '../services/report.service';
import { respondWithJson } from '../utils/response.util';
import Logger from '../utils/logger.util';

export const list = async (
  req: Request,
  res: Response,
): Promise<Response<[IReport[], number, number, number, string], Record<string, string>>> => {
  const user = req.locals.user;

  Logger.info('START list');
  const options: IListReportOptions = await reportValidation.SCHEMA_LIST_REPORT_QUERY.validateAsync(req.query);
  const urlCheck: IUrlCheck = await urlCheckValidation.isUrlCheckExistedById(options.urlCheckId, user);

  const [report, count] = await reportService.list(urlCheck, options);

  Logger.info('FINISH LIST', { report });
  return respondWithJson(res, StatusCodes.OK, {
    report,
    totalCount: count,
    urlCheckId: options.urlCheckId,
    pageNumber: options.pageNumber,
    pageSize: options.pageSize,
  });
};
