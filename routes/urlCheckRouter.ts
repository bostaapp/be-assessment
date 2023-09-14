import { Router } from "express";
import urlCheckController from "../controllers/urlCheckController";

const urlCheckRouter = Router();

urlCheckRouter
	.put("/", urlCheckController.upsertUrlCheck)
	.get("/", urlCheckController.getUrlReport)
	.get("/:tag", urlCheckController.getReportsByTag)
	.delete("/", urlCheckController.removeUrlCheck);

export default urlCheckRouter;
