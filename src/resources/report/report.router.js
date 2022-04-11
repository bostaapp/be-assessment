import { Router } from "express";
import controllers from "./report.controllers";

const router = Router();
router.post("/", controllers.createOne);
export default router;
