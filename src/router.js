import { Router } from "express";
import ChecksRouter from './routers/checks'

const router = new Router();

router.use("/checks", ChecksRouter)

export default router;