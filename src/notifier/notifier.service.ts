import { Injectable } from "@nestjs/common";
import { User } from "../user/schemas/user.schema";
import { EmailNotifier } from "./notifiers/email.notifier";
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "../auth/constants";

@Injectable()
export class NotifierService {
  constructor(private jwtService: JwtService) {}

  async sendEmailVerificationLink(user: User) {
    const emailNotifier = new EmailNotifier();

    const payload = {
      id: user._id.toString(),
      email: user.email,
      username: user.username,
    };

    const verificationToken = await this.jwtService.signAsync(payload, {
      expiresIn: "7d",
      secret: jwtConstants.secret,
    });

    const { PORT } = process.env;

    const verificationLink = `http://localhost:${PORT}/auth/verify/${verificationToken}`;

    return emailNotifier.notify(user.email, {
      subject: "Verify your email",
      html: `
      Please click the link below to verify your email: <a href="${verificationLink}">Verify</a>,

      ${verificationLink}`,
    });
  }
}
