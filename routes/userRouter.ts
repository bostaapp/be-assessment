import { Router } from "express";
import authController from "../controllers/authController";

const userRouter = Router();

userRouter.post("/signup", authController.signup);
userRouter.post("/signin", authController.signin);

export default userRouter;
