import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, CheckCircle2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function AITaskBoard({ tasks, workspace, personalities }) {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedAI, setSelectedAI] = useState("");
  const queryClient = useQueryClient();

  const createTaskMutation = useMutation({
    mutationFn: (data) => base44.entities.AITask.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaceTasks'] });
      setNewTaskTitle("");
      setSelectedAI("");
    }
  });

  const handleCreateTask = () => {
    if (!newTaskTitle || !selectedAI) return;
    
    createTaskMutation.mutate({
      workspace_id: workspace.id,
      task_title: newTaskTitle,
      task_description: "",
      assigned_to: selectedAI,
      priority: "medium",
      status: "pending",
      progress: 0
    });
  };

  const tasksByStatus = {
    pending: tasks.filter(t => t.status === 'pending'),
    in_progress: tasks.filter(t => t.status === 'in_progress'),
    completed: tasks.filter(t => t.status === 'completed')
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <Card className="p-4 mb-4 flex-shrink-0">
        <div className="flex gap-3">
          <Input
            placeholder="Nouvelle tâche..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="flex-1"
          />
          <Select value={selectedAI} onValueChange={setSelectedAI}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Assigner à..." />
            </SelectTrigger>
            <SelectContent>
              {workspace.assigned_characters?.map((char) => (
                <SelectItem key={char.character_id} value={char.character_name}>
                  {char.character_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={handleCreateTask}
            disabled={!newTaskTitle || !selectedAI || createTaskMutation.isPending}
          >
            <Plus className="w-4 h-4 mr-2" />
            Créer
          </Button>
        </div>
      </Card>

      <ScrollArea className="flex-1">
        <div className="grid md:grid-cols-3 gap-4 pr-4">
          {['pending', 'in_progress', 'completed'].map((status) => (
            <Card key={status} className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                {status === 'pending' && '📋 À faire'}
                {status === 'in_progress' && '⚡ En cours'}
                {status === 'completed' && '✅ Terminé'}
                <Badge variant="outline">{tasksByStatus[status].length}</Badge>
              </h3>
              
              <div className="space-y-3">
                {tasksByStatus[status].map((task, idx) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Card className="p-3 bg-slate-50">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm">{task.task_title}</h4>
                        <Badge className={`${getPriorityColor(task.priority)} text-white text-xs`}>
                          {task.priority}
                        </Badge>
                      </div>
                      <div className="text-xs text-slate-600 mb-2">
                        Assigné à: {task.assigned_to}
                      </div>
                      {task.progress > 0 && (
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-purple-500"
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}