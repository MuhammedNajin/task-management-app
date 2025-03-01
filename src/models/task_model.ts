import mongoose, { Schema, Document } from 'mongoose';

// Define the Task interface
export interface Task {
    _id?: string;
    title: string;
    slug?: string;
    description: string;
    status: 'pending' | 'in_progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    category?: string;
    dueDate?: Date;
    userId: string;
    subtasks?: string[]; // Array of subtask IDs
    createdAt: Date;
    updatedAt?: Date;
    isDeleted?: boolean;
}

// Define the Task Document interface extending Mongoose Document
export interface TaskDocument extends Document, Omit<Task, '_id'> {}

// Create the Task Schema
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
            ref: 'User', // Assuming you have a User model
        },
        subtasks: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task', // Self-reference for subtasks
        }],
        isDeleted: {
            type: Boolean,
            default: false,
            select: false, // Excluded from queries by default
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
        toJSON: {
            transform: (_doc, ret) => {
                ret.id = ret._id.toString();
                delete ret._id;
                delete ret.__v;
                delete ret.isDeleted; // Don't expose isDeleted in API responses
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

// Indexes for better query performance
// TaskSchema.index({ userId: 1 });
// TaskSchema.index({ status: 1 });
// TaskSchema.index({ priority: 1 });
// TaskSchema.index({ dueDate: 1 });
// TaskSchema.index({ slug: 1 }, { unique: true, sparse: true });

// Create and export the model
export const TaskModel = mongoose.model<TaskDocument>('Task', TaskSchema);