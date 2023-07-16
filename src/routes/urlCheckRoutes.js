const express = require("express");
const urlCheckController = require("../controllers/urlCheckController");
const authMiddleware = require("../utils/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, urlCheckController.createURLCheck);
router.get("/", authMiddleware, urlCheckController.getURLChecks);

router.get("/:id", authMiddleware, urlCheckController.getURLCheck);
router.put("/:id", authMiddleware, urlCheckController.updateURLCheck);
router.delete("/:id", authMiddleware, urlCheckController.deleteURLCheck);

module.exports = router;
