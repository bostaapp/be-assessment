import { Injectable } from "@nestjs/common";
import { User } from "../user/entities/user.entity";
import { UserService } from "../user/user.service";
import { hash, compare } from "bcrypt";
import { CreateUserDto } from "../user/dto/create-user.dto";

@Injectable()
export class AuthService {
  constructor(private usersService: UserService) {}

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return hash(password, saltRounds);
  }

  async register(dto: CreateUserDto): Promise<Partial<User>> {
    dto.password = await this.hashPassword(dto.password);
    const user = await this.usersService.create(dto);
    const { password: _, ...result } = user;
    return result;
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<Partial<User> | null> {
    const user = await this.usersService.findEmail(email);
    if (user) {
      const matches = await compare(password, user.password);
      if (matches) {
        const { password: _, ...result } = user;
        return result;
      }
    }

    return null;
  }
}
