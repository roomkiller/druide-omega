/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Background Tasks Indicator (Global)                        ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { useBackgroundTasks } from "./BackgroundTasksManager";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, XCircle, ChevronDown, ChevronUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function BackgroundTasksIndicator() {
  const { tasks, removeTask, clearCompletedTasks } = useBackgroundTasks();
  const [expanded, setExpanded] = useState(false);

  const activeTasks = tasks.filter(t => t.status === 'running');
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const failedTasks = tasks.filter(t => t.status === 'failed');

  if (tasks.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-4 right-4 z-50 w-80 max-w-[calc(100vw-2rem)]"
    >
      <Card className="bg-white/95 backdrop-blur-xl border-purple-200 shadow-2xl">
        {/* Header */}
        <div
          className="flex items-center justify-between p-4 cursor-pointer border-b border-slate-200"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center gap-2">
            {activeTasks.length > 0 && (
              <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
            )}
            <div>
              <p className="font-semibold text-slate-900">
                Tâches en cours {activeTasks.length > 0 && `(${activeTasks.length})`}
              </p>
              {completedTasks.length > 0 && (
                <p className="text-xs text-green-600">{completedTasks.length} terminée(s)</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {completedTasks.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  clearCompletedTasks();
                }}
                className="text-xs"
              >
                Effacer
              </Button>
            )}
            {expanded ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
          </div>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-3 rounded-lg border ${
                      task.status === 'running'
                        ? 'bg-purple-50 border-purple-200'
                        : task.status === 'completed'
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 flex-1 min-w-0">
                        {task.status === 'running' && (
                          <Loader2 className="w-4 h-4 text-purple-600 animate-spin flex-shrink-0 mt-0.5" />
                        )}
                        {task.status === 'completed' && (
                          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        )}
                        {task.status === 'failed' && (
                          <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {task.name || task.id}
                          </p>
                          {task.description && (
                            <p className="text-xs text-slate-600 truncate">{task.description}</p>
                          )}
                          {task.progress !== undefined && task.status === 'running' && (
                            <div className="mt-2">
                              <Progress value={task.progress} className="h-1" />
                              <p className="text-xs text-slate-500 mt-1">{task.progress}%</p>
                            </div>
                          )}
                          {task.status === 'failed' && task.error && (
                            <p className="text-xs text-red-600 mt-1">{task.error}</p>
                          )}
                        </div>
                      </div>
                      {task.status !== 'running' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTask(task.id)}
                          className="flex-shrink-0 p-1 h-6 w-6"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}