// src/services/TaskService.ts
import { TaskRepository } from '../domain/repositories/TaskRepository';
import { Task } from '../domain/entities/Task';

export interface TaskCreateDto {
    title: string;
    description: string;
    userId: string;
}

export interface TaskUpdateDto {
    title?: string;
    description?: string;
    status?: 'pending' | 'in_progress' | 'completed';
}

export interface TaskService {
    createTask(dto: TaskCreateDto): Promise<Task>;
    getTaskById(id: string): Promise<Task | null>;
    getUserTasks(userId: string): Promise<Task[]>;
    updateTask(id: string, dto: TaskUpdateDto): Promise<Task | null>;
    deleteTask(id: string): Promise<boolean>;
}

export class DefaultTaskService implements TaskService {
    constructor(private readonly taskRepository: TaskRepository) {}

    async createTask(dto: TaskCreateDto): Promise<Task> {
        const task: Task = {
            ...dto,
            status: 'pending',
            createdAt: new Date(),
        };
        return await this.taskRepository.create(task);
    }

    async getTaskById(id: string): Promise<Task | null> {
        return await this.taskRepository.findById(id);
    }

    async getUserTasks(userId: string): Promise<Task[]> {
        return await this.taskRepository.findByUserId(userId);
    }

    async updateTask(id: string, dto: TaskUpdateDto): Promise<Task | null> {
        return await this.taskRepository.update(id, {
            ...dto,
            updatedAt: new Date(),
        });
    }

    async deleteTask(id: string): Promise<boolean> {
        return await this.taskRepository.delete(id);
    }
}