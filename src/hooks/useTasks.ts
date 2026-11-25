import { useEffect, useState } from 'react';
import { Task } from '../types/task';
import {
  createTask,
  deleteTaskById,
  subscribeToUserTasks,
  updateTaskStatus,
} from '../services/taskService';

export interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  addTask: (title: string) => Promise<void>;
  toggleTask: (id: string, currentCompleted: boolean) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

/**
 * Custom hook to encapsulate task data fetching, real-time sync, and CRUD mutations.
 */
export function useTasks(userId: string | undefined): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setTasks([]);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToUserTasks(
      userId,
      (updatedTasks) => {
        setTasks(updatedTasks);
        setLoading(false);
      },
      (err) => {
        setError(err.message || 'Error subscribing to tasks');
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [userId]);

  const addTask = async (title: string) => {
    if (!userId || !title.trim()) return;
    try {
      setError(null);
      await createTask(userId, title.trim());
    } catch (err: any) {
      setError(err?.message || 'Failed to add task');
    }
  };

  const toggleTask = async (id: string, currentCompleted: boolean) => {
    try {
      setError(null);
      await updateTaskStatus(id, !currentCompleted);
    } catch (err: any) {
      setError(err?.message || 'Failed to toggle task');
    }
  };

  const deleteTask = async (id: string) => {
    try {
      setError(null);
      await deleteTaskById(id);
    } catch (err: any) {
      setError(err?.message || 'Failed to delete task');
    }
  };

  return {
    tasks,
    loading,
    error,
    addTask,
    toggleTask,
    deleteTask,
  };
}
