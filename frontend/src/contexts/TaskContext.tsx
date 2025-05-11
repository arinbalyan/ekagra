"use client";

import { createContext, useContext, useState, useCallback } from 'react';
import { Task } from '@/types';
import { tasks } from '@/lib/api';
import { useAuth } from './AuthContext';

interface TaskContextType {
  taskList: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: (params?: { status?: string; category?: string; priority?: string }) => Promise<void>;
  createTask: (task: Partial<Task>) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateTaskStatus: (id: string, status: Task['status']) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const GUEST_TASKS_KEY = 'ekagra_guest_tasks';

function getGuestTasks(): Task[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(GUEST_TASKS_KEY);
  return data ? JSON.parse(data) : [];
}

function setGuestTasks(tasks: Task[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(GUEST_TASKS_KEY, JSON.stringify(tasks));
}

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async (params?: { status?: string; category?: string; priority?: string }) => {
    setLoading(true);
    setError(null);
    try {
      if (user) {
        const { data } = await tasks.getAll(params);
        setTaskList(data.tasks);
      } else {
        let guestTasks = getGuestTasks();
        setTaskList(guestTasks);
      }
    } catch (error) {
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createTask = async (task: Partial<Task>) => {
    setLoading(true);
    setError(null);
    try {
      if (user) {
        const { data } = await tasks.create(task);
        setTaskList((prev) => [data.task, ...prev]);
      } else {
        // Guest mode: create a new task with a random id
        const newTask: Task = {
          id: Math.random().toString(36).substr(2, 9),
          title: task.title || '',
          description: task.description,
          category: task.category || '',
          priority: task.priority || 'medium',
          status: 'todo',
          estimatedPomodoros: task.estimatedPomodoros || 1,
          completedPomodoros: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const updated = [newTask, ...getGuestTasks()];
        setGuestTasks(updated);
        setTaskList(updated);
      }
    } catch (error) {
      setError('Failed to create task');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id: string, task: Partial<Task>) => {
    setLoading(true);
    setError(null);
    try {
      if (user) {
        const { data } = await tasks.update(id, task);
        setTaskList((prev) => prev.map((t) => (t.id === id ? data.task : t)));
      } else {
        let guestTasks = getGuestTasks();
        guestTasks = guestTasks.map((t) => (t.id === id ? { ...t, ...task, updatedAt: new Date().toISOString() } : t));
        setGuestTasks(guestTasks);
        setTaskList(guestTasks);
      }
    } catch (error) {
      setError('Failed to update task');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      if (user) {
        await tasks.delete(id);
        setTaskList((prev) => prev.filter((t) => t.id !== id));
      } else {
        let guestTasks = getGuestTasks();
        guestTasks = guestTasks.filter((t) => t.id !== id);
        setGuestTasks(guestTasks);
        setTaskList(guestTasks);
      }
    } catch (error) {
      setError('Failed to delete task');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (id: string, status: Task['status']) => {
    setLoading(true);
    setError(null);
    try {
      if (user) {
        const { data } = await tasks.updateStatus(id, status);
        setTaskList((prev) => prev.map((t) => (t.id === id ? data.task : t)));
      } else {
        let guestTasks = getGuestTasks();
        guestTasks = guestTasks.map((t) => (t.id === id ? { ...t, status, updatedAt: new Date().toISOString(), completedAt: status === 'completed' ? new Date().toISOString() : undefined } : t));
        setGuestTasks(guestTasks);
        setTaskList(guestTasks);
      }
    } catch (error) {
      setError('Failed to update task status');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        taskList,
        loading,
        error,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
        updateTaskStatus
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTask() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
} 