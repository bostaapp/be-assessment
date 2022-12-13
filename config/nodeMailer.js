const nodeMailer = require("nodemailer");
let transporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MyMail,
    pass: process.env.MyPass,
  },
});
transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Mailing service ready.");
  }
});
module.exports = transporter;
