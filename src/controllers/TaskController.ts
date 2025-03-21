// controllers/TaskController.ts
import { Request, Response, NextFunction } from 'express';
import { TaskService, TaskCreateDto, TaskUpdateDto } from '../services/TaskService';
import { HttpStatusCode } from '../utils/types/HttpStatusCode';
import { SuccessResponse } from '../utils/ResponseFormat/SuccessResponse';

export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto: TaskCreateDto = req.body;
      const task = await this.taskService.createTask(dto);
      res.status(HttpStatusCode.CREATED)
        .json(new SuccessResponse({ data: task, message: 'Task created successfully' }));
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const task = await this.taskService.getTaskById(req.params.id);
      if (!task) {
        res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Task not found' });
        return;
      }
      res.status(HttpStatusCode.OK)
        .json(new SuccessResponse({ data: task }));
    } catch (error) {
      next(error);
    }
  }

  async getUserTasks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      const { status, priority, search } = req.query;
      const tasks = await this.taskService.getUserTasks(
        userId,
        status as string,
        priority as string,
        search as string
      );
      res.status(HttpStatusCode.OK).json(new SuccessResponse({ data: tasks }));
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto: TaskUpdateDto = req.body;
      const task = await this.taskService.updateTask(req.params.id, dto);
      if (!task) {
        res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Task not found' });
        return;
      }
      res.status(HttpStatusCode.OK)
        .json(new SuccessResponse({ data: task, message: 'Task updated successfully' }));
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const success = await this.taskService.deleteTask(req.params.id);
      if (!success) {
        res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Task not found' });
        return;
      }
      res.status(HttpStatusCode.OK)
        .json(new SuccessResponse({ message: 'Task soft deleted successfully' }));
    } catch (error) {
      next(error);
    }
  }

  async updateSubtaskStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { taskId, subtaskIndex } = req.params;
      const { completed } = req.body;
      const task = await this.taskService.updateSubtaskStatus(taskId, parseInt(subtaskIndex), completed);
      res.status(HttpStatusCode.OK)
        .json(new SuccessResponse({ data: task, message: 'Subtask status updated successfully' }));
    } catch (error) {
      next(error);
    }
  }
}