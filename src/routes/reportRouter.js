import express from "express";
import { authentication } from "../middleware/authMiddleware.js";
import { getAllReports, getReportById } from "../controllers/reportController.js";

const router = express.Router();

router.get("/report/:id", authentication, getReportById);
router.get("/report", authentication, getAllReports);

export default router;