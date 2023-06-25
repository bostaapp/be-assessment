import { getRepository } from 'typeorm';

import { connect } from './index';
import { User } from '../entity/user.entity';

const getUserRepository = async () => {
  await connect();
  return getRepository(User);
};

export const create = async (uid: string, user: ICreateUser): Promise<IUser> => {
  const userRepository = await getUserRepository();

  const createduser = userRepository.create({ ...user, authId: uid });
  return userRepository.save(createduser);
};

export const getUserByAuthId = async (authId: string): Promise<IUser> => {
  const userRepository = await getUserRepository();
  return userRepository.findOne({ authId });
};

export const getUserByEmail = async (email: string): Promise<IUser> => {
  const userRepository = await getUserRepository();
  return userRepository.findOne({ email });
};
