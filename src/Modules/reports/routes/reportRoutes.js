const express = require("express");
const isAuthenticated = require("../../../../common/middleware/isAuthenticated");
const { getReports, getreportById } = require("../controllers/reportController");

const route = express.Router();

//can get reports by tag by send tags in req.query
route.get("/reports", isAuthenticated(), getReports);

route.get("/reports/:reportId", isAuthenticated(), getreportById);

module.exports = route;