import { TaskRepository } from '../domain/repositories/TaskRepository';

export interface TaskAnalyticsService {
    getUserTaskAnalytics(userId: string): Promise<TaskAnalytics>;
}

export interface TaskAnalytics {
    totalTasks: number;
    statusBreakdown: {
        pending: number;
        inProgress: number;
        completed: number;
    };
    priorityBreakdown: {
        low: number;
        medium: number;
        high: number;
    };
    overdueTasks: number;
    completionRate: number;
}

export class DefaultTaskAnalyticsService implements TaskAnalyticsService {
    constructor(private readonly taskRepository: TaskRepository) {}

    async getUserTaskAnalytics(userId: string): Promise<TaskAnalytics> {
        const tasks = await this.taskRepository.findByUserId(userId);
        const now = new Date();

        const analytics: TaskAnalytics = {
            totalTasks: tasks.length,
            statusBreakdown: {
                pending: tasks.filter(t => t.status === 'pending').length,
                inProgress: tasks.filter(t => t.status === 'in_progress').length,
                completed: tasks.filter(t => t.status === 'completed').length
            },
            priorityBreakdown: {
                low: tasks.filter(t => t.priority === 'low').length,
                medium: tasks.filter(t => t.priority === 'medium').length,
                high: tasks.filter(t => t.priority === 'high').length
            },
            overdueTasks: tasks.filter(t => 
                t.dueDate && t.dueDate < now && t.status !== 'completed'
            ).length,
            completionRate: tasks.length > 0 
                ? (tasks.filter(t => t.status === 'completed').length / tasks.length) * 100 
                : 0
        };

        return analytics;
    }
}