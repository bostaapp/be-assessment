import express from "express";
import { authentication } from "../middleware/authMiddleware.js";
import { addUrlCheck, getAllUrlChecks, getUrlCheckById, updateUrlCheck, deleteUrlCheck } from "../controllers/urlCheckController.js"
const router = express.Router();

router.post("/urlCheck", authentication, addUrlCheck);
router.get("/urlCheck", authentication, getAllUrlChecks);
router.get("/urlCheck/:id", authentication, getUrlCheckById);
router.put("/urlCheck/:id", authentication, updateUrlCheck);
router.delete("/urlCheck/:id", authentication, deleteUrlCheck);
export default router;