const User = require("../../models/user");
const Verification = require("../../models/verification");
const bcrypt = require("../../config/encryption");
const { uuidv4 } = require("uuid");
const mongoose = require("mongoose");
const nodemailer = require("../../config/nodemailer");
const user = require("../../models/user");

exports.postSignup = async (req, res) => {
    // TODO: implement signup endpoint
    const { email, password, confirmPassword } = req.body;

    let session;
    try {
        session = await mongoose.startSession();
        session.startTransaction();

        const existedUser = User.findOne({ email: email });

        if (existedUser.verficationState) throw "this email already in use!!!";

        const hashedPassword = await bcrypt.useBcryptjsHash(password);

        const newUser = new User({
            email: email,
            password: hashedPassword,
        });

        const savedUser = await newUser.save({ session });
        console.log("user: " + savedUser);

        const newVerification = new Verification({ user: savedUser._id });

        const savedVerification = await newVerification.save({ session });
        console.log("savedVerification: " + savedVerification);

        await session.commitTransaction();
        console.log("commitTransaction");

        await session.endSession();
        console.log("endSession");

        //send mail
        const subject = "Signup succeeded test";
        const text = `Hey there, you successfully signed up!
        go to http://localhost:3000/verification/${savedVerification._id}`;
        nodemailer.sendMail(savedUser.email, subject, text);

        res.status(201).json({
            message: "user created",
            verificationId: savedVerification._id,
        });
    } catch (err) {
        console.log("error from starting transaction: " + err);

        await session.abortTransaction();
        await session.endSession();
        console.log("aborted");

        res.status(500).json({ message: "failed to sign up" });
    }
};
