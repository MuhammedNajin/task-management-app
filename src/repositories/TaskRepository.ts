// src/repositories/TaskRepository.ts
import { Task } from '../domain/entities/Task';
import { TaskModel } from '../models/task_model';
import { TaskRepository } from '../domain/repositories/TaskRepository';

export class MongoTaskRepository implements TaskRepository {
    private readonly model = TaskModel;

    async findById(id: string): Promise<Task | null> {
        return this.model.findById(id).lean();
    }

    async findAll(): Promise<Task[]> {
        return this.model.find().lean();
    }

    async create(task: Task): Promise<Task> {
        const createdTask = await this.model.create(task);
        return createdTask.toObject();
    }

    async update(id: string, task: Partial<Task>): Promise<Task | null> {
        return this.model.findByIdAndUpdate(id, task, { new: true }).lean();
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.model.findByIdAndDelete(id);
        return !!result;
    }

    async findByUserId(userId: string): Promise<Task[]> {
        return this.model.find({ userId }).lean();
    }

    async findByStatus(status: string): Promise<Task[]> {
        return this.model.find({ status }).lean();
    }
}