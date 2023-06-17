import express from "express";
import {
    signUp,
    signIn,
    emailVerification
} from "../controllers/authController.js"
const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/verification/:verId", emailVerification);

export default router;