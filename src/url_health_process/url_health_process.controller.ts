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
import { UrlHealthProcessService } from "./url_health_process.service";
import { CreateUrlHealthProcessDto } from "./dto/create-url_health_process.dto";
import { UpdateUrlHealthProcessDto } from "./dto/update-url_health_process.dto";
import { Request } from "express";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiBearerAuth()
@ApiTags("url")
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
    return this.urlHealthProcessService.create(
      req.user.id,
      createUrlHealthProcessDto,
    );
  }

  @Get()
  findAll(@Req() req: Request) {
    return this.urlHealthProcessService.findAll(req.user.id);
  }

  @Get(":id")
  findOne(@Param("id") id: string, @Req() req: Request) {
    return this.urlHealthProcessService.findOne(id, req.user.id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateUrlHealthProcessDto: UpdateUrlHealthProcessDto,
    @Req() req: Request,
  ) {
    return this.urlHealthProcessService.update(
      id,
      req.user.id,
      updateUrlHealthProcessDto,
    );
  }

  @Delete(":id")
  remove(@Param("id") id: string, @Req() req: Request) {
    return this.urlHealthProcessService.remove(id, req.user.id);
  }
}
