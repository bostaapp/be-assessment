import { Process, Processor } from "@nestjs/bull";
import { Logger } from "@nestjs/common";
import { Job } from "bull";
import { HealthService } from "src/health/health.service";
import { UrlHealthProcess } from "src/url_health_process/schemas/url_health_process.schema";

@Processor("process_queue")
export class QueueProcessor {
  private readonly logger = new Logger(QueueProcessor.name);
  constructor(private readonly healthService: HealthService) {}

  @Process()
  processUrl(job: Job<UrlHealthProcess>) {
    this.logger.log(`processing job: ${job.data.name}`);
    this.healthService.checkAndSave(job.data);
  }
}
