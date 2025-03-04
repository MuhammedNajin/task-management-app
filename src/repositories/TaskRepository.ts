import { Task } from '../domain/entities/Task';
import { TaskModel } from '../models/task_model';
import { TaskRepository } from '../domain/repositories/TaskRepository';

export class MongoTaskRepository implements TaskRepository {
    private readonly model = TaskModel;

    async findById(id: string): Promise<Task | null> {
        return this.model.findOne({ _id: id, isDeleted: false })
            .lean()
            .populate('subtasks');
    }

    async findAll(): Promise<Task[]> {
        return this.model.find({ isDeleted: false })
    }

    async create(task: Task): Promise<Task> {
        const createdTask = await this.model.create(task);
        return createdTask.toObject();
    }

    async update(id: string, task: Partial<Task>): Promise<Task | null> {
        return this.model.findOneAndUpdate(
            { _id: id, isDeleted: false },
            task,
            { new: true }
        )
        
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.update(id, { isDeleted: true });
        return !!result;
    }

    async findByUserId(userId: string): Promise<Task[]> {
        return this.model.find({ 
            userId, 
            isDeleted: false 
        })
        
    }

    async findByStatus(status: string): Promise<Task[]> {
        return this.model.find({ 
            status, 
            isDeleted: false 
        })
        .lean()
        .populate('subtasks');
    }
}