import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "../auth.service";
import { AuthUser } from "../types/auth_user";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: "email" });
  }

  async validate(email: string, password: string): Promise<AuthUser> {
    const user = await this.authService.validateUser(email, password);

    if (!user) throw new UnauthorizedException();

    return user;
  }
}
