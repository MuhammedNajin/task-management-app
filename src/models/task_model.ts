// src/models/task_model.ts
import mongoose, { Schema, Document } from 'mongoose';

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

export interface TaskDocument extends Document, Omit<Task, 'id'> {}

const TaskSchema: Schema<TaskDocument> = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'in_progress', 'completed'],
        message: '{VALUE} is not a valid status',
      },
      default: 'pending',
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high'],
        message: '{VALUE} is not a valid priority',
      },
      default: 'medium',
    },
    category: {
      type: String,
      trim: true,
    },
    dueDate: {
      type: Date,
    },
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      ref: 'User',
    },
    subtasks: [{
      title: {
        type: String,
        required: [true, 'Subtask title is required'],
        trim: true,
      },
      completed: {
        type: Boolean,
        default: false,
      },
    }],
    isDeleted: {
      type: Boolean,
      default: false,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.isDeleted;
        return ret;
      },
    },
    toObject: {
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.isDeleted;
        return ret;
      },
    },
  }
);

export const TaskModel = mongoose.model<TaskDocument>('Task', TaskSchema);