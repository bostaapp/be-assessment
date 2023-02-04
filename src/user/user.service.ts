import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User, UserDocument } from "./schemas/user.schema";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  create(dto: CreateUserDto) {
    return this.userModel.create(dto);
  }

  findEmail(email: string) {
    return this.userModel.findOne({ email }, { password: true });
  }

  findOne(id: string) {
    return this.userModel.findById(id);
  }

  findAll() {
    return this.userModel.find();
  }

  update(id: string, dto: UpdateUserDto) {
    return this.userModel.findOneAndUpdate({ id }, dto);
  }

  remove(id: string) {
    return this.userModel.findOneAndDelete({ id });
  }
}
