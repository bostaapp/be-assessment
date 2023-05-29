import { ICreateReport } from '../interfaces';
import { Report } from '../model/report.model';

export class ReportRepository {
  async create(report: ICreateReport) {
    try {
      return await Report.create(report);
    } catch (err) {
      throw err;
    }
  }

  async read(filter: Object = {}, fields: string = '') {
    try {
      return await Report.find(filter).select(fields);
    } catch (err) {
      throw err;
    }
  }

  async readOne(filter: Object = {}, fields: string = '') {
    try {
      return await Report.findOne(filter).select(fields);
    } catch (err) {
      throw err;
    }
  }
}
