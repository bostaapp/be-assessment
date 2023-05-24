import { genSalt, hash, compare } from "bcryptjs";

export class PasswordService {
  static async hashPassword(password: string) {
    const salt = await genSalt();
    const hashedPassword = await hash(password, salt);

    return hashedPassword;
  }

  static async comparePassword(
    inputPassword: string,
    userPassword: string
  ): Promise<boolean> {
    return compare(inputPassword, userPassword);
  }
}
