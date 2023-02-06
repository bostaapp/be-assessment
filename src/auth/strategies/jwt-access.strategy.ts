import { ForbiddenException, Injectable, Logger, Req } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { jwtConstants } from "../constants";
import { AuthUser } from "../types/auth_user";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, "jwt") {
  private logger = new Logger(AccessTokenStrategy.name);
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
      passReqToCallback: true,
    });
  }

  validate(@Req() req: Request, user: AuthUser) {
    const { id, email, username, emailVerified } = user;

    const newEmailVerificationPath = "/auth/verify/new";
    const reqPath = req.originalUrl;

    if (!emailVerified && reqPath !== newEmailVerificationPath) {
      this.logger.warn(
        `User ${email} tried to access ${reqPath} without verifying their email`,
      );
      throw new ForbiddenException(
        `Please verify your email at ${newEmailVerificationPath}`,
      );
    }

    return {
      id,
      email,
      username,
      emailVerified,
    };
  }
}
