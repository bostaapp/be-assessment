import express from "express";
import { isAuthorized } from "../../../shared/isAuthorized.js";
import { addUrl } from "../contoller/addUrl.js";
import { destroyUrl } from "../contoller/destroyUrl.js";
import { getUrls } from "../contoller/getUrls.js";
import { updateUrl } from "../contoller/updateUrls.js";
const urlRouter = express();

urlRouter.post("/addurl", isAuthorized(), addUrl);
urlRouter.get("/urls", isAuthorized(), getUrls);
urlRouter.patch("/urls", isAuthorized(), updateUrl);
urlRouter.delete("/urls", isAuthorized(), destroyUrl);

export { urlRouter };
