const express = require("express");
const { body, param, query } = require("express-validator");
const router = express.Router();

const controller = require("../Controllers/reportController");

router.get("/:check", controller.getReport);
router.get("/tag/:tag", controller.getReportByTag);

module.exports = router;
