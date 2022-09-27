import express from "express";
import { signIn } from "../controller/signIn.js";
import { signUp } from "../controller/signUp.js";
const userRouter = express();

userRouter.post("/signup", signUp);
userRouter.post("/signin", signIn);

export { userRouter };
