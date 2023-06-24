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

export const list = async (user: IUser, options: IListReportOptions): Promise<[IReport[], number]> => {
  const skip = (options.pageNumber - 1) * options.pageSize;

  const queryBuilder = (await getReportRepository()).createQueryBuilder('report');
  queryBuilder
    .leftJoin('report.urlCheck', 'urlCheck')
    .leftJoin('urlCheck.user', 'user')
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
    .where('user.id = :userId', { userId: user.id })
    .take(options.pageSize)
    .skip(skip);

  if (options.urlCheckId) queryBuilder.andWhere('urlCheck.id = :urlCheckId', { urlCheckId: options.urlCheckId });
  if (options.tags) queryBuilder.andWhere('"urlCheck"."tags"::text[] && ARRAY[:...tags]', { tags: options.tags });

  return queryBuilder.getManyAndCount();
};
