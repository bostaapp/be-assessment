import { Router } from "express";
import ChecksController from "../controllers/checks";
import { validate } from "../middlewares/validate";
import ChecksValidation from "../validation/checks";

const router = new Router();

router.get("/", ChecksController.getAllChecks);

router.post("/", validate(ChecksValidation.createCheck), ChecksController.createCheck);

router.get("/:id", validate(ChecksValidation.getCheckById), ChecksController.getCheckById);

router.put("/:id", validate(ChecksValidation.updateCheck), ChecksController.updateCheck);

router.delete("/:id", validate(ChecksValidation.deleteCheck), ChecksController.deleteCheck);

export default router;