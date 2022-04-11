import { crudControllers } from "../../utils/crud";
import { User } from "./user.model";
import { Token } from "../token/token.schema";
import { signup } from "../../utils/auth";
const crypto = require("crypto");

export default {
  ...crudControllers,
  createOne: signup,
  getOne: async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.params.id });
      if (!user) return res.status(400).send("Invalid link");

      const token = await Token.findOne({
        userId: user._id,
        token: req.params.token,
      });
      if (!token) return res.status(400).send("Invalid link");

      await User.updateOne({ _id: user._id, verified: true });
      await Token.findByIdAndRemove(token._id);

      res.send("email verified sucessfully");
    } catch (error) {
      res.status(400).send("An error occured");
    }
  },
};
