import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Req,
} from "@nestjs/common";
import { UrlHealthProcessService } from "./url_health_process.service";
import { CreateUrlHealthProcessDto } from "./dto/create-url_health_process.dto";
import { UpdateUrlHealthProcessDto } from "./dto/update-url_health_process.dto";
import { Request } from "express";

@Controller("url")
export class UrlHealthProcessController {
  constructor(
    private readonly urlHealthProcessService: UrlHealthProcessService,
  ) {}

  @Post()
  create(
    @Body() createUrlHealthProcessDto: CreateUrlHealthProcessDto,
    @Req() req: Request,
  ) {
    createUrlHealthProcessDto.user = { id: req.user.id };
    return this.urlHealthProcessService.create(createUrlHealthProcessDto);
  }

  @Get()
  findAll(@Req() req: Request) {
    return this.urlHealthProcessService.findAll(req.user.id);
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number, @Req() req: Request) {
    return this.urlHealthProcessService.findOne(id, req.user.id);
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateUrlHealthProcessDto: UpdateUrlHealthProcessDto,
    @Req() req: Request,
  ) {
    updateUrlHealthProcessDto.user = req.user;
    return this.urlHealthProcessService.update(id, updateUrlHealthProcessDto);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number, @Req() req: Request) {
    return this.urlHealthProcessService.remove(id, req.user.id);
  }
}
