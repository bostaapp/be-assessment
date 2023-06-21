import User from "../models/User.js";
import bcrypt from "../helpers/bcrypt.js";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';
import config from "../config.js";
import nodeMailer from "../helpers/nodeMailer.js"

export const signUp = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        if (!email) return res.status(400).json({ message: "email is required" });
        if (!password) return res.status(400).json({ message: "password is required" });
        const user = await User.findOne({ email: email });

        if (user) return res.status(401).json({ message: "this user already exists" });
        const hashedPassword = bcrypt.encryptPassword(password);
        const verId = uuidv4();
        const newUser = await new User({ email: email, password: hashedPassword, verId: verId }).save();
        const emailBody = `Hey there, you successfully signed up!
        go to ${config.URL}/verification/${verId}`
        // const mailResponse = await nodeMailer(email, emailBody);
        return res.status(201).json({ token: "an email with a verification link have been sent to your email address" });
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }


}

export const signIn = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email) return res.status(400).json({ message: "email is required" });
    if (!password) return res.status(400).json({ message: "password is required" });
    const user = await User.findOne({ email: email });
    const isMatchPassword = bcrypt.comparePasswords(password, user.password);
    if (!isMatchPassword) return res.status(400).json({ message: "password is incorrect" });
    if (!user.verficationState) return res.status(401).json({ message: "please verify your email address to sign in" });
    const token = jwt.sign({ userid: user._id }, config.tokenSecret, { expiresIn: 60 * 60 * 60 * 60 });
    return res.status(200).json({ accessToken: token });
}

export const emailVerification = async (req, res, next) => {
    const verId = req.params.verId;
    const verifiedUser = await User.findOne({ verId: verId }, null);
    if (!verifiedUser) return res.status(404).json({ message: "this user does not exist" });
    const updateVerification = await User.updateOne({ verId: verId }, { $set: { verficationState: true } })
    if (updateVerification.modifiedCount === 0) return res.status(400).json({ message: "user is already verified" })
    if (updateVerification) return res.status(200).json({ message: "email address updated successfully you can now sign in" })
    else res.status(400).json({ message: "error verifying the email address" });
}

