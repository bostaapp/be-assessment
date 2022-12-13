const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User.js");

const handleSignIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.sendStatus(400);

    const user = await User.findOne({
      email: email.toLowerCase(),
    });
    if (!user) return res.status(400).send("User not found");
    if (user.verficationState === false)
      return res.status(400).send("User not verified");

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      user.token = token;

      return res.status(200).json({ token: user.token });
    }
    return res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
};
module.exports = { handleSignIn };
