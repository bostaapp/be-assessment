const { User, UserValidationSchema } = require("../models/User");
const { generateToken, getUserID } = require("../middlewares/jwt-auth");
const { validationResult, Result } = require("express-validator");
const bcrypt = require("bcrypt");

// generate token to use it in further requests
const login = async (req, res) => {
  res.setHeader("content-type", "application/json");

  //validate request body
  let errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(200).json({ errors: errors });

  let user = await User.findOne({ email: req.body.email });

  if (!user)
    return res.status(400).json({ error: "No User with that specific email" });

  if (!user.verified)
    return res.status(400).json({ error: "Please Verify your account first" });

  let match = await bcrypt.compare(req.body.password, user.password);

  if (!match)
    return res
      .status(400)
      .json({ error: "Password is incorect please type it again" });

  let token = generateToken(user.id);

  return res.status(200).json({ token: token });
};

module.exports = { login };
