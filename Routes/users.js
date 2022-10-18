const express = require("express");
const { createUser, authenticateUser } = require("../Controllers/users");
const tokenController = require("../Controllers/tokens");
const { tryCatchWrapExpress } = require("../Utils/wrappers");
const { jwt_password } = require("../Config/config.secrets");
const usersRouter = express.Router();
const sendEmail = require("../Utils/mail");
const jwt = require("jsonwebtoken");

const routerCreateUser = tryCatchWrapExpress(async (req, res) => {
    const newUser = await createUser(req.body);
    const createdToken = await tokenController.createToken(newUser._id);

    const verificationURL = `${process.env.base_url}/users/verify/${newUser._id}/${createdToken.token}`;
    await sendEmail(newUser.email, "Verify Email", verificationURL);
    res.status(200).json({
        message: "Verification Sent",
        newUser,
        url: verificationURL
    });
});

const routerAuthenticateUser = tryCatchWrapExpress(async (req, res) => {
    const authenticatedUser = await authenticateUser(req.body);

    const generatedToken = jwt.sign({ authenticatedUser }, jwt_password);
    console.log(generatedToken);
    res.status(200).json({
        message: "User Authentication Successful",
        token: generatedToken
    });
});

const routerVerifyUser = tryCatchWrapExpress(async (req, res) => {
    await tokenController.verifyUser(req.params.id, req.params.token);
    res.status(200).json({ message: "Verified Successfully " });
});

usersRouter.route("/signup").post(routerCreateUser);
usersRouter.route("/login").get(routerAuthenticateUser);
usersRouter.route("/verify/:id/:token").get(routerVerifyUser);

module.exports = usersRouter;