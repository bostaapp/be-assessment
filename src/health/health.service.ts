import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { firstValueFrom } from "rxjs";
import { UrlHealthProcess } from "src/url_health_process/schemas/url_health_process.schema";
import { Health } from "./schemas/health.schema";
import * as https from "node:https";

@Injectable()
export class HealthService {
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
      processId: string;
    } = {
      status: "DOWN",
      responseTime: 0,
      processId: process._id.toString(),
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

  async checkAndSave(process: UrlHealthProcess, userId: string) {
    const health = await this.check(process);
    health.ownerId = userId;

    return this.healthModel.create(health);
  }
}
