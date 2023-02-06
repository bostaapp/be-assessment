import { Controller, Get, ParseArrayPipe, Query, Req } from "@nestjs/common";
import { Request } from "express";
import { HealthService } from "./health.service";

@Controller("health")
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get("report")
  report(
    @Query("process") process: string,
    @Query("tags", ParseArrayPipe) tags: string[],
    @Req() req: Request,
  ) {
    const { id } = req.user;
    return this.healthService.genReport({
      processId: process,
      userId: id,
      tags,
    });
  }
}
