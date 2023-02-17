const User = require("../../models/user");
const Verification = require("../../models/verification");
const bcrypt = require("../../config/encryption");
const { uuidv4 } = require("uuid");
const mongoose = require("mongoose");
//const transporter = require("../../config/nodemailer");

exports.postSignup = (req, res) => {
    // TODO: implement signup endpoint
    const { email, password, confirmPassword } = req.body;

    let session;
    let user;

    mongoose
        .startSession()
        .then((sess) => {
            sess.startTransaction();
            session = sess;
            return;
        })
        .then(() => {
            return User.findOne({ email: email });
        })
        .then((existedUser) => {
            if (existedUser) {
                if (existedUser.verficationState)
                    throw new Error("this email already in use!!!");
                
                //return existedUser;
            }
            return bcrypt.useBcryptjsHash(password);
        })
        .then((hashedPassword) => {
            const newUser = new User({
                email: email,
                password: hashedPassword,
            });

            return newUser.save({ session });
        })
        .then((newUser) => {
            console.log("user: " + newUser);
            user = newUser;

            const newVerification = new Verification({ user: newUser._id });

            return newVerification.save({ session });
        })
        .then((newVerification) => {
            console.log("newVerification: " + newVerification);

            return session.commitTransaction();
        })
        .then(() => {
            console.log("commitTransaction");
            return session.endSession();
        })
        .then(() => {
            console.log("endSession");
            res.status(201).json({ message: "user created" });
            /* var mailOptions = {
                from: '"uptime monitoring Website" <${process.env.OWNER_MAIL}',
                to: user.email,
                subject: "Signup succeeded test",
                text:
                    `Hey there, you successfully signed up!
                    go to http://localhost:3000/Verfy/${uniqueString}`,
            };*/

            // transporter.sendMail(mailOptions);
        })
        .catch((err) => {
            console.log("error from starting transaction: " + err);
            session
                .abortTransaction()
                .then(() => session.endSession())
                .then(() => {
                    console.log("aborted");
                    res.status(400).json({ message: "failed to sign up" });
                });
        });

    // TODO: verify email and password

    // Create a new user

    // TODO: send email verification

    //res.json({ id });
};
