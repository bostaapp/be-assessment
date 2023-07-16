const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const authMiddleware = require("../utils/authMiddleware");

// Generate a report for a specific URL check
router.post("/", authMiddleware, reportController.createReport);

router.get(
	"/urlcheck/:checkId",
	authMiddleware,
	reportController.getReportsByCheckId
);

router.get("/:id", authMiddleware, reportController.getReportById);

router.delete("/:id", authMiddleware, reportController.deleteReport);

module.exports = router;
