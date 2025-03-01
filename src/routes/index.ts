import express from 'express';
import authRoutes from './authRoutes';
import taskRoutes from './taskRoutes';
import { AuthUrl } from '../utils/types/Urls';
import { authMiddleware } from '../middleware/authorization';
const router = express.Router();

router.use(AuthUrl.Auth, authRoutes)
router.use(authMiddleware, taskRoutes);

export default router;