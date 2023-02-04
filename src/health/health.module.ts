import { Module } from "@nestjs/common";
import { HealthService } from "./health.service";
import { HttpModule } from "@nestjs/axios";
import { MongooseModule } from "@nestjs/mongoose";
import { Health, HealthSchema } from "./schemas/health.schema";

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{ name: Health.name, schema: HealthSchema }]),
  ],
  providers: [HealthService],
  exports: [HealthService],
})
export class HealthModule {}
