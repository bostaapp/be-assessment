const express = require("express");
const reportController = require("../controllers/report/report");
const isAuthenticated = require('../middleware/auth');
const router = express.Router();

router.get("/reports/", isAuthenticated.verifyToken, reportController.getAllReports);

router.get("/reports/:id", isAuthenticated.verifyToken, reportController.getReportById);

module.exports = router;