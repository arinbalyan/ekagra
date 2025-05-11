import { Task } from '@/types';
import { useTask } from '@/contexts/TaskContext';
import { useTimer } from '@/contexts/TimerContext';
import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

interface TaskItemProps {
  task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
  const { updateTaskStatus } = useTask();
  const { startTimer } = useTimer();

  const handleStatusChange = async () => {
    const newStatus = task.status === 'completed' ? 'todo' : 'completed';
    await updateTaskStatus(task.id, newStatus);
  };

  const handleStartTimer = async () => {
    await startTimer('pomodoro', 25, task.id);
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-[#ff69b4]';
      case 'medium':
        return 'text-[#ff8c00]';
      case 'low':
        return 'text-[#00ffcc]';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="gradient-card shadow rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleStatusChange}
              className={`focus:outline-none ${
                task.status === 'completed' ? 'text-[#00ffcc]' : 'text-gray-400'
              }`}
            >
              <CheckCircleIcon className="h-6 w-6" />
            </button>
            <h3
              className={`text-lg font-medium ${
                task.status === 'completed'
                  ? 'text-gray-500 line-through'
                  : 'text-white'
              }`}
            >
              {task.title}
            </h3>
          </div>
          {task.description && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {task.description}
            </p>
          )}
          <div className="mt-2 flex items-center space-x-4">
            <span className={`text-sm font-medium ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {task.category}
            </span>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <ClockIcon className="h-4 w-4 mr-1" />
              {task.completedPomodoros}/{task.estimatedPomodoros}
            </div>
          </div>
        </div>
        {task.status !== 'completed' && (
          <button
            onClick={handleStartTimer}
            className="ml-4 px-3 py-1 text-sm gradient-button rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8a2be2]"
          >
            Start
          </button>
        )}
      </div>
    </div>
  );
}