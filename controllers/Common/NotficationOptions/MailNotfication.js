const transporter = require("../../../config/nodemailer");

function NotfyByMail(user, check) {
  const mailOptions = {
    from: process.env.MAIL_FROM,
    to: user.email,
    subject: "Check failed",
    text: `Check ${check.name} failed`,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

module.exports = {
  NotfyByMail,
};
