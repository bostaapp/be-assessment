const mongoose = require("mongoose");
const jsonwebtoken = require("jsonwebtoken");

const Encryption = require("../../config/encryption");
const User = require("../../models/user");

exports.postLogin = (req, res, next) => {
    const email = req.body.email.toLowerCase();
    const password = req.body.password;

    if (!email || !password)
        return res.status(400).json({ message: "failed to login" });

    let user;
    User.findOne({ email: email })
        .then((savedUser) => {
            if (!savedUser) throw "the email or password is not valid";
            if (!savedUser.verficationState) throw "user is not verified";
            user = savedUser;
            return Encryption.useBcryptjsCompare(password, user.password);
        })
        .then((isMathing) => {
            if (!isMathing) throw "the email or password is not valid";
            //save here json web token
            const token = jsonwebtoken.sign(
                { user_id: user._id, email },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );

            user.token = token;

            return user.save();
        })
        .then((savedUser) => {
            console.log("login successfuly");
            res.status(200).json({ message: "login successfuly", token: savedUser.token });
        })
        .catch((err) => {
            console.log("failed to login");
            res.status(400).json({ message: "failed to login" });
        });
};
