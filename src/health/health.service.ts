import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, PipelineStage, Types } from "mongoose";
import { firstValueFrom } from "rxjs";
import { UrlHealthProcess } from "src/url_health_process/schemas/url_health_process.schema";
import { Health } from "./schemas/health.schema";
import * as https from "node:https";
import { ValidationError } from "class-validator";
import { HealthReport } from "./dto/HealthReport";

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);
  constructor(
    private readonly httpService: HttpService,
    @InjectModel(Health.name)
    private readonly healthModel: Model<Health>,
  ) {}

  async check(process: UrlHealthProcess): Promise<Partial<Health>> {
    const url = new URL(`http://${process.url}`);
    url.protocol = process.protocol;
    url.pathname = process.path;
    if (process.authentication) {
      url.username = process.authentication.username;
      url.password = process.authentication.password;
    }

    const { timeout, httpHeaders, assertion, ignoreSSL } = process;

    const headers = httpHeaders.reduce(
      (prev, cur) => ({
        ...prev,
        [cur.key]: cur.value,
      }),
      {},
    );

    let result: {
      status: "UP" | "DOWN";
      responseTime: number;
      error?: string;
      time: number;
    } = {
      status: "DOWN",
      responseTime: 0,
      time: process.interval,
    };
    try {
      const start = Date.now();
      await firstValueFrom(
        this.httpService.head(url.toString(), {
          timeout: timeout * 1e3,
          headers,
          httpsAgent: new https.Agent({
            rejectUnauthorized: !ignoreSSL,
          }),
          validateStatus(status) {
            if (assertion?.statusCode) return status == assertion.statusCode;
            return status >= 200 && status < 300;
          },
        }),
      );
      const end = Date.now();

      result.responseTime = end - start;

      result.status = "UP";
    } catch (err) {
      result.error = err.message;
    }

    return result;
  }

  async checkAndSave(process: UrlHealthProcess) {
    const health = await this.check(process);

    // @ts-ignore
    health.process = new Types.ObjectId(process._id.toString());
    // @ts-ignore
    health.owner = new Types.ObjectId(process.user._id.toString());

    await this.healthModel.create(health);

    if (health.status == "DOWN") {
      throw new Error(
        `Health check failed for process ${
          process.name
        } on ${new Date().toUTCString()}`,
      );
    }
  }

  async genReport({
    processId,
    userId,
    tags,
  }: {
    processId?: string;
    userId?: string;
    tags?: string[];
  }): Promise<HealthReport[]> {
    if (!processId && !userId && !tags) throw new ValidationError();

    const process = processId ? new Types.ObjectId(processId) : undefined;
    const owner = userId ? new Types.ObjectId(userId) : undefined;

    const sortStage: PipelineStage = {
      $sort: {
        createdAt: -1,
      },
    };

    let andArray: { [key: string]: Types.ObjectId }[] = [{ owner }];

    if (process) andArray.push({ process });

    const matchStage: PipelineStage = {
      $match: {
        $and: andArray,
      },
    };

    this.logger.debug(matchStage);

    const groupStage: PipelineStage = {
      $group: {
        _id: {
          process: "$process",
          status: "$status",
        },
        count: { $count: {} },
        responseTime: { $avg: "$responseTime" },
        time: { $sum: "$time" },
        history: { $push: "$$ROOT" },
      },
    };

    const projectStage: PipelineStage = {
      $project: {
        _id: 0,
        status: "$_id.status",
        process: "$_id.process",
        responseTime: 1,
        time: 1,
        history: {
          responseTime: 1,
          createdAt: 1,
          status: 1,
        },
      },
    };

    const lookupStage: PipelineStage = {
      $lookup: {
        from: "urlhealthprocesses",
        localField: "process",
        foreignField: "_id",
        as: "process",
      },
    };

    const unwindStage: PipelineStage = {
      $unwind: "$process",
    };

    let pipeline: PipelineStage[] = [
      matchStage,
      sortStage,
      groupStage,
      projectStage,
      lookupStage,
      unwindStage,
    ];

    if (tags?.length) {
      pipeline.push({
        $match: {
          "process.tags": { $in: tags },
        },
      });
    }

    const extraPipeline: PipelineStage[] = [
      {
        $group: {
          _id: "$process",
          uptime: { $sum: { $cond: [{ $eq: ["$status", "UP"] }, "$time", 0] } },
          downtime: {
            $sum: { $cond: [{ $eq: ["$status", "DOWN"] }, "$time", 0] },
          },
          responseTime: { $sum: "$responseTime" },
          history: { $push: "$history" },
          status: { $first: "$status" },
        },
      },
      {
        $project: {
          _id: 0,
          process: "$_id",
          uptime: 1,
          downtime: 1,
          responseTime: 1,
          history: 1,
          availability: {
            $divide: ["$uptime", { $sum: ["$uptime", "$downtime"] }],
          },
        },
      },
    ];

    pipeline.push(...extraPipeline);

    const result = await this.healthModel.aggregate<{
      uptime: number;
      downtime: number;
      responseTime: number;
      process: UrlHealthProcess;
      history: Partial<Health>[][];
      availability: number;
    }>(pipeline);

    const report: HealthReport[] = result.map((res) => {
      let history: Partial<Health>[] = [];

      const downHistory =
        res.history[0][0]?.status === "DOWN" ? res.history[0] : res.history[1];
      const upHistory =
        res.history[0][0]?.status === "UP" ? res.history[0] : res.history[1];

      if (upHistory) history.push(...upHistory);
      if (downHistory) history.push(...downHistory);

      history = history.sort(
        (a, b) => b.createdAt?.getTime() - a.createdAt?.getTime(),
      );

      const status = history[0]?.status;

      const outages = downHistory?.length ?? 0;

      return {
        ...res,
        upHistory: undefined,
        downHistory: undefined,
        history,
        status,
        outages,
      };
    });

    return report;
  }
}
