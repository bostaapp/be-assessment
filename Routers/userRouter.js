const express = require("express");
const { body, param, query } = require("express-validator");
const router = express.Router();

const controller = require("../Controllers/userController");

router.post(
  "",
  [body("email").isEmail().withMessage("enter valid user email")],
  controller.createUser
);

router.post(
  "/verify",
  [[body("email").isEmail().withMessage("enter valid user email")]],
  controller.verifyUser
);

module.exports = router;
