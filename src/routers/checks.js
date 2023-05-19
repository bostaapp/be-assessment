import { Router } from "express";
import ChecksController from "../controllers/checks";
import { validate } from "../middlewares/validate";
import ChecksValidation from "../validation/checks";
import { authenticate } from "../middlewares/authenticate";

const router = new Router();

router.get("/", authenticate, ChecksController.getAllChecks);

router.post("/", authenticate, validate(ChecksValidation.createCheck), ChecksController.createCheck);

router.get("/:id", authenticate, validate(ChecksValidation.getCheckById), ChecksController.getCheckById);

router.put("/:id", authenticate, validate(ChecksValidation.updateCheck), ChecksController.updateCheck);

router.delete("/:id", authenticate, validate(ChecksValidation.deleteCheck), ChecksController.deleteCheck);

export default router;