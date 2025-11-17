/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Visual Workflow Builder                                    ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Play, 
  Plus, 
  Trash2, 
  Save,
  Zap,
  Brain,
  Bell,
  Database,
  FileText,
  Settings,
  GitBranch,
  Repeat
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ACTION_TYPES = [
  { id: "ai_analysis", label: "Analyse IA", icon: Brain, color: "purple" },
  { id: "create_memory", label: "Créer Mémoire", icon: Database, color: "indigo" },
  { id: "send_notification", label: "Notification", icon: Bell, color: "blue" },
  { id: "generate_content", label: "Générer Contenu", icon: FileText, color: "green" },
  { id: "update_entity", label: "Mettre à jour", icon: Settings, color: "orange" },
  { id: "conditional", label: "Condition", icon: GitBranch, color: "pink" },
  { id: "loop", label: "Boucle", icon: Repeat, color: "cyan" }
];

const TRIGGER_TYPES = [
  { id: "manual", label: "Manuel" },
  { id: "schedule", label: "Planifié" },
  { id: "event", label: "Événement" },
  { id: "webhook", label: "Webhook" },
  { id: "data_change", label: "Changement Données" }
];

export default function WorkflowBuilder({ workflow, onSave, onTest }) {
  const [name, setName] = useState(workflow?.name || "");
  const [description, setDescription] = useState(workflow?.description || "");
  const [triggerType, setTriggerType] = useState(workflow?.trigger?.type || "manual");
  const [actions, setActions] = useState(workflow?.actions || []);
  const [selectedAction, setSelectedAction] = useState(null);

  const addAction = (type) => {
    const newAction = {
      id: `action_${Date.now()}`,
      type,
      config: {},
      position: { x: 100, y: actions.length * 120 + 100 }
    };
    setActions([...actions, newAction]);
  };

  const removeAction = (actionId) => {
    setActions(actions.filter(a => a.id !== actionId));
  };

  const updateActionConfig = (actionId, config) => {
    setActions(actions.map(a => 
      a.id === actionId ? { ...a, config: { ...a.config, ...config } } : a
    ));
  };

  const handleSave = () => {
    onSave({
      name,
      description,
      trigger: { type: triggerType, config: {} },
      actions,
      status: "draft"
    });
  };

  const getActionIcon = (type) => {
    const actionType = ACTION_TYPES.find(at => at.id === type);
    return actionType ? actionType.icon : Settings;
  };

  const getActionColor = (type) => {
    const actionType = ACTION_TYPES.find(at => at.id === type);
    return actionType ? actionType.color : "slate";
  };

  return (
    <div className="space-y-6">
      {/* Header Config */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label>Nom du Workflow</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Mon workflow automatisé"
              className="mt-2"
            />
          </div>

          <div>
            <Label>Description</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description du workflow"
              className="mt-2"
            />
          </div>

          <div>
            <Label>Déclencheur</Label>
            <Select value={triggerType} onValueChange={setTriggerType}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TRIGGER_TYPES.map(t => (
                  <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Actions Palette */}
      <Card className="p-4">
        <Label className="mb-3 block">Ajouter une Action</Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {ACTION_TYPES.map(actionType => {
            const Icon = actionType.icon;
            return (
              <Button
                key={actionType.id}
                variant="outline"
                onClick={() => addAction(actionType.id)}
                className="h-auto py-3 flex flex-col items-center gap-2"
              >
                <Icon className={`w-5 h-5 text-${actionType.color}-600`} />
                <span className="text-xs">{actionType.label}</span>
              </Button>
            );
          })}
        </div>
      </Card>

      {/* Canvas */}
      <Card className="p-6 min-h-[400px] bg-gradient-to-br from-slate-50 to-purple-50/30">
        <div className="flex items-center justify-between mb-4">
          <Label>Flux d'Actions</Label>
          <Badge variant="outline">{actions.length} action(s)</Badge>
        </div>

        <div className="space-y-3">
          <AnimatePresence>
            {actions.map((action, idx) => {
              const Icon = getActionIcon(action.type);
              const color = getActionColor(action.type);
              
              return (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Card
                    className={`p-4 cursor-pointer transition-all ${
                      selectedAction?.id === action.id 
                        ? `border-2 border-${color}-500 shadow-lg` 
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => setSelectedAction(action)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 bg-${color}-100 rounded-lg flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 text-${color}-600`} />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">
                            Action {idx + 1}: {ACTION_TYPES.find(at => at.id === action.type)?.label}
                          </div>
                          <div className="text-xs text-slate-600">
                            {Object.keys(action.config).length} paramètre(s)
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeAction(action.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>

                    {/* Flèche vers l'action suivante */}
                    {idx < actions.length - 1 && (
                      <div className="flex justify-center mt-2">
                        <div className="w-0.5 h-4 bg-slate-300"></div>
                      </div>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {actions.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <Zap className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p className="text-sm">Ajoutez des actions pour créer votre workflow</p>
            </div>
          )}
        </div>
      </Card>

      {/* Action Config Panel */}
      <AnimatePresence>
        {selectedAction && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50">
              <div className="flex items-center justify-between mb-4">
                <Label>Configuration de l'Action</Label>
                <Button variant="ghost" onClick={() => setSelectedAction(null)}>✕</Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-xs text-slate-600 mb-2 block">Paramètres</Label>
                  <Input
                    placeholder="Ajouter des paramètres (JSON ou texte)"
                    onChange={(e) => updateActionConfig(selectedAction.id, { params: e.target.value })}
                    value={selectedAction.config.params || ""}
                  />
                </div>

                {selectedAction.type === "ai_analysis" && (
                  <div>
                    <Label className="text-xs">Prompt IA</Label>
                    <Input
                      placeholder="Instructions pour l'IA"
                      className="mt-2"
                      onChange={(e) => updateActionConfig(selectedAction.id, { prompt: e.target.value })}
                      value={selectedAction.config.prompt || ""}
                    />
                  </div>
                )}

                {selectedAction.type === "conditional" && (
                  <div>
                    <Label className="text-xs">Condition</Label>
                    <Input
                      placeholder="ex: data.value > 100"
                      className="mt-2"
                      onChange={(e) => updateActionConfig(selectedAction.id, { condition: e.target.value })}
                      value={selectedAction.config.condition || ""}
                    />
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          onClick={handleSave}
          disabled={!name || actions.length === 0}
          className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600"
        >
          <Save className="w-4 h-4 mr-2" />
          Enregistrer
        </Button>
        
        <Button
          onClick={() => onTest && onTest({ name, trigger: { type: triggerType }, actions })}
          disabled={actions.length === 0}
          variant="outline"
          className="flex-1"
        >
          <Play className="w-4 h-4 mr-2" />
          Tester
        </Button>
      </div>
    </div>
  );
}