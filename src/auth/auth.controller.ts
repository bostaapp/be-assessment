import {
  Body,
  Req,
  Controller,
  Get,
  Inject,
  Post,
  UseGuards,
} from "@nestjs/common";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { AuthService } from "./auth.service";
import { RefreshTokenGuard } from "./guards/jwt-refresh.guard";
import { AccessTokenGuard } from "./guards/jwt-access.guard";
import { LocalAuthGuard } from "./guards/local.guard";
import { Request } from "express";
import { Public } from "./guards/public.guard";

@Controller("auth")
export class AuthController {
  constructor(
    @Inject(AuthService)
    private authService: AuthService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@Req() req: Request) {
    return this.authService.login(req.user);
  }

  @Public()
  @Post("register")
  async register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @UseGuards(AccessTokenGuard)
  @Get("me")
  async me(@Req() req: Request) {
    return req.user;
  }

  @UseGuards(RefreshTokenGuard)
  @Get("refresh")
  async refresh(@Req() req: Request) {
    return this.authService.refreshToken(req.user);
  }
}
