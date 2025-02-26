
import { Task } from '../entities/Task';
import { Repository } from './Repository';

export interface TaskRepository extends Repository<Task> {
    findByUserId(userId: string): Promise<Task[]>;
    findByStatus(status: string): Promise<Task[]>;
}