import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export function validationMiddleware(
  BodySchema?: Joi.Schema,
  paramsSchema?: Joi.Schema,
  querySchema?: Joi.Schema
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const validationOptions: Joi.AsyncValidationOptions = {
      abortEarly: false,
      allowUnknown: false,
    };
    const validationPromises: Promise<any>[] = [];
    if (BodySchema) validationPromises.push(BodySchema.validateAsync(req.body));
    if (paramsSchema)
      validationPromises.push(
        paramsSchema.validateAsync(req.params, validationOptions)
      );
    if (querySchema)
      validationPromises.push(
        querySchema.validateAsync(req.query, validationOptions)
      );

    Promise.all(validationPromises)
      .then((results) => {
        // console.log(results);
        // const [validatedBody, validatedParams, validatedQuery] = results;
        // if (validatedBody) req.body = validatedBody;
        // if (validatedParams) req.params = validatedParams;
        // if (validatedQuery) req.query = validatedQuery;
        return next();
      })
      .catch((error) => {
        console.log(error);
        const errors: any[] = [];
        error.details?.forEach((err: any) => {
          errors.push(err.message);
        });
        res.status(400).send({ errors });
      });
  };
}
