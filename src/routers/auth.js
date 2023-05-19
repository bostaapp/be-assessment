import { Router } from "express";
import AuthController from "../controllers/auth";
import AuthValidation from "../validation/auth";
import { validate } from '../middlewares/validate'

const router = new Router();

router.post('/signup', validate(AuthValidation.signupUser), AuthController.signupUser);

router.post('/signin', validate(AuthValidation.signinUser), AuthController.signinUser);

router.get('/verify', AuthController.verifyUserEmail);


export default router;