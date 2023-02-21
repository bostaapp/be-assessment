const express = require("express");

const router = express.Router();

const controller = require("../controllers/Check");

const { body } = require("express-validator");

router.get("/", controller.getChecks);
router.post("/", controller.createCheck);
router.put("/", controller.updateCheck);
router.delete("/", controller.deleteCheck);

module.exports = router;
