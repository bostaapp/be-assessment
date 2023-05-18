import Joi from 'joi';
import _ from 'lodash';

/**
 * Generates a validation middleware to validate the request schema.
 * Supports `query`, `params`, and `body`; in that order.
 *
 * @param {Object} schema validation schemas
 * @param {Joi.schema|Object} [schema.params]
 * @param {Joi.schema|Object} [schema.query]
 * @param {Joi.schema|Object} [schema.body]
 *
 * @param {Object} [options] validation options passed to joi.
 *
 * @returns {Function} validation middleware.
 */
export const validate = (schema, options) => {
  const { params: paramsSchema = {}, query: querySchema = {}, body: bodySchema = {}, file: fileSchema = {} } = schema;

  // Schemas compiling is costly, perform it once and use in the generated middleware
  const compiledParamsSchema = Joi.compile(paramsSchema);
  const compiledQuerySchema = Joi.compile(querySchema);
  const compiledBodySchema = Joi.compile(bodySchema);
  const compiledFileSchema = Joi.compile(fileSchema);

  const validationOptions = { abortEarly: false, ...options };

  return (req, res, next) => {
    // Validate params if it has validation schema
    if (!_.isEmpty(paramsSchema)) {
      const { value: validatedParams, error } = compiledParamsSchema.validate(req.params, validationOptions);

      if (!_.isNil(error)) {
        error.source = 'params';
        next(error);
        return;
      }

      req.params = validatedParams;
    }

    // Validate query string if it has validation schema
    if (!_.isEmpty(querySchema)) {
      const { value: validatedQuery, error } = compiledQuerySchema.validate(req.query, validationOptions);

      if (!_.isNil(error)) {
        error.source = 'query';
        next(error);
        return;
      }

      req.query = validatedQuery;
    }

    // Validate body if it has validation schema
    if (!_.isEmpty(bodySchema)) {
      const { value: validatedBody, error } = compiledBodySchema.validate(req.body, validationOptions);

      if (!_.isNil(error)) {
        error.source = 'body';
        next(error);
        return;
      }

      req.body = validatedBody;
    }

    if (!_.isEmpty(fileSchema)) {
      const { value: validatedFile, error } = compiledFileSchema.required()
        .validate(req.file, { ...validationOptions, allowUnknown: true });

      if (!_.isNil(error)) {
        error.source = 'file';
        next(error);
        return;
      }
      req.file = validatedFile;
    }

    next();
  };
};
