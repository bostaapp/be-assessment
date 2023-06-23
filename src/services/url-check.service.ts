import * as urlCheckModel from '../models/url-check.model';
import * as monitorService from './monitor.service';
import { createNewAppError } from '../utils/error.util';
import { USER_ERRORS } from '../constants/error';

export const create = async (urlCheck: ICreateUrlCheckBody, user: IUser): Promise<IUrlCheck> => {
  if (!user) throw createNewAppError(USER_ERRORS.E5001);
  // conversion => could be separated function
  urlCheck.timeout = urlCheck.timeout * 1000;
  urlCheck.interval = urlCheck.interval * 1000 * 60;

  const createdUrlCheck = await urlCheckModel.create(urlCheck, user);
  await monitorService.monitor(createdUrlCheck);
  return createdUrlCheck;
};

export const list = (user: IUser, options: IListOptions): Promise<[IUrlCheck[], number]> => {
  if (!user) throw createNewAppError(USER_ERRORS.E5001);
  return urlCheckModel.list(user, options);
};

export const getUrlCheckById = (id: string, user: IUser): Promise<IUrlCheck> => {
  return urlCheckModel.getUrlCheckById(id, user);
};

export const getUrlCheckByUrl = (url: string, user: IUser): Promise<IUrlCheck> => {
  return urlCheckModel.getUrlCheckByUrl(url, user);
};
