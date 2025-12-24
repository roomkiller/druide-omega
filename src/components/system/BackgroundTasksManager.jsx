/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Background Tasks Manager                                   ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ║ SYSTEM: Permet aux tâches de continuer pendant navigation                 ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const BackgroundTasksContext = createContext();

export const useBackgroundTasks = () => {
  const context = useContext(BackgroundTasksContext);
  if (!context) {
    throw new Error('useBackgroundTasks must be used within BackgroundTasksProvider');
  }
  return context;
};

export function BackgroundTasksProvider({ children }) {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('druide_background_tasks');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('druide_background_tasks', JSON.stringify(tasks));
    } catch (error) {
      console.warn('Failed to save background tasks:', error);
    }
  }, [tasks]);

  const registerTask = useCallback((taskId, taskData) => {
    setTasks(prev => ({
      ...prev,
      [taskId]: {
        ...taskData,
        id: taskId,
        startTime: Date.now(),
        status: 'running'
      }
    }));
    console.log(`[BackgroundTasks] Task registered: ${taskId}`);
  }, []);

  const updateTask = useCallback((taskId, updates) => {
    setTasks(prev => {
      if (!prev[taskId]) return prev;
      return {
        ...prev,
        [taskId]: { ...prev[taskId], ...updates }
      };
    });
  }, []);

  const completeTask = useCallback((taskId, result = null) => {
    setTasks(prev => {
      if (!prev[taskId]) return prev;
      return {
        ...prev,
        [taskId]: {
          ...prev[taskId],
          status: 'completed',
          result,
          endTime: Date.now()
        }
      };
    });
    console.log(`[BackgroundTasks] Task completed: ${taskId}`);
  }, []);

  const failTask = useCallback((taskId, error) => {
    setTasks(prev => {
      if (!prev[taskId]) return prev;
      return {
        ...prev,
        [taskId]: {
          ...prev[taskId],
          status: 'failed',
          error,
          endTime: Date.now()
        }
      };
    });
    console.error(`[BackgroundTasks] Task failed: ${taskId}`, error);
  }, []);

  const removeTask = useCallback((taskId) => {
    setTasks(prev => {
      const newTasks = { ...prev };
      delete newTasks[taskId];
      return newTasks;
    });
  }, []);

  const getTask = useCallback((taskId) => {
    return tasks[taskId] || null;
  }, [tasks]);

  const getActiveTasks = useCallback(() => {
    return Object.values(tasks).filter(t => t.status === 'running');
  }, [tasks]);

  const clearCompletedTasks = useCallback(() => {
    setTasks(prev => {
      const newTasks = {};
      Object.entries(prev).forEach(([id, task]) => {
        if (task.status === 'running') {
          newTasks[id] = task;
        }
      });
      return newTasks;
    });
  }, []);

  const value = {
    tasks: Object.values(tasks),
    activeTasks: Object.values(tasks).filter(t => t.status === 'running'),
    registerTask,
    updateTask,
    completeTask,
    failTask,
    removeTask,
    getTask,
    getActiveTasks,
    clearCompletedTasks
  };

  return (
    <BackgroundTasksContext.Provider value={value}>
      {children}
    </BackgroundTasksContext.Provider>
  );
}