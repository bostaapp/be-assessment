import { InjectQueue } from "@nestjs/bull";
import { Injectable, Logger } from "@nestjs/common";
import { Queue } from "bull";
import { UrlHealthProcess } from "src/url_health_process/schemas/url_health_process.schema";

@Injectable()
export class ProcessQueueService {
  private readonly logger = new Logger(ProcessQueueService.name);
  constructor(
    @InjectQueue("process_queue")
    private readonly pQ: Queue,
  ) {}

  async addProcess(process: UrlHealthProcess) {
    this.logger.log(`Adding process to queue: ${process.id}`);

    const queueMember = await this.pQ.add(process, {
      attempts: process.threshold ?? 1,
      jobId: process.id,
      repeat: {
        every: process.interval * 1e3,
      },
      delay: 0,
    });

    return queueMember;
  }
}
