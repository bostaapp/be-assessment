import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.userRepo.save(createUserDto);
  }

  findEmail(email: string): Promise<User | undefined> {
    return this.userRepo.findOneBy({ email });
  }

  findOne(id: number) {
    return this.userRepo.findOneBy({ id });
  }

  findAll() {
    return this.userRepo.find();
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    throw new Error("Not implemented");
  }

  remove(id: number) {
    throw new Error("Not implemented");
  }
}
