import {
  Body,
  Req,
  Controller,
  Get,
  Inject,
  Post,
  UseGuards,
  Param,
  ForbiddenException,
} from "@nestjs/common";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { AuthService } from "./auth.service";
import { RefreshTokenGuard } from "./guards/jwt-refresh.guard";
import { LocalAuthGuard } from "./guards/local.guard";
import { Request } from "express";
import { Public } from "./guards/public.guard";
import { RefreshTokenUser } from "./types/auth_user";

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

  @Get("verify/new")
  async newVerify(@Req() req: Request) {
    if (!req.user) throw new ForbiddenException("Authentication token invalid");
    return this.authService.newVerifyEmail(req.user);
  }

  @Public()
  @Get("verify/:token")
  async verify(@Param("token") token: string) {
    return this.authService.verifyEmail(token);
  }

  @Get("me")
  async me(@Req() req: Request) {
    return req.user;
  }

  @UseGuards(RefreshTokenGuard)
  @Get("refresh")
  async refresh(@Req() req: Request) {
    return this.authService.refreshToken(req.user as RefreshTokenUser);
  }
}
