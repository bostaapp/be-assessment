import { Controller, Get, ParseArrayPipe, Query, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { HealthReport } from "./dto/HealthReport";
import { HealthService } from "./health.service";

@ApiBearerAuth()
@Controller("health")
@ApiTags("health")
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get("report")
  report(
    @Req() req: Request,
    @Query("process") process?: string,
    @Query("tags", ParseArrayPipe) tags?: string[],
  ): Promise<HealthReport[]> {
    const { id } = req.user;
    return this.healthService.genReport({
      processId: process,
      userId: id,
      tags,
    });
  }
}
