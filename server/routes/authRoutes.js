import express from 'express';
import { loginUser, registerUser, forgotPassword, changePassword, sendOtp, verifyOtp } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/forgot-password', forgotPassword);
router.post('/change-password', changePassword);

export default router;
