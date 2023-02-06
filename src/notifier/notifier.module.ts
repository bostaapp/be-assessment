import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { NotifierService } from "./notifier.service";

@Module({
  imports: [JwtModule],
  providers: [NotifierService],
  exports: [NotifierService],
})
export class NotifierModule {}
