import { Process, Processor } from "@nestjs/bull";
import { Logger } from "@nestjs/common";
import { Job } from "bull";
import { NotifiersDriver } from "../notifier/notifiers/notifier.driver";
import { HealthService } from "../health/health.service";
import { UrlHealthProcess } from "../url_health_process/schemas/url_health_process.schema";

@Processor("process_queue")
export class QueueProcessor {
  private readonly logger = new Logger(QueueProcessor.name);
  constructor(private readonly healthService: HealthService) {}

  @Process()
  async processUrl(job: Job<UrlHealthProcess>) {
    try {
      this.logger.log(`processing job: ${job.data.name}`);
      await this.healthService.checkAndSave(job.data);
    } catch (err) {
      const notifier = new NotifiersDriver(job.data);
      this.logger.warn("Error processing job: " + err.message);

      await notifier.notify("Error processing job", err.message);
    }
  }
}
