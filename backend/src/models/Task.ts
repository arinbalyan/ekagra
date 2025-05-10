import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'completed';
  estimatedPomodoros: number;
  completedPomodoros: number;
  dueDate?: Date;
  completedAt?: Date;
}

const taskSchema = new Schema<ITask>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Task category is required'],
    trim: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'completed'],
    default: 'todo'
  },
  estimatedPomodoros: {
    type: Number,
    default: 1,
    min: 1
  },
  completedPomodoros: {
    type: Number,
    default: 0,
    min: 0
  },
  dueDate: Date,
  completedAt: Date
}, {
  timestamps: true
});

// Index for efficient querying
taskSchema.index({ user: 1, status: 1, priority: 1 });
taskSchema.index({ user: 1, dueDate: 1 });

export const Task = mongoose.model<ITask>('Task', taskSchema); 