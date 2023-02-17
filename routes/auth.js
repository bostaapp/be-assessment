const express = require("express");
const signupController = require("../controllers/user/signup");
const verificationController = require("../controllers/user/verification");
const loginController = require("../controllers/user/login");
//routers are used like we create mini express apps and then combine them to make a full express app
const router = express.Router();

router.post("/signup", signupController.postSignup);
router.post("/login", loginController.postLogin);
router.get("/verification/:verificationId", verificationController.getVerfication);

module.exports = router;