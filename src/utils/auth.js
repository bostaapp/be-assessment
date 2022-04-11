import config from "../config";
import { User } from "../resources/user/user.model";
import { Token } from "../resources/token/token.schema";
import { sendEmail } from "../utils/email";
const crypto = require("crypto");
import jwt from "jsonwebtoken";

export const newToken = (user) => {
  return jwt.sign({ id: user._id }, config.secrets.jwt, {
    expiresIn: config.secrets.jwtExp,
  });
};

export const verifyToken = (token) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, config.secrets.jwt, (err, payload) => {
      if (err) return reject(err);
      resolve(payload);
    });
  });

export const signup = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ message: "need email and password" });
  }
  try {
    const user = await User.create(req.body);
    let verificationToken = await new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();

    const message = `${config.baseurl}/user/verify/${user._id}/${verificationToken.token}`;
    await sendEmail(user.email, "Verify Email", message);

    const token = newToken(user);
    return res
      .status(201)
      .send({ token, message: "An Email sent to your account please verify" });
  } catch (error) {
    console.log(error);
    return res.status(500).end();
  }
};

export const signin = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ message: "need email and password" });
  }

  const invalid = { message: "Invalid email and password combination" };

  try {
    const user = await User.findOne({ email: req.body.email })
      .select("email password")
      .exec();
    if (!user) {
      return res.status(401).send(invalid);
    }
    const token = newToken(user);
    return res.status(201).send({ token });
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
};

export const protect = async (req, res, next) => {
  const bearer = req.headers.authorization;

  if (!bearer || !bearer.startsWith("Bearer ")) {
    return res.status(401).end();
  }
  const token = bearer.split("Bearer ")[1].trim();

  let payload;
  try {
    payload = await verifyToken(token);
  } catch (error) {
    return res.status(401).end();
  }
  const user = await User.findById(payload.id)
    .select("-password")
    .lean()
    .exec();

  if (!user) {
    return res.status(401).end();
  }

  req.user = user;
  next();
};
