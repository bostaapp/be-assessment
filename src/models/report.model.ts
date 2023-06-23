import { getRepository } from 'typeorm';

import { connect } from './index';
import { Report } from '../entity/report.entity';

const getUrlCheckRepository = async () => {
  await connect();
  return getRepository(Report);
};

export const create = async (report: ICreateReportBody, urlCheck: IUrlCheck): Promise<IReport> => {
  const reportRepository = await getUrlCheckRepository();

  const createdReport: IReport = reportRepository.create({ ...report, urlCheck });
  return reportRepository.save(createdReport);
};
