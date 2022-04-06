const express = require("express");
const { body, param, query } = require("express-validator");
const router = express.Router();

const controller = require("../Controllers/checkController");

router.post("", controller.createCheck);
router.put("", controller.updateCheck);
router.delete("/:id", controller.deleteCheck);
router.get("/:id", controller.getCheck);

module.exports = router;
