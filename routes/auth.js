const express = require("express");
const authController = require("../controllers/auth");
//routers are used like we create mini express apps and then combine them to make a full express app
const router = express.Router();

router.post("/signup", authController.postSignup);