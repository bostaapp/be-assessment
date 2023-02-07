import { ApiProperty } from "@nestjs/swagger";
import { Health } from "../schemas/health.schema";

export class HealthReport {
  @ApiProperty()
  status: "UP" | "DOWN";

  @ApiProperty()
  availability: number;

  @ApiProperty()
  outages: number;

  @ApiProperty()
  downtime: number;

  @ApiProperty()
  uptime: number;

  @ApiProperty()
  responseTime: number;

  @ApiProperty({ type: [Health] })
  history: Partial<Health>[];
}
