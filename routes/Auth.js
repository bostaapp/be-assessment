const express = require("express");

const router = express.Router();

const controller = require("../controllers/Auth");

const { body } = require("express-validator");

router.post(
  "/login",
  body("email").isEmail(),
  body("password").isLength({ min: 3 }),
  controller.login
);

module.exports = router;
