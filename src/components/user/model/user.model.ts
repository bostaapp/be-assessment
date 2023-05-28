import { string } from 'joi';
import { Schema, model } from 'mongoose';
import { IUser } from '../interface/user.interface';

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { collection: 'user' }
);

export const User = model<IUser>('User', UserSchema);
