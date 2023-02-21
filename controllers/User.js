const { User, UserValidationSchema } = require("../models/User");
const { sendVEmail } = require("../services/mailer");
const { generateToken, getUserID } = require("../middlewares/jwt-auth");
const bcrypt = require("bcrypt");

const getUser = (req, res) => {
  res.end("hello ooooo");
};

// sends email confirmation
const createUser = async (req, res) => {
  res.setHeader("content-type", "application/json");
  const { error, value } = UserValidationSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    let errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).json(errorMessages);
  }

  // check if we can save the user
  try {
    let salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(req.body.password, salt);

    let usr = new User({
      userName: req.body.userName,
      password: hashedPassword,
      email: req.body.email,
    });

    console.log(usr);
    await usr.save();

    token = generateToken(usr.id);

    let vLink =
      process.env.SERVER_PROTOCOL +
      "://" +
      process.env.SERVER_HOST +
      ":" +
      process.env.SERVER_PORT +
      "/api/users/verify?token=" +
      token;

    await sendVEmail(usr, vLink);

    return res.status(200).json(usr);
  } catch (err) {
    return res.status(400).json(err);
  }
};

const verify = async (req, res) => {
  res.setHeader("content-type", "application/json");
  token = req.query.token;
  if (!token)
    return res
      .status(400)
      .json({ error: "token param is missing please add one" });

  try {
    let userId = getUserID(token);
    let user = await User.findById(userId);

    user.verified = true;
    await user.save();

    return res.status(200).json({ message: "User Verified Successfully" });
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = {
  getUser,
  createUser,
  verify,
};
