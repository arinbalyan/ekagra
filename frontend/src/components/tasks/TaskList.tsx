import { useState } from 'react';
import { useTask } from '@/contexts/TaskContext';
import { Task } from '@/types';
import TaskItem from './TaskItem';
import CreateTaskModal from './CreateTaskModal';

export default function TaskList() {
  const { taskList, loading, error } = useTask();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <div className="text-sm text-red-700">{error}</div>
      </div>
    );
  }

  return (
    <div className="gradient-card shadow rounded-lg">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold gradient-primary">Tasks</h2>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 gradient-button rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8a2be2]"
          >
            Add Task
          </button>
        </div>

        <div className="space-y-4">
          {taskList.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              No tasks yet. Create one to get started!
            </p>
          ) : (
            taskList.map((task) => <TaskItem key={task.id} task={task} />)
          )}
        </div>
      </div>

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}