import express from 'express';
const router = express.Router();

import * as authController from '../controllers/auth.controller.js';

router.post('/signup', authController.signup);                       // POST /api/auth/signup
router.post('/login', authController.login);                         // POST /api/auth/login
router.post('/resend-confirmation', authController.resendConfirmation); // POST /api/auth/resend-confirmation

export default router;