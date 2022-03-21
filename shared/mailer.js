import { createTransport } from "nodemailer";
//for some reason google blocked this gmail
//but you can change authentication and will work fine
const mailer = async (to, userName, url) => {
  let transporter = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      //   user: "xxx@gmail.com",
      //   pass: "xxxx",
    },
  });
  //check if server is authunicated and ready to send verfiction message
  transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });

  let info = await transporter.sendMail({
    from: "islamoashraf@gmail.com",
    to,
    subject: `Hello ${userName}`,
    text: `Hello ${to}`,
    html: `
    <p >Hello ${userName} your site ${url} is down</p>
    <a href="${url}"></a>
    
    `,
  });
};
export { mailer };
