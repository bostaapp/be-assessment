const mongoose = require("mongoose");
const jsonwebtoken = require("jsonwebtoken");

const Encryption = require("../../config/encryption");
const User = require("../../models/user");

exports.postLogin = async (req, res, next) => {
    const email = req.body.email.toLowerCase();
    const password = req.body.password;

    if (!email || !password)
        return res.status(400).json({ message: "failed to login" });

    try {
        const user = await User.findOne({ email: email });

        if (!user) throw "the email or password is not valid";
        if (!user.verficationState) throw "user is not verified";

        const isMathing = await Encryption.useBcryptjsCompare(
            password,
            user.password
        );
        if (!isMathing) throw "the email or password is not valid";

        //save here json web token
        const token = jsonwebtoken.sign(
            { _id: user._id },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );

        user.token = token;

        const savedUser = await user.save();

        console.log("login successfuly");
        res.status(200).json({
            message: "login successfuly",
            token: savedUser.token,
        });
    } catch (err) {
        console.log("failed to login");
        res.status(500).json({ message: "failed to login" });
    }
};
