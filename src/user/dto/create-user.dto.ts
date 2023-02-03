import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from "class-validator";

export class CreateUserDto {
  @IsString()
  @Length(4, 20)
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  refreshToken?: string;
}
