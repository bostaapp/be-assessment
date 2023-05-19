import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { validate } from "../middlewares/validate";
import ReportsController from "../controllers/reports";
import ReportsValidation from "../validation/reports";

const router = new Router();

router.get('/checks/:checkId',authenticate, validate(ReportsValidation.getReportByCheckId), ReportsController.getReportByCheckId);

router.get('/checks', authenticate, validate(ReportsValidation.getReportsByTags), ReportsController.getReportsByTags);

export default router;