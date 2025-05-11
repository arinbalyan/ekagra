import { useEffect, useRef, useState } from 'react';
import { useTimer } from '@/contexts/TimerContext';
import { useAuth } from '@/contexts/AuthContext';
import { PlayIcon, PauseIcon, StopIcon } from '@heroicons/react/24/outline';

export default function Timer() {
  const {
    currentTimer,
    timeLeft,
    isRunning,
    startTimer,
    pauseTimer,
    resumeTimer,
    endTimer,
    skipTimer
  } = useTimer();
  const { user } = useAuth();

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
  };

  const handleStartPomodoro = () => {
    startTimer('pomodoro', user?.preferences.pomodoroDuration || 25);
  };

  const handleStartShortBreak = () => {
    startTimer('shortBreak', user?.preferences.shortBreakDuration || 5);
  };

  const handleStartLongBreak = () => {
    startTimer('longBreak', user?.preferences.longBreakDuration || 15);
  };

  const tickAudioRef = useRef<HTMLAudioElement | null>(null);
  const timerOverAudioRef = useRef<HTMLAudioElement | null>(null);
  const prevTimeLeftRef = useRef<number | null>(null);
  const timerOverPlayedRef = useRef<boolean>(false);

  // Play timer-over sound for pause/stop in pomodoro
  const handlePause = () => {
    if (currentTimer?.type === 'pomodoro' && timerOverAudioRef.current && !timerOverPlayedRef.current) {
      timerOverAudioRef.current.currentTime = 0;
      timerOverAudioRef.current.play();
      timerOverPlayedRef.current = true;
    }
    pauseTimer();
  };
  const handleEnd = () => {
    if (currentTimer?.type === 'pomodoro' && timerOverAudioRef.current && !timerOverPlayedRef.current) {
      timerOverAudioRef.current.currentTime = 0;
      timerOverAudioRef.current.play();
      timerOverPlayedRef.current = true;
    }
    endTimer();
  };

  useEffect(() => {
    if (!isClient) return;
    // Play tick sound once when timer starts
    if (isRunning && timeLeft > 0 && prevTimeLeftRef.current === null) {
      if (tickAudioRef.current) {
        tickAudioRef.current.currentTime = 0;
        tickAudioRef.current.play();
      }
    }
    prevTimeLeftRef.current = prevTimeLeftRef.current === null && isRunning && timeLeft > 0 ? timeLeft : prevTimeLeftRef.current;
    // Play timer over sound only once when timer completes
    if (currentTimer && timeLeft === 0 && prevTimeLeftRef.current > 0) {
      if (timerOverAudioRef.current) {
        timerOverAudioRef.current.currentTime = 0;
        timerOverAudioRef.current.play();
      }
      prevTimeLeftRef.current = 0;
      timerOverPlayedRef.current = true;
    }
    if (!isRunning) {
      prevTimeLeftRef.current = null;
      timerOverPlayedRef.current = false;
    }
  }, [isRunning, timeLeft, currentTimer, isClient]);
  return (
    <div className="gradient-card shadow rounded-lg p-6">
      {/* Audio elements for tick and timer-over sounds */}
      {isClient && (
        <>
          <audio ref={tickAudioRef} src="/sounds/tick.mp3" preload="auto" />
          <audio ref={timerOverAudioRef} src="/sounds/timer-over.mp3" preload="auto" />
        </>
      )}
      <div className="text-center">
        <h2 className="text-2xl font-bold gradient-primary mb-4">
          {currentTimer ? (
            <span className="capitalize">{currentTimer.type}</span>
          ) : (
            'Pomodoro Timer'
          )}
        </h2>

        <div className="text-6xl font-bold gradient-secondary mb-8">
          {formatTime(timeLeft)}
        </div>

        <div className="flex justify-center space-x-4 mb-8">
          {!currentTimer ? (
            <>
              <button
                onClick={handleStartPomodoro}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Start Pomodoro
              </button>
              <button
                onClick={handleStartShortBreak}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Short Break
              </button>
              <button
                onClick={handleStartLongBreak}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Long Break
              </button>
            </>
          ) : (
            <>
              {isRunning ? (
                <button
                  onClick={handlePause}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  <PauseIcon className="h-6 w-6" />
                </button>
              ) : (
                <button
                  onClick={resumeTimer}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <PlayIcon className="h-6 w-6" />
                </button>
              )}
              <button
                onClick={handleEnd}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <StopIcon className="h-6 w-6" />
              </button>
              <button
                onClick={skipTimer}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Skip
              </button>
            </>
          )}
        </div>

        {currentTimer?.task && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Current task: {currentTimer.task.title}
          </div>
        )}
      </div>
    </div>
  );
}