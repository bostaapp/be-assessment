const express = require("express");
const checkController = require("../controllers/check/check");
const isAuthenticated = require('../middleware/auth');
const router = express.Router();

router.get("/checks", isAuthenticated.verifyToken, checkController.getAllChecks);

router.get("/checks/:id", isAuthenticated.verifyToken, checkController.getCheckById);

router.post("/checks", isAuthenticated.verifyToken, checkController.postAddCheck);

router.put("/checks/:id", isAuthenticated.verifyToken, checkController.updateCheck);

router.delete("/checks/:id", isAuthenticated.verifyToken, checkController.deleteCheckById);

module.exports = router;