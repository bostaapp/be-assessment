import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "src/user/user.module";
import { AuthService } from "./auth.service";
import { LocalStrategy } from "./strategies/local.strategy";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { AccessTokenStrategy } from "./strategies/jwt-access.strategy";
import { RefreshTokenStrategy } from "./strategies/jwt-refresh.strategy";
import { NotifierModule } from "src/notifier/notifier.module";

@Module({
  imports: [UserModule, PassportModule, JwtModule, NotifierModule],
  providers: [
    AuthService,
    LocalStrategy,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
