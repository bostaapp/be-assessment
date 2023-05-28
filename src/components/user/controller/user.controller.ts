import { Request, Response } from 'express';
import { UserService } from '../service/user.service';
import { IUser } from '../interface/user.interface';
import { StatusCodes } from 'http-status-codes';
import { Encryptor } from '../../../core/service/password.hash.service';
import { sendVerificationEmail } from '../../../core/service/mailer.service';
import {
  generateToken,
  verifyToken,
} from '../../../core/service/token.service';
import { config } from 'dotenv';

const userService = new UserService();
const encryptor = new Encryptor();
config();
export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const userExist = await userService.userExist({ email });
    if (userExist) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send({ message: 'User already exists' });
    }
    const hashedPassword = await encryptor.hashPassword(password);
    const user: IUser = {
      name,
      email,
      password: hashedPassword,
    };
    const data = await userService.create(user);
    console.log(typeof data._id);
    const token = generateToken(data._id);
    await sendVerificationEmail(
      email,
      'Please verify your email',
      `
    <h1>Welcome ${name}</h1>
    Thank you for signing up!
    <a href="${process.env.BASE_URL}/user/verify/${token}">Click here to verify your email </a>`
    );
    return res.status(StatusCodes.CREATED).send({
      message: 'Account Created, Please, Verify your account',
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: error });
  }
};

export const verify = async (req: Request, res: Response) => {
  const token = req.params.token;
  const reverseToken: any = verifyToken(token);
  const userExist = userService.userExist({ _id: reverseToken.id });
  if (userExist) {
    const result = await userService.updateUser(reverseToken._id, {
      isVerified: true,
    });
    if (result) {
      return res
        .status(StatusCodes.OK)
        .send({ message: 'Your Account has been Verified Successfully' });
    } else {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ message: 'Internal Server Error, please try again later.' });
    }
  }
  res.status(StatusCodes.FORBIDDEN).send({ message: 'Verification Failed' });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user: any = await userService.getByEmail(email);
  if (user) {
    const passwordMatches = await encryptor.compare(password, user.password);
    console.log(passwordMatches);
    if (passwordMatches) {
      const token = generateToken(user._id);
      return res.status(StatusCodes.OK).send({
        data: {
          ...user._doc,
          password: undefined,
          token,
        },
      });
    }
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: 'password is incorrect!' });
  }

  return res.status(StatusCodes.NOT_FOUND).send({ message: 'Email Not Found' });
};
