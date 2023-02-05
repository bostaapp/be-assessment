import { Controller, Get, Query, Req } from "@nestjs/common";
import { Request } from "express";
import { Types } from "mongoose";
import { HealthService } from "./health.service";

@Controller("health")
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get("report")
  report(
    @Query("process") process: string,
    @Query("tags") tags: string[],
    @Req() req: Request,
  ) {
    const { id } = req.user;
    return this.healthService.genReport({
      userId: id,
      processId: process,
      tags,
    });
  }
}
