import express from 'express';
import { register, login, getMe, logout, changePassword, acceptTerms, registerSecret } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
// router.post('/register', register); // Disabled: Use secret registration only
router.post('/register-secret', registerSecret);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.put('/change-password', protect, changePassword);
router.put('/accept-terms', protect, acceptTerms);

export default router;
