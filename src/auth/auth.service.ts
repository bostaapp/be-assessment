import { ForbiddenException, Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { hash, compare } from "bcrypt";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "./constants";
import { User } from "../user/schemas/user.schema";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return hash(password, saltRounds);
  }

  async register(dto: CreateUserDto): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    dto.password = await this.hashPassword(dto.password);
    const user = await this.usersService.create(dto);

    return this.login(user);
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findEmail(email);
    if (user) {
      const matches = await compare(password, user.password);
      if (matches) {
        return {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
        };
      }
    }

    return null;
  }

  async login(user: any) {
    const { accessToken, refreshToken } = await this.genTokens(user);

    await this.updateRefreshToken(user._id?.toString(), refreshToken);

    return { accessToken, refreshToken };
  }

  private async genTokens(user: any) {
    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
    };
    const accessTokenPromise = this.jwtService.signAsync(payload, {
      secret: jwtConstants.secret,
      expiresIn: jwtConstants.accessToken.expiresIn,
    });

    const refreshTokenPromise = this.jwtService.signAsync(payload, {
      secret: jwtConstants.secret,
      expiresIn: jwtConstants.refreshToken.expiresIn,
    });

    const [accessToken, refreshToken] = await Promise.all([
      accessTokenPromise,
      refreshTokenPromise,
    ]);

    return { accessToken, refreshToken };
  }

  private async updateRefreshToken(id: string, token: string) {
    return this.usersService.update(id, { refreshToken: token });
  }

  async refreshToken(reqUser: any) {
    const { id, refreshToken } = reqUser;

    if (!id || !refreshToken) throw new ForbiddenException();

    const user = await this.usersService.findOne(id?.toString());
    if (!user) throw new ForbiddenException();

    if (user.refreshToken !== refreshToken) throw new ForbiddenException();

    return this.login(user);
  }
}
