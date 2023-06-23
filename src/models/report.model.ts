import { getRepository } from 'typeorm';

import { connect } from './index';
import { Report } from '../entity/report.entity';

const getReportRepository = async () => {
  await connect();
  return getRepository(Report);
};

export const create = async (report: ICreateReportBody, urlCheck: IUrlCheck): Promise<IReport> => {
  const reportRepository = await getReportRepository();

  const createdReport: IReport = reportRepository.create({ ...report, urlCheck });
  return reportRepository.save(createdReport);
};

export const list = async (urlCheck: IUrlCheck, options: IListReportOptions): Promise<[IReport[], number]> => {
  const skip = (options.pageNumber - 1) * options.pageSize;
  const where = { urlCheck };

  const queryBuilder = (await getReportRepository()).createQueryBuilder('report');
  queryBuilder
    .select([
      'report.id',
      'report.status',
      'report.outage',
      'report.uptime',
      'report.downtime',
      'report.responseTime',
      'report.history',
      'report.createdAt',
    ])
    .orderBy('report.createdAt', 'DESC')
    .where(where)
    .take(options.pageSize)
    .skip(skip);

  return queryBuilder.getManyAndCount();
};
