import mongoose, { Schema, model } from "mongoose";

export interface IUserSignup {
  email: string;
  password: string;
}

export interface IUser extends IUserSignup {
  verified: boolean;
  verificationToken: string;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
  },
});

const User = model<IUser>("User", userSchema);

export { User };
