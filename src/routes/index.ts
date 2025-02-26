import express from 'express';
import { AuthController } from '../controllers/AuthController';
import { DIContainer } from '../di/container';
import { validateRequest } from '../middleware/requestValidation';
import { loginSchema } from '../utils/validationSchema/Auth.schema';
import authRoutes from './authRoutes';
import { AuthUrl } from '../utils/types/Urls';
const router = express.Router();

router.use(AuthUrl.Auth, authRoutes)

export default router;