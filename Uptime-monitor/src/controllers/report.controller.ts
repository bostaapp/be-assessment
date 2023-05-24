import { Request, Response } from "express";
import { CheckService } from "../services/check.service";
import { ReportService } from "../services/report.service";

export const getReport = async (request: Request, response: Response) => {
  try {
    // check the ownership of the check
    const checkId = request.params.id;
    const check = await CheckService.findById(checkId, request.currentUser!.id);
    if (!check) {
      throw new Error("URL Check Not found");
    }
    // get the report from the databse
    const report = await ReportService.getReport(
      checkId,
      request.currentUser!.id
    );
    if (!report) throw new Error("Report not found..");

    response.status(200).json(report);
  } catch (error: any) {
    return response.status(404).json({ message: error.message || "Error" });
  }
};

export const getReportsByTag = async (request: Request, response: Response) => {
  const reports = await ReportService.getReportsByTag(
    request.currentUser!.id,
    (request.query.tags as string[]) || []
  );
  response.status(200).json(reports);
};
