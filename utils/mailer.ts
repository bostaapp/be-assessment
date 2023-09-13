import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

interface EmailOptions {
  recipient: string;
}

const sendEmail = async (options: EmailOptions) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT!),
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions: Mail.Options = {
    sender: "za3bola@gmail.com",
    subject: "Good subject",
    to: options.recipient,
    text: "Some text",
  };

  const { accepted, response } = await transporter.sendMail(mailOptions);
  console.log(accepted, response);
};

export default sendEmail;
