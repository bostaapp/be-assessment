import { Router } from "express";
import { login, signup, verify } from "../controllers/user.controller";
import {
  signupValidator,
  verifyValidator,
} from "../validation/user.validation";
import { validationMiddleware } from "../middlewares/validate";

const router = Router();

router.post("/signup", validationMiddleware(signupValidator), signup);

router.post("/login", validationMiddleware(signupValidator), login);

router.patch("/verify", validationMiddleware(verifyValidator), verify);

export { router as userRouter };
