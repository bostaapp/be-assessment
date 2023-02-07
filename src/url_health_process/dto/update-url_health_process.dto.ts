import { PartialType } from "@nestjs/swagger";
import { CreateUrlHealthProcessDto } from "./create-url_health_process.dto";

export class UpdateUrlHealthProcessDto extends PartialType(
  CreateUrlHealthProcessDto,
) {}
