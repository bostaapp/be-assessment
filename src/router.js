import { Router } from "express";
import ChecksRouter from './routers/checks'
import AuthRouter from './routers/auth'
import ReportsRouter from './routers/reports'

const router = new Router();

router.use("/checks", ChecksRouter);
router.use("/auth", AuthRouter);
router.use("/reports", ReportsRouter);

export default router;