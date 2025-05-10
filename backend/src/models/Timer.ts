import mongoose, { Document, Schema } from 'mongoose';

export interface ITimer extends Document {
  user: mongoose.Types.ObjectId;
  task?: mongoose.Types.ObjectId;
  type: 'pomodoro' | 'shortBreak' | 'longBreak';
  startTime: Date;
  endTime?: Date;
  duration: number;
  completed: boolean;
  interrupted: boolean;
  interruptionReason?: string;
}

const timerSchema = new Schema<ITimer>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  task: {
    type: Schema.Types.ObjectId,
    ref: 'Task'
  },
  type: {
    type: String,
    enum: ['pomodoro', 'shortBreak', 'longBreak'],
    required: true
  },
  startTime: {
    type: Date,
    required: true,
    default: Date.now
  },
  endTime: Date,
  duration: {
    type: Number,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  interrupted: {
    type: Boolean,
    default: false
  },
  interruptionReason: String
}, {
  timestamps: true
});

// Index for efficient querying
timerSchema.index({ user: 1, startTime: -1 });
timerSchema.index({ user: 1, type: 1, completed: 1 });

export const Timer = mongoose.model<ITimer>('Timer', timerSchema); 