import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from "@nestjs/common";
import { TagsService } from "./tags.service";
import { CreateTagDto } from "./dto/create-tag.dto";
import { UpdateTagDto } from "./dto/update-tag.dto";
import { Request } from "express";

@Controller("tags")
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }

  @Get()
  findAll(@Req() req: Request) {
    return this.tagsService.findAll(req.user.id);
  }

  @Get(":id")
  findOne(@Param("id") id: string, @Req() req: Request) {
    return this.tagsService.findOne(+id, req.user.id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateTagDto: UpdateTagDto,
    @Req() req: Request,
  ) {
    updateTagDto.user = req.user;
    return this.tagsService.update(+id, updateTagDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string, @Req() req: Request) {
    return this.tagsService.remove(+id, req.user.id);
  }
}
