import * as reportModel from '../models/report.model';

export const create = async (report: ICreateReportBody, urlCheck: IUrlCheck): Promise<IReport> => {
  return reportModel.create(report, urlCheck);
};
