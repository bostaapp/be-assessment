import { Logger } from "@nestjs/common";
import {
  createTestAccount,
  createTransport,
  getTestMessageUrl,
} from "nodemailer";
import { MailOptions } from "nodemailer/lib/sendmail-transport";
import { INotifier } from "./notifier.interface";

export class EmailNotifier implements INotifier {
  private _email: string;
  private logger = new Logger(EmailNotifier.name);

  constructor(email: string) {
    this._email = email;
  }

  async notify(subject: string, body: string) {
    const emailSent = await this.send(this._email, {
      subject,
      text: body,
    });

    this.logger.log("Email sent ", emailSent);

    return emailSent;
  }

  async send(target: string, opts: MailOptions) {
    const { user, pass } = await createTestAccount();

    const transporter = createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user,
        pass,
      },
    });

    const info = await transporter.sendMail({
      from: user,
      to: target,
      subject: opts.subject,
      text: opts.text,
      html: opts.html,
    });

    return `Preview link available at ${getTestMessageUrl(info)}`;
  }
}
