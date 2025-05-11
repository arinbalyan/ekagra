import axios from 'axios';
import { ApiResponse, AuthResponse, Task, Timer, TimerStats, User, UserPreferences } from '@/types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const auth = {
  register: async (data: { email: string; password: string; name: string }) => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return response.data;
  },
  login: async (data: { email: string; password: string }) => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return response.data;
  },
  getMe: async () => {
    const response = await api.get<ApiResponse<{ user: User }>>('/auth/me');
    return response.data;
  },
  updatePreferences: async (preferences: Partial<UserPreferences>) => {
    const response = await api.patch<ApiResponse<{ user: User }>>('/auth/preferences', { preferences });
    return response.data;
  }
};

// Tasks API
export const tasks = {
  create: async (data: Partial<Task>) => {
    const response = await api.post<ApiResponse<{ task: Task }>>('/tasks', data);
    return response.data;
  },
  getAll: async (params?: { status?: string; category?: string; priority?: string }) => {
    const response = await api.get<ApiResponse<{ tasks: Task[] }>>('/tasks', { params });
    return response.data;
  },
  getOne: async (id: string) => {
    const response = await api.get<ApiResponse<{ task: Task }>>(`/tasks/${id}`);
    return response.data;
  },
  update: async (id: string, data: Partial<Task>) => {
    const response = await api.patch<ApiResponse<{ task: Task }>>(`/tasks/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<null>>(`/tasks/${id}`);
    return response.data;
  },
  updateStatus: async (id: string, status: Task['status']) => {
    const response = await api.patch<ApiResponse<{ task: Task }>>(`/tasks/${id}/status`, { status });
    return response.data;
  }
};

// Timer API
export const timer = {
  start: async (data: { type: Timer['type']; duration: number; task?: string }) => {
    const response = await api.post<ApiResponse<{ timer: Timer }>>('/timer/start', data);
    return response.data;
  },
  end: async (id: string) => {
    const response = await api.post<ApiResponse<{ timer: Timer }>>(`/timer/end/${id}`);
    return response.data;
  },
  getHistory: async (params?: { type?: string; startDate?: string; endDate?: string }) => {
    const response = await api.get<ApiResponse<{ timers: Timer[] }>>('/timer/history', { params });
    return response.data;
  },
  getStats: async (params?: { startDate?: string; endDate?: string }) => {
    const response = await api.get<ApiResponse<{ stats: TimerStats[] }>>('/timer/stats', { params });
    return response.data;
  }
};

export default api; 