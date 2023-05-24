import { IUser, IUserSignup, User } from "../models/user";
// import { PasswordService } from "./password.service";
import crypto from "crypto";
import { PasswordService } from "./password.service";
import { JwtService } from "./jwt.service";

export class UserService {
  public constructor() {}

  static async checkExists(email: string) {
    const user = await User.findOne({ email });
    return user;
  }

  static async signup(userDetails: IUserSignup) {
    let user = await UserService.checkExists(userDetails.email);

    if (user) {
      throw new Error(`User already Exists`);
    }
    // hash password
    userDetails.password = await PasswordService.hashPassword(
      userDetails.password
    );
    user = new User({
      ...userDetails,
    });
    const { verificationToken, hashedVerificationToken } =
      UserService.createVerificationToken();

    user.verificationToken = hashedVerificationToken;
    await user.save();
    return verificationToken;
  }

  static async login(userDetails: IUserSignup) {
    const user = await UserService.checkExists(userDetails.email);

    if (!user) {
      throw new Error(`User Not found`);
    }

    if (!user.verified) {
      throw new Error("User is not verified");
    }
    const validPassword = await PasswordService.comparePassword(
      userDetails.password,
      user.password
    );
    if (!validPassword) {
      throw new Error("Email or password is incorrect");
    }

    const accessToken = JwtService.generateAccessToken(user.id, user.email);
    return { user, accessToken };
  }

  static async verify(
    email: string,
    verificationToken: string
  ): Promise<void | Error> {
    const user = await UserService.checkExists(email);
    if (!user) {
      throw new Error(`User Not found`);
    }
    if (user.verified) {
      throw new Error(`User is already verified`);
    }

    const validToken = await UserService.compareVerificationToken(
      verificationToken,
      user.verificationToken
    );
    if (!validToken) {
      throw new Error("invalid verification token");
    }

    user.verified = true;
    await user.save();
  }

  static async compareVerificationToken(
    inputVerification: string,
    userVerificationToken: string
  ): Promise<boolean> {
    //TODO: compare Token
    const hashedInput = UserService.hashToken(inputVerification);
    return hashedInput === userVerificationToken;
  }

  static createVerificationToken(): {
    verificationToken: string;
    hashedVerificationToken: string;
  } {
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const hashedVerificationToken = UserService.hashToken(verificationToken);

    return { verificationToken, hashedVerificationToken };
  }

  private static hashToken(token: string) {
    return crypto.createHash("sha256").update(token).digest("hex");
  }
}
