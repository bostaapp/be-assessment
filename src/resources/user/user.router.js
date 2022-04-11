import { Router } from "express";
import controllers from "./user.controllers";
import { signin } from "../../utils/auth";

const router = Router();

router.post("/", controllers.createOne);
router.post("/sigin", signin);
router.get("/verify/:id/:token", controllers.getOne);

export default router;
