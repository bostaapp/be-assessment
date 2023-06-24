import Joi from 'joi';

import * as urlCheckService from '../services/url-check.service';
import { createNewAppError } from '../utils/error.util';
import { URLCHECK_ERRORS } from '../constants/error';
import Logger from '../utils/logger.util';

export const SCHEMA_LIST_REPORT_QUERY = Joi.object({
  pageSize: Joi.number().default(20),
  pageNumber: Joi.number().default(1),
  tags: Joi.array().items(Joi.string()),
  urlCheckId: Joi.string(), // in list options not in query params for future minimum changes if we add another entity and want to fetch the reports with this new entity => just add its id here not new api required for it and less services of course
}).optional();

export const isUrlCheckExistedByUrlForSameUser = async (url: string, user: IUser): Promise<void> => {
  const urlCheck = await urlCheckService.getUrlCheckByUrl(url, user);
  if (urlCheck) {
    Logger.error(URLCHECK_ERRORS.E6000.message, { urlCheck });
    throw createNewAppError(URLCHECK_ERRORS.E6000);
  }
};
