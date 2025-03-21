

export interface Subtask {
  title: string;
  completed: boolean;
}

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
  subtasks?: Subtask[];
  createdAt: Date;
  updatedAt?: Date;
  isDeleted?: boolean;
}