import { TaskRepository } from '../domain/repositories/TaskRepository';
import { Task } from '../domain/entities/Task';
import SocketService from './SocketService';

export interface TaskCreateDto {
  title: string;
  description: string;
  userId: string;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  dueDate?: Date;
  subtasks?: { title: string; completed: boolean }[]; 
}

export interface TaskUpdateDto {
  title?: string;
  description?: string;
  status?: 'pending' | 'in_progress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  dueDate?: Date;
  subtasks?: { title: string; completed: boolean }[];
}

export interface TaskService {
  createTask(dto: TaskCreateDto): Promise<Task>;
  getTaskById(id: string): Promise<Task | null>;
  getUserTasks(userId: string, status?: string, priority?: string, search?: string): Promise<Task[]>;
  updateTask(id: string, dto: TaskUpdateDto): Promise<Task | null>;
  deleteTask(id: string): Promise<boolean>;
  updateSubtaskStatus(taskId: string, subtaskIndex: number, completed: boolean): Promise<Task | null>;
}

export class DefaultTaskService implements TaskService {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly socketService?: SocketService
  ) {}

  async createTask(dto: TaskCreateDto): Promise<Task> {
    const task: Task = {
      ...dto,
      title: dto.title.toLowerCase(),
      status: 'pending',
      priority: dto.priority || 'medium',
      createdAt: new Date(),
      subtasks: dto.subtasks?.map(sub => ({ title: sub.title, completed: sub.completed })),
    };
    const createdTask = await this.taskRepository.create(task);
    if (this.socketService) {
      this.socketService.emitTaskCreated(createdTask);
    }
    return createdTask;
  }

  async getTaskById(id: string): Promise<Task | null> {
    return await this.taskRepository.findById(id);
  }

  async getUserTasks(
    userId: string,
    status?: string,
    priority?: string,
    search?: string
  ): Promise<Task[]> {
    return await this.taskRepository.findByUserId(userId, status, priority, search);
  }

  async updateTask(id: string, dto: TaskUpdateDto): Promise<Task | null> {
    const updatedTask = await this.taskRepository.update(id, {
      ...dto,
      updatedAt: new Date(),
    });
    if (updatedTask && this.socketService) {
      this.socketService.emitTaskUpdated(updatedTask);
    }
    return updatedTask;
  }

  async deleteTask(id: string): Promise<boolean> {
    const result = await this.taskRepository.delete(id);
    if (result && this.socketService) {
      this.socketService.emitTaskDeleted(id);
    }
    return result;
  }

  async updateSubtaskStatus(taskId: string, subtaskIndex: number, completed: boolean): Promise<Task | null> {
    const updatedTask = await this.taskRepository.updateSubtaskStatus(taskId, subtaskIndex, completed);
    if (updatedTask && this.socketService) {
      this.socketService.emitTaskUpdated(updatedTask);
    }
    return updatedTask;
  }
}