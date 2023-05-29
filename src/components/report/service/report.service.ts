import { ICreateReport } from '../interfaces';
import { ReportRepository } from '../repository/report.repository';

export class ReportService {
  private reportRepository = new ReportRepository();

  async create(report: ICreateReport) {
    return await this.reportRepository.create(report);
  }

  async getReportById(_id: string, userId: string) {
    return await this.reportRepository.readOne({ _id, userId });
  }

  async getReportByCheckId(checkId: string, userId: string) {
    return await this.reportRepository.read({ checkId, userId });
  }

  async getReportsByUserId(userId: string) {
    const data = await this.reportRepository.read({ userId });
    return data;
  }
}
