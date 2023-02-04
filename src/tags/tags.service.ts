import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateTagDto } from "./dto/create-tag.dto";
import { UpdateTagDto } from "./dto/update-tag.dto";
import { Tag } from "./entities/tag.entity";

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepo: Repository<Tag>,
  ) {}

  create(createTagDto: CreateTagDto) {
    return this.tagRepo.save(createTagDto);
  }

  findAll(userId: number) {
    return this.tagRepo.findBy({
      user: { id: userId },
    });
  }

  findOne(id: number, userId: number) {
    return this.tagRepo.findOneBy({ id, user: { id: userId } });
  }

  update(id: number, updateTagDto: UpdateTagDto) {
    return this.tagRepo.update(id, updateTagDto);
  }

  remove(id: number, userId: number) {
    this.tagRepo.delete({ id, user: { id: userId } });
  }
}
