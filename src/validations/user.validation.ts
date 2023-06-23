import * as userService from '../services/user.service';
import { USER_ERRORS } from '../constants/error';
import { createNewAppError } from '../utils/error.util';

export const isEmailExisted = async (email: string): Promise<void> => {
  const user = await userService.getUserByEmail(email);
  if (user) throw createNewAppError(USER_ERRORS.E5000);
};
