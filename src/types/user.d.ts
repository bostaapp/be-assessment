interface IUser {
  id: string;
  authId: string;
  email: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ICreateUser {
  email: string;
  password?: string;
  passwordConfirmation?: string;
}

interface IAuthUser {
  id: string;
  email: string;
}
