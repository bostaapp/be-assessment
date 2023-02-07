import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UrlHealthProcessModule } from "./url_health_process/url_health_process.module";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { APP_GUARD } from "@nestjs/core";
import { AccessTokenGuard } from "./auth/guards/jwt-access.guard";
import { MongooseModule } from "@nestjs/mongoose";
import { HealthModule } from "./health/health.module";
import { BullModule } from "@nestjs/bull";
import { ProcessQueueModule } from './process_queue/process_queue.module';
import { NotifierModule } from './notifier/notifier.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: +process.env.REDIS_PORT,
      },
    }),
    UrlHealthProcessModule,
    UserModule,
    AuthModule,
    HealthModule,
    ProcessQueueModule,
    NotifierModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class AppModule {}
