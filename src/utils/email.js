const nodemailer = require("nodemailer");
import config from "../config";

export const sendEmail = async (email, subject, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host: config.host,
      service: config.service,
      port: 587,
      secure: false,
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });

    await transporter.sendMail({
      from: config.user,
      to: email,
      subject: subject,
      text: body,
    });

    console.log("email sent successfully");
  } catch (error) {
    console.log("email not sent");
    console.log(error);
  }
};
