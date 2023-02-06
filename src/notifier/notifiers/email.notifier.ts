import {
  createTestAccount,
  createTransport,
  getTestMessageUrl,
} from "nodemailer";
import { MailOptions } from "nodemailer/lib/sendmail-transport";
import { INotifier } from "./notifier.interface";

export class EmailNotifier implements INotifier {
  async notify(target: string, opts: MailOptions) {
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
