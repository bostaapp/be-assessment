import { Request } from 'express';

export const extractAuthorizationToken = (req: Request & { authorization: string }): string => {
  const authorizationHeader = req.headers ? req.headers.authorization : null;
  if (!authorizationHeader) {
    return null;
  }

  const [schema, token] = authorizationHeader.split(' ');

  if (!schema || schema.toLocaleLowerCase() !== 'bearer' || !token) {
    return null;
  }

  return token;
};
