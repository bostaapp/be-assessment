import * as userService from './user.service';

export const register = async (authData: IRegister): Promise<IUser> => {
  const { password, email } = authData;

  // create user
  const user: ICreateUser = {
    email,
    password,
  };

  return userService.create(user);
};
