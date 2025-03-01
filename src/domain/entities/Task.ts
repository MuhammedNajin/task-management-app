// src/domain/entities/Task.ts
export interface Task {
    id?: string;
    title: string;
    slug?: string;
    description: string;
    status: 'pending' | 'in_progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    category?: string;
    dueDate?: Date;
    userId: string;
    subtasks?: string[];
    createdAt: Date;
    updatedAt?: Date;
    isDeleted?: boolean;
}