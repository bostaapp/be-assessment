import { Module } from "@nestjs/common";
import { UrlHealthProcessService } from "./url_health_process.service";
import { UrlHealthProcessController } from "./url_health_process.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UrlHealthProcess } from "./entities/url_health_process.entity";
import { Assertion } from "./entities/assertion.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UrlHealthProcess, Assertion])],
  controllers: [UrlHealthProcessController],
  providers: [UrlHealthProcessService],
})
export class UrlHealthProcessModule {}
