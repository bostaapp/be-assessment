import * as reportModel from '../models/report.model';
import { USER_ERRORS } from '../constants/error';
import { createNewAppError } from '../utils/error.util';

export const create = async (report: ICreateReportBody, urlCheck: IUrlCheck): Promise<IReport> => {
  return reportModel.create(report, urlCheck);
};

export const list = (user: IUser, options: IListReportOptions): Promise<[IReport[], number]> => {
  if (!user) throw createNewAppError(USER_ERRORS.E5001);
  return reportModel.list(user, options);
};
