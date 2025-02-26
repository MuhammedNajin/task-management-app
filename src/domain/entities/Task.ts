// src/domain/entities/Task.ts
export interface Task {
    id?: string;
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'completed';
    userId: string;
    createdAt: Date;
    updatedAt?: Date;
}