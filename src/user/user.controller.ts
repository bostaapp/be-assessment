import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  ForbiddenException,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Request } from "express";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { User } from "./schemas/user.schema";

@ApiBearerAuth()
@ApiTags("user")
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
  ): Promise<User> {
    if (id !== req.user.id) throw new ForbiddenException();
    return this.userService.update(id, updateUserDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string, @Req() req: Request): Promise<User> {
    if (id !== req.user.id) throw new ForbiddenException();
    return this.userService.remove(id);
  }
}
