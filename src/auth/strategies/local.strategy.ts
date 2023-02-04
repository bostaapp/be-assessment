import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "../auth.service";
import { User } from "../../user/schemas/user.schema";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: "email" });
  }

  async validate(email: string, password: string): Promise<Partial<User>> {
    const user = await this.authService.validateUser(email, password);

    if (!user) throw new UnauthorizedException();

    return user;
  }
}
