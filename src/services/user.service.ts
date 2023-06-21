import * as userModel from '../models/user.mode';
import * as firebaseService from './firebase.service';
import { sendEmail } from '../helpers/sendgrid.helper';
import { VERIFICATION_USER_CONFIG } from '../config/config';

export const create = async (user: ICreateUser): Promise<IUser> => {
  const { email, password } = user;

  // create firebase user
  const firebaseUser: ICreateFirebaseUser = { email, password };
  const { uid, link } = await firebaseService.createUser(firebaseUser);

  // create user in DB
  const createdUser: IUser = await userModel.create(uid, user);

  // send verification email
  await sendEmail(
    {
      email,
      name: email,
    },
    {
      email: VERIFICATION_USER_CONFIG.fromEmail,
      name: VERIFICATION_USER_CONFIG.fromName,
    },
    `<strong>Please virify your email by clicking of this <a href=${link}>link></a>/strong>`,
  );

  return createdUser;
};

export const getUserByAuthId = (authId: string): Promise<IUser> => {
  return userModel.getUserByAuthId(authId);
};

export const getUserByEmail = (email: string): Promise<IUser> => {
  return userModel.getUserByEmail(email);
};
