import { ApiProperty } from "@nestjs/swagger";
import { Types } from "mongoose";

export class AuthUser {
  @ApiProperty()
  id: string;

  _id?: Types.ObjectId;

  @ApiProperty()
  email: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  emailVerified?: boolean;
}

export class RefreshTokenUser extends AuthUser {
  refreshToken: string;
}
