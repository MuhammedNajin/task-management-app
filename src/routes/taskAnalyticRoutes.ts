import express from 'express';
import { TaskAnalyticsController } from '../controllers/TaskAnalyticController';
import { DIContainer } from '../di/container';
import { validateRequest } from '../middleware/requestValidation';
import { userIdSchema } from '../utils/validationSchema/Task.schema';
import { Server } from 'node:http';

const initializeAnalyticsRouter = (httpServer: Server) => {
    const router = express.Router();
    const analyticsController = new TaskAnalyticsController(
        DIContainer.getInstance(httpServer).get('TaskAnalyticsService')
    );

    const validateUserId = validateRequest(userIdSchema, 'params');

    router.get(
        '/users/:userId/analytics',
        validateUserId,
        analyticsController.getUserAnalytics.bind(analyticsController)
    );

    return router;
}

export { initializeAnalyticsRouter }