import { Task } from "../domain/entities/Task";
import { TaskModel } from "../models/task_model";
import { TaskRepository } from "../domain/repositories/TaskRepository";
import { BadRequestError } from "../utils/errors/bad_request_error";

export class MongoTaskRepository implements TaskRepository {
  private readonly model = TaskModel;

  async findById(id: string): Promise<Task | null> {
    return this.model.findOne({ _id: id, isDeleted: false })
  }

  async findAll(): Promise<Task[]> {
    return this.model.find({ isDeleted: false })
  }

  async create(task: Task): Promise<Task> {
    const exist = await this.model.findOne({ title: task.title.toLowerCase(), userId: task.userId });

    console.log("exist", exist)
    if (exist) {
      throw new BadRequestError("Task already exists");
    }
    const createdTask = await this.model.create(task);
    return createdTask
  }

  async update(id: string, task: Partial<Task>): Promise<Task | null> {
    const title = task.title?.toLowerCase();
    if (title) {
      const exist = await this.model.findOne({ title, userId: task.userId });

      console.log("id", id, exist?.id)
      if (exist && exist.id.toString() !== id) {
        throw new BadRequestError("Task already exists");
      }
    }
    return this.model
      .findOneAndUpdate({ _id: id, isDeleted: false }, task, { new: true })
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.update(id, { isDeleted: true });
    return !!result;
  }

  async findByUserId(
    userId: string,
    status?: string,
    priority?: string,
    search?: string
  ): Promise<Task[]> {
    const query: any = { userId, isDeleted: false };
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    return this.model.find(query)
  }

  async findByStatus(status: string): Promise<Task[]> {
    return this.model.find({ status, isDeleted: false })
  }

  async updateSubtaskStatus(taskId: string, subtaskIndex: number, completed: boolean): Promise<Task | null> {
    const update = {
      $set: {
        [`subtasks.${subtaskIndex}.completed`]: completed,
        updatedAt: new Date(),
      },
    }; 
    
    return this.model
      .findOneAndUpdate({ _id: taskId, isDeleted: false }, update, { new: true })
  }
}