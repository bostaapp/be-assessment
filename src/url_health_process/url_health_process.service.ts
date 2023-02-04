import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateUrlHealthProcessDto } from "./dto/create-url_health_process.dto";
import { UpdateUrlHealthProcessDto } from "./dto/update-url_health_process.dto";
import { UrlHealthProcess } from "./schemas/url_health_process.schema";

@Injectable()
export class UrlHealthProcessService {
  constructor(
    @InjectModel(UrlHealthProcess.name)
    private urlModel: Model<UrlHealthProcess>,
  ) {}

  create(userId: string, dto: CreateUrlHealthProcessDto) {
    dto["user"] = userId;
    return this.urlModel.create(dto);
  }

  findAll(userId: string) {
    return this.urlModel.find({ user: userId });
  }

  findOne(id: string, userId: string) {
    return this.urlModel.findOne({ id, user: userId });
  }

  update(id: string, userId: string, dto: UpdateUrlHealthProcessDto) {
    return this.urlModel.findOneAndUpdate({ id, user: userId }, dto);
  }

  remove(id: string, userId: string) {
    return this.urlModel.findOneAndDelete({ id, user: userId });
  }
}
