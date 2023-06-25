interface IRegister {
  email: string;
  password: string;
  passwordConfirmation: string;
}

interface ICreateFirebaseUser {
  email: string;
  password: string;
}

interface IUpdateFirebaseUser {
  disabled?: boolean;
}
