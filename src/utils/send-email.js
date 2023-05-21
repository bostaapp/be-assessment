import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  //let testAccount = await nodemailer.createTestAccount();
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  

  // send mail with defined transport object
  const message = {
    from: '"Bosta" <noreply@bosta.com>', // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    // text: options.text, // plain text body
    html: options.html
  };

  await transporter.sendMail(message);

  console.log("Email sent ... ")
};

export default sendEmail;