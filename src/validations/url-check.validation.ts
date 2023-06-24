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
  timeout: Joi.number() // sec
    .optional()
    .default(5 * 1000)
    .custom((value) => value * 1000),
  interval: Joi.number() // min
    .optional()
    .default(10 * 1000 * 60)
    .custom((value) => value * 1000 * 60),
  threshold: Joi.number().optional().default(1),
  authentication: Joi.object({
    username: Joi.string().required(),
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

export const SCHEMA_UPDATE_URL_CHECK_BODY = Joi.object({
  name: Joi.string().trim().optional(),
  url: Joi.string().trim().domain().optional(),
  protocol: Joi.string().valid('HTTP', 'HTTPS', 'TCP').optional(),
  path: Joi.string().trim().optional(),
  port: Joi.number().optional(),
  webhook: Joi.string().trim().optional(),
  timeout: Joi.number()
    .optional()
    .custom((value) => value * 1000),
  interval: Joi.number()
    .optional()
    .custom((value) => value * 1000 * 60),
  threshold: Joi.number().optional(),
  authentication: Joi.object({
    username: Joi.string().required(),
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
  tags: Joi.array().items(Joi.string()),
  ignoreSsl: Joi.boolean().optional(),
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

export const isUpdatedUrlCheckExistedForSameUser = async (
  urlCheckId: string,
  url: string,
  user: IUser,
): Promise<void> => {
  const urlCheck = await urlCheckService.getUrlCheckByUrl(url, user);
  if (urlCheck && urlCheck.url === url && urlCheck.id !== urlCheckId) throw createNewAppError(URLCHECK_ERRORS.E6000);
};

export const isUrlCheckExistedById = async (id: string, user: IUser): Promise<IUrlCheck> => {
  const urlCheck = await urlCheckService.getUrlCheckById(id, user);
  if (!urlCheck) throw createNewAppError(URLCHECK_ERRORS.E6001);

  return urlCheck;
};
