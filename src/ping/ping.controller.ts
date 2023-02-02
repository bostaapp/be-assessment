import { Controller, Get } from "@nestjs/common";

@Controller("ping")
export class PingController {
  @Get()
  ping(): string {
    return "PONG!";
  }
}
