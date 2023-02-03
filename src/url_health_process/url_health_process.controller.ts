import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from "@nestjs/common";
import { UrlHealthProcessService } from "./url_health_process.service";
import { CreateUrlHealthProcessDto } from "./dto/create-url_health_process.dto";
import { UpdateUrlHealthProcessDto } from "./dto/update-url_health_process.dto";

@Controller("url")
export class UrlHealthProcessController {
  constructor(
    private readonly urlHealthProcessService: UrlHealthProcessService,
  ) {}

  @Post()
  create(@Body() createUrlHealthProcessDto: CreateUrlHealthProcessDto) {
    return this.urlHealthProcessService.create(createUrlHealthProcessDto);
  }

  @Get()
  findAll() {
    return this.urlHealthProcessService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.urlHealthProcessService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateUrlHealthProcessDto: UpdateUrlHealthProcessDto,
  ) {
    return this.urlHealthProcessService.update(id, updateUrlHealthProcessDto);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.urlHealthProcessService.remove(id);
  }
}
