const express = require("express");

const router = express.Router();

const controller = require("../controllers/Report");


router.get("/", controller.getReports);

module.exports = router;
