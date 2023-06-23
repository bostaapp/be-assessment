import Joi from 'joi';

import * as urlCheckService from '../services/url-check.service';
import { createNewAppError } from '../utils/error.util';
import { URLCHECK_ERRORS } from '../constants/error';
import Logger from '../utils/logger.util';

export const SCHEMA_LIST_URL_CHECK_QUERY = Joi.object({
  pageSize: Joi.number().default(20),
  pageNumber: Joi.number().default(1),
}).optional();

export const SCHEMA_CREATE_URL_CHECK_BODY = Joi.object({
  name: Joi.string().trim().required(),
  url: Joi.string().trim().domain().required(),
  protocol: Joi.string().valid('HTTP', 'HTTPS', 'TCP').required(),
  path: Joi.string().trim().optional().default('/'),
  port: Joi.number().optional(),
  webhook: Joi.string().trim().optional(),
  timeout: Joi.number().optional().default(5), // sec
  interval: Joi.number().optional().default(10), // min
  threshold: Joi.number().optional().default(1),
  authentication: Joi.object({
    username: Joi.string().min(5).max(30).required(),
    password: Joi.string().required(),
  }).optional(),
  httpHeaders: Joi.array()
    .items(
      Joi.object({
        key: Joi.string(),
        value: Joi.string(),
      }),
    )
    .optional(),
  assert: Joi.object({
    statusCode: Joi.number().positive().required(),
  }).optional(),
  tags: Joi.array().items(Joi.string()).default(['']),
  ignoreSsl: Joi.boolean().required(),
})
  .options({
    stripUnknown: true,
  })
  .required();

export const isUrlCheckExistedByUrlForSameUser = async (url: string, user: IUser): Promise<void> => {
  const urlCheck = await urlCheckService.getUrlCheckByUrl(url, user);
  if (urlCheck) {
    Logger.error(URLCHECK_ERRORS.E6000.message, { urlCheck });
    throw createNewAppError(URLCHECK_ERRORS.E6000);
  }
};
