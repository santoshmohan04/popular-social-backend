import express from 'express';
import { login, getMe, refreshToken, logout } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { loginSchema, refreshTokenSchema } from '../schemas/authSchema.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = express.Router();

router.post('/login', validateBody(loginSchema), asyncHandler(login));
router.get('/me', protect, asyncHandler(getMe));
router.post('/refresh', validateBody(refreshTokenSchema), asyncHandler(refreshToken));
router.post('/logout', protect, asyncHandler(logout));

export default router;
