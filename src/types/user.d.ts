interface IUser {
  id: string;
  authId: string;
  email: string;
  urlChecks: IUrlCheck[];
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
