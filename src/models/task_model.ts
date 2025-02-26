// src/models/task_model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface Task {
    _id?: string;
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'completed';
    userId: string;
    createdAt: Date;
    updatedAt?: Date;
}

export interface TaskDocument extends Document, Omit<Task, '_id'> {
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'completed';
    userId: string;
    createdAt: Date;
    updatedAt?: Date;
}

const TaskSchema: Schema<TaskDocument> = new Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            minlength: [3, 'Title must be at least 3 characters'],
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            trim: true,
        },
        status: {
            type: String,
            enum: ['pending', 'in_progress', 'completed'],
            default: 'pending',
        },
        userId: {
            type: String,
            required: [true, 'User ID is required'],
            ref: 'User',
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: (_doc, ret) => {
                ret.id = ret._id.toString();
                delete ret._id;
                delete ret.__v;
                return ret;
            },
        },
    }
);

export const TaskModel = mongoose.model<TaskDocument>('Task', TaskSchema);