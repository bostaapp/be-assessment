import * as reportModel from '../models/report.model';
import { URLCHECK_ERRORS } from '../constants/error';
import { createNewAppError } from '../utils/error.util';

export const create = async (report: ICreateReportBody, urlCheck: IUrlCheck): Promise<IReport> => {
  return reportModel.create(report, urlCheck);
};

export const list = (urlcheck: IUrlCheck, options: IListReportOptions): Promise<[IReport[], number]> => {
  if (!urlcheck) throw createNewAppError(URLCHECK_ERRORS.E6001);
  return reportModel.list(urlcheck, options);
};
