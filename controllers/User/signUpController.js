const Verfication = require("../../models/Verfication");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const transporter = require("../../config/nodemailer");

const handleNewUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.sendStatus(400);
  if (await User.findOne({ email: email }).exec()) return res.sendStatus(234);
  encryptedPassword = await bcrypt.hash(password, 10);

  await User.create({
    email: email.toLowerCase(),
    password: encryptedPassword,
  }).then(async (result) => {
    const uniqueString = (await uuidv4()) + 123;
    await Verfication.create({
      uniqueString: uniqueString,
      user: result._id,
    });
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: "Verify Your Email",
      text: `go to http://localhost:3000/Verfy/${uniqueString}`,
    };
    transporter.sendMail(mailOptions);
  });

  return res.sendStatus(200);
};

module.exports = { handleNewUser };
