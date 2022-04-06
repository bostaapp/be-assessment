const nodemailer = require("nodemailer");

async function sendMail(user) {
  const transporter = nodemailer.createTransport({
    name: process.env.EMAIL_HOST,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_SENDER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  let mailOptions = {
    from: process.env.EMAIL_SENDER,
    to: user.email,
    subject: "Verification code for Monitoring system",
    text: `your verification code is ${user.verificationCode}, please head to ${process.env.BASE_URL}/users/verify and post body with your email and verificationCode to verify your account`,
  };
  await transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log("error", err);
    } else {
      console.log("sent", info);
    }
  });
}

module.exports = sendMail;
