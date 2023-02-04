import { Module } from "@nestjs/common";
import { UrlHealthProcessService } from "./url_health_process.service";
import { UrlHealthProcessController } from "./url_health_process.controller";
import { MongooseModule } from "@nestjs/mongoose";
import {
  UrlHealthProcess,
  UrlSchema,
} from "./schemas/url_health_process.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UrlHealthProcess.name, schema: UrlSchema },
    ]),
  ],
  controllers: [UrlHealthProcessController],
  providers: [UrlHealthProcessService],
})
export class UrlHealthProcessModule {}
