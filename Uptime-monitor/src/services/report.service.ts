import mongoose, { Document } from "mongoose";
import { IReport, Report, URL_STATUS } from "../models/report";
import { Check, ICheck } from "../models/check";
import { Types } from "mongoose";
import axios, { AxiosRequestConfig } from "axios";
import { CheckService } from "./check.service";

export class ReportService {
  static async getReport(checkId: string, userId: string) {
    const check = await CheckService.findById(checkId, userId);
    if (!check) return null;
    let report = await Report.findOne({ check: checkId });
    if (!report) {
      report = new Report({
        check: checkId,
      });
      await report.save();
    }

    return report;
  }

  static async generateReport(
    check: Document<unknown, {}, ICheck> &
      Omit<
        ICheck & {
          _id: Types.ObjectId;
        },
        never
      >
  ) {
    let checkReport = await Report.findOne({ check: check._id });
    if (!checkReport) {
      checkReport = new Report({
        check: check._id,
      });
      await checkReport.save();
    }

    try {
      const config: AxiosRequestConfig = {
        method: "get",
        url: `${check.protocol}://${check.url}${
          check.port ? ":" + check.port : ""
        }/${check.path ? check.path : ""}`,
        timeout: check.timeout,
        headers: check.httpHeaders,
        auth: check.authentication,
      };
      // axiosRetry
      const startTime = Date.now();

      const response = await axios(config);
      const endTime = Date.now();
      const duration = endTime - startTime;
      if (
        check.assert?.statusCode &&
        check.assert.statusCode !== response.status
      ) {
        checkReport = ReportService.handleReportData(
          checkReport,
          URL_STATUS.DOWN,
          check.interval!
        );
      } else {
        checkReport = ReportService.handleReportData(
          checkReport,
          URL_STATUS.UP,
          check.interval!
        );
      }
    } catch (error) {
      console.log("catcheddd");
      checkReport = ReportService.handleReportData(
        checkReport,
        URL_STATUS.DOWN,
        check.interval!
      );
      checkReport.outages++;
      if (checkReport.outages >= check.threshold!) {
        // emit event to send notification
      }
    } finally {
      check.lastCreatedTime = new Date();
      return [checkReport.save(), check.save()];
    }
  }

  static handleReportData(
    checkReport: Document<unknown, {}, IReport> &
      Omit<
        IReport & {
          _id: Types.ObjectId;
        },
        never
      >,
    status: URL_STATUS,
    interval: number
  ) {
    switch (status) {
      case URL_STATUS.UP: {
        checkReport.status = "up";
        checkReport.uptime = checkReport!.uptime + interval / 1000;
        break;
      }
      case URL_STATUS.DOWN: {
        checkReport.status = "down";
        checkReport!.downtime = checkReport!.downtime + interval! / 1000;
        break;
      }
    }

    checkReport.history.push({
      timestamp: new Date().toISOString(),
      status: checkReport.status,
    });
    checkReport.availability =
      (checkReport.uptime / (checkReport.uptime + checkReport.downtime)) * 100;
    return checkReport;
  }

  //TODO: USER CHECK
  static async deleteReport(checkId: string) {
    const deletedReport = await Report.deleteOne({
      check: checkId,
    });
    return deletedReport;
  }

  static async getReportsByTag(userId: string, tags?: string[]) {
    const aggregationPipeline = [
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "reports",
          localField: "_id",
          foreignField: "check",
          as: "report",
        },
      },
      {
        $unwind: {
          path: "$report",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          report: 1,
          _id: 0,
        },
      },
      {
        $replaceRoot: {
          newRoot: "$report",
        },
      },
    ];
    if (tags && tags.length > 0)
      //@ts-ignore
      aggregationPipeline[0]!.$match!.tags = {
        $in: tags,
      };

    const reports = await Check.aggregate(aggregationPipeline);
    return reports;
  }
}
