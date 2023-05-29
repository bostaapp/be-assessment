import Joi from 'joi';
import { Protocols } from '../enums';

export const createCheckValidationSchema = Joi.object({
  name: Joi.string().required(),
  url: Joi.string().required(),
  protocol: Joi.string()
    .valid(Protocols.HTTP, Protocols.HTTPS, Protocols.TCP)
    .required(),
  path: Joi.string().optional(),
  port: Joi.number().optional(),
  webhook: Joi.string().optional(),
  timeout: Joi.number().optional(),
  interval: Joi.number().optional(),
  threshold: Joi.number().optional(),
  authentication: Joi.object({
    username: Joi.string(),
    password: Joi.string(),
  }).optional(),
  httpHeaders: Joi.any().optional(),
  assert: Joi.object({
    statusCode: Joi.string(),
  }).optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  ignoreSSL: Joi.boolean().optional(),
});

export const updateCheckValidationSchema = Joi.object({
  name: Joi.string().optional(),
  url: Joi.string().optional(),
  protocol: Joi.string()
    .valid(Protocols.HTTP, Protocols.HTTPS, Protocols.TCP)
    .optional(),
  path: Joi.string().optional(),
  port: Joi.number().optional(),
  webhook: Joi.string().optional(),
  timeout: Joi.number().optional(),
  interval: Joi.number().optional(),
  threshold: Joi.number().optional(),
  authentication: Joi.object({
    username: Joi.string(),
    password: Joi.string(),
  }).optional(),
  httpHeaders: Joi.any().optional(),
  assert: Joi.object({
    statusCode: Joi.string(),
  }).optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  ignoreSSL: Joi.boolean().optional(),
}).min(1);
