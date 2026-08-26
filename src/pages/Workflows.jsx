/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Workflows Management Page                                  ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useIntegrationRelay } from "@/components/system/IntegrationRelay";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import WorkflowBuilder from "../components/workflow/WorkflowBuilder";
import WorkflowSuggestions from "../components/workflow/WorkflowSuggestions";
import { WorkflowExecutor } from "../components/workflow/WorkflowExecutor";
import { 
  Plus, 
  Play, 
  Pause, 
  Trash2,
  Edit,
  Zap,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  ArrowLeft
} from "lucide-react";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function Workflows() {
  const [view, setView] = useState("list"); // list | create | edit
  const [editingWorkflow, setEditingWorkflow] = useState(null);
  const queryClient = useQueryClient();
  const { relayOn } = useIntegrationRelay();

  const { data: workflows = [], isLoading } = useQuery({
    queryKey: ['workflows'],
    queryFn: () => base44.entities.Workflow.list('-created_date'),
  });

  const { data: executions = [] } = useQuery({
    queryKey: ['workflowExecutions'],
    queryFn: () => base44.entities.WorkflowExecution.list('-created_date', 20),
  });

  const { data: conversations = [] } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => base44.entities.Conversation.list(),
  });

  const { data: memories = [] } = useQuery({
    queryKey: ['memories'],
    queryFn: () => base44.entities.Memory.list(),
  });

  const createWorkflowMutation = useMutation({
    mutationFn: (workflow) => base44.entities.Workflow.create(workflow),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      setView("list");
    }
  });

  const updateWorkflowMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Workflow.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      setView("list");
      setEditingWorkflow(null);
    }
  });

  const deleteWorkflowMutation = useMutation({
    mutationFn: (id) => base44.entities.Workflow.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    }
  });

  const toggleWorkflowMutation = useMutation({
    mutationFn: ({ id, status }) => 
      base44.entities.Workflow.update(id, { status: status === "active" ? "paused" : "active" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    }
  });

  const handleSave = (workflowData) => {
    if (editingWorkflow) {
      updateWorkflowMutation.mutate({ id: editingWorkflow.id, data: workflowData });
    } else {
      createWorkflowMutation.mutate(workflowData);
    }
  };

  const handleTest = async (workflow) => {
    if (!relayOn) { alert("Arrêt interne — relais d'intégration désactivé. Activez le relais (bouton vert en bas à gauche) pour tester un workflow."); return; }
    const result = await WorkflowExecutor.execute(workflow, { test: true, timestamp: Date.now() });
    if (result.success) {
      alert("✅ Workflow testé avec succès!");
    } else {
      alert(`❌ Erreur: ${result.error}`);
    }
    queryClient.invalidateQueries({ queryKey: ['workflowExecutions'] });
  };

  const handleRun = async (workflow) => {
    if (!relayOn) { alert("Arrêt interne — relais d'intégration désactivé. Activez le relais (bouton vert en bas à gauche) pour exécuter un workflow."); return; }
    await WorkflowExecutor.execute(workflow, { manual_trigger: true });
    queryClient.invalidateQueries({ queryKey: ['workflowExecutions'] });
  };

  const handleCreateFromSuggestion = (suggestion) => {
    setEditingWorkflow({
      name: suggestion.name,
      description: suggestion.description,
      trigger: { type: suggestion.trigger, config: {} },
      actions: suggestion.actions.map((action, idx) => ({
        id: `action_${idx}`,
        type: "ai_analysis",
        config: { prompt: action },
        position: { x: 100, y: idx * 120 + 100 }
      })),
      ai_suggested: true
    });
    setView("create");
  };

  const userActivity = {
    conversations: conversations.length,
    memories: memories.length,
    knowledge: 0,
    frequent_actions: ["chat", "create_memory", "analyze"],
    active_hours: ["9-12", "14-18"]
  };

  const stats = {
    total: workflows.length,
    active: workflows.filter(w => w.status === "active").length,
    executions: executions.length,
    success_rate: executions.length > 0 
      ? (executions.filter(e => e.status === "success").length / executions.length * 100).toFixed(0)
      : 100
  };

  if (view === "create" || view === "edit") {
    return (
      <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30">
        <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 px-6 py-4 flex-shrink-0">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900">
              {editingWorkflow ? "Modifier" : "Nouveau"} Workflow
            </h1>
            <Button variant="outline" onClick={() => { setView("list"); setEditingWorkflow(null); }}>
              Annuler
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="max-w-6xl mx-auto px-6 py-8">
            <WorkflowBuilder
              workflow={editingWorkflow}
              onSave={handleSave}
              onTest={handleTest}
            />
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 px-6 py-6 flex-shrink-0">
        <div className="max-w-6xl mx-auto">
          <Button
            onClick={() => window.location.href = createPageUrl('ArchitectDashboard')}
            variant="ghost"
            size="sm"
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour Dashboard
          </Button>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Workflows</h1>
                <p className="text-sm text-slate-600">Automatisez vos tâches avec l'IA</p>
              </div>
            </div>

            <Button
              onClick={() => setView("create")}
              className="bg-gradient-to-r from-purple-600 to-indigo-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Workflow
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
              <div className="text-xs text-slate-600">Workflows</div>
            </Card>
            <Card className="p-4">
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <div className="text-xs text-slate-600">Actifs</div>
            </Card>
            <Card className="p-4">
              <div className="text-2xl font-bold text-indigo-600">{stats.executions}</div>
              <div className="text-xs text-slate-600">Exécutions</div>
            </Card>
            <Card className="p-4">
              <div className="text-2xl font-bold text-purple-600">{stats.success_rate}%</div>
              <div className="text-xs text-slate-600">Succès</div>
            </Card>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
          {/* AI Suggestions */}
          <WorkflowSuggestions
            userActivity={userActivity}
            onCreateFromSuggestion={handleCreateFromSuggestion}
          />

          {/* Workflows List */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Mes Workflows</h2>
            
            {workflows.length === 0 ? (
              <Card className="p-12 text-center">
                <Zap className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Aucun workflow</h3>
                <p className="text-sm text-slate-600 mb-6">Créez votre premier workflow automatisé</p>
                <Button onClick={() => setView("create")} className="bg-gradient-to-r from-purple-600 to-indigo-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Créer
                </Button>
              </Card>
            ) : (
              <div className="grid gap-4">
                <AnimatePresence>
                  {workflows.map((workflow, idx) => (
                    <motion.div
                      key={workflow.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Card className="p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-slate-900">{workflow.name}</h3>
                              <Badge variant={workflow.status === "active" ? "default" : "outline"}>
                                {workflow.status}
                              </Badge>
                              {workflow.ai_suggested && (
                                <Badge className="bg-purple-100 text-purple-700">IA</Badge>
                              )}
                            </div>
                            <p className="text-sm text-slate-600 mb-3">{workflow.description}</p>
                            
                            <div className="flex gap-4 text-xs text-slate-500">
                              <div className="flex items-center gap-1">
                                <Zap className="w-3 h-3" />
                                {workflow.actions?.length || 0} actions
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {workflow.execution_count || 0} exécutions
                              </div>
                              <div className="flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                {workflow.success_rate || 100}% succès
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2 ml-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRun(workflow)}
                            >
                              <Play className="w-3 h-3" />
                            </Button>
                            
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleWorkflowMutation.mutate({ 
                                id: workflow.id, 
                                status: workflow.status 
                              })}
                            >
                              {workflow.status === "active" ? (
                                <Pause className="w-3 h-3" />
                              ) : (
                                <Play className="w-3 h-3" />
                              )}
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingWorkflow(workflow);
                                setView("edit");
                              }}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteWorkflowMutation.mutate(workflow.id)}
                            >
                              <Trash2 className="w-3 h-3 text-red-600" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}