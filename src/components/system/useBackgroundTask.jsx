/**
 * Hook simplifié pour gérer les tâches en arrière-plan
 */

import { useCallback } from 'react';
import { useBackgroundTasks } from './BackgroundTasksManager';

export function useBackgroundTask(taskId, taskName) {
  const { registerTask, updateTask, completeTask, failTask, getTask } = useBackgroundTasks();

  const startTask = useCallback((description = '', data = {}) => {
    registerTask(taskId, {
      name: taskName,
      description,
      ...data
    });
  }, [taskId, taskName, registerTask]);

  const updateProgress = useCallback((progress, description = null) => {
    const updates = { progress };
    if (description) updates.description = description;
    updateTask(taskId, updates);
  }, [taskId, updateTask]);

  const finishTask = useCallback((result = null) => {
    completeTask(taskId, result);
  }, [taskId, completeTask]);

  const errorTask = useCallback((error) => {
    failTask(taskId, error);
  }, [taskId, failTask]);

  const getCurrentTask = useCallback(() => {
    return getTask(taskId);
  }, [taskId, getTask]);

  return {
    startTask,
    updateProgress,
    finishTask,
    errorTask,
    getCurrentTask
  };
}