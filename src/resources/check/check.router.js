import { Router } from "express";
import controllers from "./check.controllers";

const router = Router();

// /api/check
router.route("/").get(controllers.getMany).post(controllers.createOne);

// /api/item
router
  .route("/:id")
  .get(controllers.getOne)
  .put(controllers.updateOne)
  .delete(controllers.removeOne);

export default router;
