import { Task } from "../entities/Task";
import { Repository } from "./Repository";

export interface TaskRepository extends Repository<Task> {
  findByUserId(
    userId: string,
    status?: string,
    priority?: string,
    search?: string
  ): Promise<Task[]>;
  findByStatus(status: string): Promise<Task[]>;
  updateSubtaskStatus(taskId: string, subtaskIndex: number, completed: boolean): Promise<Task | null>;
}