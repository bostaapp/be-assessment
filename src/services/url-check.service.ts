import * as urlCheckModel from '../models/url-check.model';
import * as monitorService from './monitor.service';
import { createNewAppError } from '../utils/error.util';
import { USER_ERRORS } from '../constants/error';

export const create = async (urlCheck: ICreateUrlCheckBody, user: IUser): Promise<IUrlCheck> => {
  if (!user) throw createNewAppError(USER_ERRORS.E5001);

  const createdUrlCheck = await urlCheckModel.create(urlCheck, user);
  await monitorService.createMonitoring(createdUrlCheck.id, createdUrlCheck, user);

  return createdUrlCheck;
};

export const list = (user: IUser, options: IListUrlCheckOptions): Promise<[IUrlCheck[], number]> => {
  if (!user) throw createNewAppError(USER_ERRORS.E5001);
  return urlCheckModel.list(user, options);
};

export const getUrlCheckById = (id: string, user: IUser): Promise<IUrlCheck> => {
  return urlCheckModel.getUrlCheckById(id, user);
};

export const getUrlCheckByUrl = (url: string, user: IUser): Promise<IUrlCheck> => {
  return urlCheckModel.getUrlCheckByUrl(url, user);
};

export const updateUrlCheck = async (id: string, urlCheck: IUpdateUrlCheckBody, user: IUser): Promise<IUrlCheck> => {
  // updatedUrlCheck: has only the updated values not all the record
  await urlCheckModel.updateUrlCheck(id, urlCheck);

  const updatedUrlCheck = await urlCheckModel.getUrlCheckById(id, user);
  await monitorService.updateMonitoring(id, updatedUrlCheck, user);

  return updatedUrlCheck;
};

export const remove = async (id: string): Promise<void> => {
  await monitorService.deleteMonitoring(id);
  return urlCheckModel.remove(id);
};
