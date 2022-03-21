import { User } from "../model/usersModel.js";
import bcrypt from "bcrypt";
const signUp = async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;
    //check existing user
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      return res.status(400).json({ error: "user is exist" });
    }
    //hash passowrd
    bcrypt.hash(password, 8, async (err, hash) => {
      if (err) {
        return res.status(400).json({ err });
      }
      const user = await User.insertMany({
        username,
        email,
        password: hash,
        phone,
      });
      return res.status(200).json({ message: "signup successfully", user });
    });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

export { signUp };
