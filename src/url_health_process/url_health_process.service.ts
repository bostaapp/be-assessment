import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUrlHealthProcessDto } from "./dto/create-url_health_process.dto";
import { UpdateUrlHealthProcessDto } from "./dto/update-url_health_process.dto";
import { UrlHealthProcess } from "./entities/url_health_process.entity";

@Injectable()
export class UrlHealthProcessService {
  constructor(
    @InjectRepository(UrlHealthProcess)
    private urlRepo: Repository<UrlHealthProcess>,
  ) {}

  create(dto: CreateUrlHealthProcessDto) {
    const urlProcess = new UrlHealthProcess(dto);
    return this.urlRepo.save(urlProcess);
  }

  findAll() {
    return this.urlRepo.find();
  }

  findOne(id: number) {
    return this.urlRepo.findOneBy({ id });
  }

  update(id: number, dto: UpdateUrlHealthProcessDto) {
    const urlProcess = new UrlHealthProcess(dto);
    return this.urlRepo.update(id, urlProcess);
  }

  remove(id: number) {
    return this.urlRepo.delete(id);
  }
}
