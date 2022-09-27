import { User } from "../model/usersModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "please signup first" });
    }

    const isMatchedPassword = await bcrypt.compare(password, user.password);
    if (!isMatchedPassword) {
      return res.status(400).json({ message: "wrong password" });
    }

    if (isMatchedPassword) {
      console.log(process.env.TOKEN_EXPIRY);
      const token = jwt.sign({ _id: user._id }, process.env.TOKEN_KEY, {
        expiresIn: process.env.TOKEN_EXPIRY,
      });
      res.status(202).json({
        message: "success",
        token,
        data: { _id: user._id, email: user.email },
      });
    }
  } catch (error) {
    return res.status(400).json({ error });
  }
};

export { signIn };
