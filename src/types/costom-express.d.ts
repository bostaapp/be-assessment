interface locals {
  auth: IAuthUser;
  user: IUser;
}
declare namespace Express {
  export interface Request {
    locals?: locals;
  }
}
