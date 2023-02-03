import { ForbiddenException, Injectable } from "@nestjs/common";
import { User } from "../user/entities/user.entity";
import { UserService } from "../user/user.service";
import { hash, compare } from "bcrypt";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "./constants";

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

  async validateUser(
    email: string,
    password: string,
  ): Promise<Partial<User> | null> {
    const user = await this.usersService.findEmail(email);
    if (user) {
      const matches = await compare(password, user.password);
      if (matches) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...result } = user;
        return result;
      }
    }

    return null;
  }

  async login(user: Partial<User>) {
    const { accessToken, refreshToken } = await this.genTokens(user);

    await this.updateRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  private async genTokens(user: Partial<User>) {
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

  private async updateRefreshToken(id: number, token: string) {
    return this.usersService.update(id, { refreshToken: token });
  }

  async refreshToken(reqUser: Partial<User>) {
    const { id, refreshToken } = reqUser;

    if (!id || !refreshToken) throw new ForbiddenException();

    const user = await this.usersService.findOne(id);
    if (!user) throw new ForbiddenException();

    if (user.refreshToken !== refreshToken) throw new ForbiddenException();

    return this.login(user);
  }
}
