import { Router } from "express";
import { Auth } from "../middlewares/auth";
import { getReport, getReportsByTag } from "../controllers/report.controller";
import { validationMiddleware } from "../middlewares/validate";
import { getReportsBytagsValidator } from "../validation/reports.valdation";

const router = Router({ mergeParams: true });

router.get("/", getReport);
router.get(
  "/all",
  Auth,
  validationMiddleware(undefined, undefined, getReportsBytagsValidator),
  getReportsByTag
);

export { router as ReportRouter };
