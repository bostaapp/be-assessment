const express = require("express");
const { body, param, query } = require("express-validator");
const router = express.Router();

const controller = require("../Controllers/authController");

router.post(
  "/login",
  [body("email").isEmail().withMessage("enter valid user email")],
  controller.login
);

module.exports = router;
