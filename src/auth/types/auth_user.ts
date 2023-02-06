import { Types } from "mongoose";

export interface AuthUser {
  id: string;
  _id?: Types.ObjectId;
  email: string;
  username: string;
  emailVerified?: boolean;
}

export interface RefreshTokenUser extends AuthUser {
  refreshToken: string;
}
