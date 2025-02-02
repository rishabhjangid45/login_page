import express from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/AuthController.js';
import { userAuth } from '../middleware/userauth.js';
import { sendVerifyOtp, verifyEmail } from '../controllers/AuthController.js';
import { isauthenticated } from '../controllers/AuthController.js';
import { sendResetPasswordOtp, resetPassword , isOtpValid } from '../controllers/AuthController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/send-verify-otp', userAuth, sendVerifyOtp);
router.post('/verify-account', userAuth, verifyEmail);
router.get('/is-auth', userAuth, isauthenticated);
router.post('/send-reset-otp', sendResetPasswordOtp);
router.post('/reset-password', resetPassword);
router.post('/is-otp-valid', isOtpValid);


export default router;