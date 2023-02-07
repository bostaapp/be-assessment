import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsPort,
  IsString,
  MinLength,
} from "class-validator";
import { Protocol } from "../schemas/url_health_process.schema";

export class CreateUrlHealthProcessDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty()
  @IsString()
  url: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(Protocol)
  protocol?: Protocol = Protocol.HTTP;

  @ApiPropertyOptional()
  @Type(() => String)
  @IsOptional()
  @IsString()
  path?: string = "/";

  @ApiPropertyOptional()
  @IsOptional()
  @IsPort()
  port?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  webhook?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  timeout?: number = 5;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  interval?: number = 10 * 60;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  threshold?: number = 1;

  @ApiPropertyOptional()
  @IsOptional()
  authentication?: {
    username: string;
    password: string;
  };

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  httpHeaders?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  assert?: {
    statusCode: number;
  };

  @ApiPropertyOptional()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  ignoreSSL?: boolean = false;
}
