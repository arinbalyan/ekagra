"use client";

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Timer } from '@/types';
import { timer } from '@/lib/api';
import { useAuth } from './AuthContext';

interface TimerContextType {
  currentTimer: Timer | null;
  timeLeft: number;
  isRunning: boolean;
  startTimer: (type: Timer['type'], duration: number, taskId?: string) => Promise<void>;
  pauseTimer: () => void;
  resumeTimer: () => void;
  endTimer: () => Promise<void>;
  skipTimer: () => Promise<void>;
  timerHistory: Timer[];
  error: string | null;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

const GUEST_TIMERS_KEY = 'ekagra_guest_timers';

function getGuestTimers(): Timer[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(GUEST_TIMERS_KEY);
  return data ? JSON.parse(data) : [];
}

function setGuestTimers(timers: Timer[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(GUEST_TIMERS_KEY, JSON.stringify(timers));
}

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [currentTimer, setCurrentTimer] = useState<Timer | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [timerHistory, setTimerHistory] = useState<Timer[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch timer history on mount or user change
  useEffect(() => {
    const fetchHistory = async () => {
      setError(null);
      if (user) {
        try {
          const { data } = await timer.getHistory();
          setTimerHistory(data.timers);
        } catch (err) {
          setError('Failed to fetch timer history');
        }
      } else {
        setTimerHistory(getGuestTimers());
      }
    };
    fetchHistory();
  }, [user]);

  const startTimer = async (type: Timer['type'], duration: number, taskId?: string) => {
    setError(null);
    try {
      if (user) {
        const { data } = await timer.start({ type, duration, task: taskId });
        setCurrentTimer(data.timer);
        setTimeLeft(duration * 60);
        setIsRunning(true);
        startCountdown();
      } else {
        // Guest mode: create a timer object
        const newTimer: Timer = {
          id: Math.random().toString(36).substr(2, 9),
          type,
          startTime: new Date().toISOString(),
          duration,
          completed: false,
          interrupted: false,
        };
        setCurrentTimer(newTimer);
        setTimeLeft(duration * 60);
        setIsRunning(true);
        startCountdown();
      }
    } catch (error) {
      setError('Failed to start timer');
      throw error;
    }
  };

  const startCountdown = useCallback(() => {
    if (intervalId) {
      clearInterval(intervalId);
    }
    const id = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          setIsRunning(false);
          endTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setIntervalId(id);
  }, [intervalId]);

  const pauseTimer = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setIsRunning(false);
  };

  const resumeTimer = () => {
    if (!isRunning && timeLeft > 0) {
      setIsRunning(true);
      startCountdown();
    }
  };

  const endTimer = async () => {
    setError(null);
    if (currentTimer) {
      try {
        if (user) {
          await timer.end(currentTimer.id);
          setCurrentTimer(null);
          setTimeLeft(0);
          setIsRunning(false);
          if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
          }
          // Refresh history
          const { data } = await timer.getHistory();
          setTimerHistory(data.timers);
        } else {
          // Guest mode: mark timer as completed and store in localStorage
          const finishedTimer = {
            ...currentTimer,
            endTime: new Date().toISOString(),
            completed: true,
          };
          const updated = [finishedTimer, ...getGuestTimers()];
          setGuestTimers(updated);
          setTimerHistory(updated);
          setCurrentTimer(null);
          setTimeLeft(0);
          setIsRunning(false);
          if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
          }
        }
      } catch (error) {
        setError('Failed to end timer');
        throw error;
      }
    }
  };

  const skipTimer = async () => {
    await endTimer();
  };

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  return (
    <TimerContext.Provider
      value={{
        currentTimer,
        timeLeft,
        isRunning,
        startTimer,
        pauseTimer,
        resumeTimer,
        endTimer,
        skipTimer,
        timerHistory,
        error,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
} 