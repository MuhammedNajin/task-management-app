import { Request, Response, NextFunction } from 'express';
import { TaskAnalyticsService } from '../services/TaskAnalyticsService';
import { HttpStatusCode } from '../utils/types/HttpStatusCode';
import { SuccessResponse } from '../utils/ResponseFormat/SuccessResponse';

export class TaskAnalyticsController {
    constructor(private readonly analyticsService: TaskAnalyticsService) {}

    async getUserAnalytics(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.params.userId;
            const analytics = await this.analyticsService.getUserTaskAnalytics(userId);
            res.status(HttpStatusCode.OK)
                .json(new SuccessResponse({
                    data: analytics,
                    message: 'Task analytics retrieved successfully'
                }));
        } catch (error) {
            next(error);
        }
    }
}