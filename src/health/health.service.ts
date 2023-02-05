import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, PipelineStage, Types } from "mongoose";
import { firstValueFrom } from "rxjs";
import { UrlHealthProcess } from "src/url_health_process/schemas/url_health_process.schema";
import { Health } from "./schemas/health.schema";
import * as https from "node:https";
import { ValidationError } from "class-validator";

export interface HealthReport {
  status: "UP" | "DOWN";
  availability: number;
  outages: number;
  downtime?: number;
  uptime?: number;
  responseTime: number;
  history: Partial<Health>;
}

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
    health.owner = new Types.ObjectId(process.user.toString());

    return this.healthModel.create(health);
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

    const matchStage: PipelineStage = {
      $match: {
        process,
        owner,
        tags: tags,
      },
    };

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

    const pipeline = [
      sortStage,
      //matchStage,
      groupStage,
      projectStage,
      lookupStage,
      unwindStage,
    ];

    //return pipeline as any;

    const result = await this.healthModel.aggregate<{
      status: "UP" | "DOWN";
      time: number;
      responseTime: number;
      process: UrlHealthProcess;
      history: Health[];
    }>(pipeline);

    let preReport: {
      [processName: string]: {
        uptime?: number;
        downtime?: number;
        responseTime: number;
        history: Health[];
        process: UrlHealthProcess;
      };
    } = {};

    return result as any;

    result.forEach((val) => {
      if (!preReport[val.process.name]) {
        preReport[val.process.name] = {
          uptime: 0,
          downtime: 0,
          responseTime: 0,
          history: [],
          process: val.process,
        };
      }

      preReport[val.process.name].history.push(...val.history);
    });

    result.forEach((val) => {
      if (val.status === "UP") {
        preReport[val.process.name].uptime = val.time;
        preReport[val.process.name].responseTime = val.responseTime;
      } else {
        preReport[val.process.name].downtime = val.time;
      }
    });

    const report = Object.values(preReport).map((val) => ({
      ...val,
      process: undefined,
      availability:
        (val.uptime ?? 0) / ((val.uptime ?? 0) + (val.downtime ?? 0)),
      outages: val.history.filter((val) => val.status === "DOWN").length,
      status: val.history.sort(
        (a, b) => (b?.createdAt.getTime() ?? 0) - (a?.createdAt.getTime() ?? 0),
      )[0].status,
    })) as HealthReport[];

    return report;
  }
}
