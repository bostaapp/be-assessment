import nodemailer from 'nodemailer';

export const sendVerificationEmail = async (
  email: string,
  subject: string,
  text: string
) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      html: text,
    });
    console.log("Verification email sent successfully");
  } catch (err) {
    console.error("Error sending verification email:", err);
  }
};
