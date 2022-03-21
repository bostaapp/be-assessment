import express from "express";
import { isAuthorized } from "../../../shared/isAuthorized.js";
import { addUrl } from "../contoller/addUrl.js";
const urlRouter = express();

urlRouter.post("/addurl", isAuthorized(), addUrl);

export { urlRouter };
