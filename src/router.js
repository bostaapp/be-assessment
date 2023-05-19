import { Router } from "express";
import ChecksRouter from './routers/checks'
import AuthRouter from './routers/auth'

const router = new Router();

router.use("/checks", ChecksRouter)
router.use("/auth", AuthRouter)

export default router;