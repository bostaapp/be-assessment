import express from 'express'
import { AuthSignup, AuthverifyEmail, AuthResendCode, AuthSignin } from '../controllers/AuthController.js';

const router = express.Router();

// Route for user sign-up
router.post('/signup', AuthSignup);
// Route for verifying user's email
router.post('/verify', AuthverifyEmail);
// Route for resending verification code
router.post('/resendcode', AuthResendCode);
// Route for user sign-in
router.post('/signin', AuthSignin);


export default router;