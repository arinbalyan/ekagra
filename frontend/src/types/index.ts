export interface User {
  id: string;
  email: string;
  name: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  pomodoroDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  darkMode: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'completed';
  estimatedPomodoros: number;
  completedPomodoros: number;
  dueDate?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Timer {
  id: string;
  type: 'pomodoro' | 'shortBreak' | 'longBreak';
  startTime: string;
  endTime?: string;
  duration: number;
  completed: boolean;
  interrupted: boolean;
  interruptionReason?: string;
  task?: {
    id: string;
    title: string;
    category: string;
  };
}

export interface TimerStats {
  _id: string;
  totalSessions: number;
  totalMinutes: number;
  averageDuration: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  data: T;
  message?: string;
} 