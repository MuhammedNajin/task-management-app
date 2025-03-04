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
    subtasks?: string[];
}

export interface TaskUpdateDto {
    title?: string;
    description?: string;
    status?: 'pending' | 'in_progress' | 'completed';
    priority?: 'low' | 'medium' | 'high';
    category?: string;
    dueDate?: Date;
    subtasks?: string[];
}

export interface TaskService {
    createTask(dto: TaskCreateDto): Promise<Task>;
    getTaskById(id: string): Promise<Task | null>;
    getUserTasks(userId: string): Promise<Task[]>;
    updateTask(id: string, dto: TaskUpdateDto): Promise<Task | null>;
    deleteTask(id: string): Promise<boolean>;
}

export class DefaultTaskService implements TaskService {
    constructor(
        private readonly taskRepository: TaskRepository,
        private readonly socketService?: SocketService
    ) {}

    async createTask(dto: TaskCreateDto): Promise<Task> {
        const task: Task = {
            ...dto,
            status: 'pending',
            priority: dto.priority || 'medium',
            createdAt: new Date(),
        };
        const createdTask = await this.taskRepository.create(task);
        console.log("task created",  this.socketService, createdTask)
        if (this.socketService) {
            this.socketService.emitTaskCreated(createdTask);
        }
        return createdTask;
    }

    async getTaskById(id: string): Promise<Task | null> {
        return await this.taskRepository.findById(id);
    }

    async getUserTasks(userId: string): Promise<Task[]> {
        return await this.taskRepository.findByUserId(userId);
    }

    async updateTask(id: string, dto: TaskUpdateDto): Promise<Task | null> {
        const updatedTask = await this.taskRepository.update(id, {
            ...dto,
            updatedAt: new Date(),
        });
        console.log("update task", updatedTask, this.socketService);
        
        if (updatedTask && this.socketService) {
            this.socketService.emitTaskUpdated(updatedTask);
        }
        return updatedTask;
    }

    async deleteTask(id: string): Promise<boolean> {
        const result = await this.taskRepository.update(id, {
            isDeleted: true,
            updatedAt: new Date()
        });
        if (result && this.socketService) {
            this.socketService.emitTaskDeleted(id);
        }
        return !!result;
    }
}