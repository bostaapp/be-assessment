import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";
import { HealthModule } from "src/health/health.module";
import { QueueProcessor } from "./processor";
import { ProcessQueueService } from "./process_queue.service";

@Module({
  imports: [
    BullModule.registerQueue({
      name: "process_queue",
    }),
    HealthModule,
  ],
  providers: [ProcessQueueService, QueueProcessor],
  exports: [ProcessQueueService],
})
export class ProcessQueueModule {}
