/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Configuration Pipeline de Jugement (Admin)                 ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ║ Personnalisation des poids, seuils et règles contextuelles                ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Scale, Plus, Save, Trash2, TrendingUp, AlertCircle, CheckCircle2, Settings } from "lucide-react";

const CONTEXTES = [
  { value: "cognitive", label: "Cognitif", icon: "🧠" },
  { value: "language", label: "Linguistique", icon: "💬" },
  { value: "emotional", label: "Émotionnel", icon: "❤️" },
  { value: "creativity", label: "Créativité", icon: "✨" },
  { value: "memory", label: "Mémoire", icon: "💾" },
  { value: "reasoning", label: "Raisonnement", icon: "🎯" },
  { value: "ethical", label: "Éthique", icon: "⚖️" },
  { value: "social", label: "Social", icon: "👥" },
  { value: "technical", label: "Technique", icon: "⚙️" },
  { value: "general", label: "Général", icon: "🌐" }
];

const PRIORITES = [
  { value: "precision", label: "Précision" },
  { value: "ethique", label: "Éthique" },
  { value: "empathie", label: "Empathie" },
  { value: "creativite", label: "Créativité" },
  { value: "objectivite", label: "Objectivité" }
];

export default function JudgementConfigPanel() {
  const queryClient = useQueryClient();
  const [editingConfig, setEditingConfig] = useState(null);
  const [newRule, setNewRule] = useState(null);

  const { data: configs = [] } = useQuery({
    queryKey: ['judgementConfigs'],
    queryFn: () => base44.entities.JudgementConfig.list('-created_date', 50)
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.JudgementConfig.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['judgementConfigs']);
      setEditingConfig(null);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.JudgementConfig.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['judgementConfigs']);
      setEditingConfig(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.JudgementConfig.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['judgementConfigs'])
  });

  const activeConfig = configs.find(c => c.active) || configs[0];

  const createNewConfig = () => {
    setEditingConfig({
      config_name: "Nouvelle Configuration",
      ratio_interne: 3,
      ratio_externe: 7,
      seuil_calibration_min: 5,
      seuil_calibration_optimal: 10,
      seuil_importance_min: 3,
      regles_contextuelles: [],
      mode_adaptatif: true,
      active: false
    });
  };

  const saveConfig = () => {
    if (editingConfig.id) {
      updateMutation.mutate({ id: editingConfig.id, data: editingConfig });
    } else {
      createMutation.mutate(editingConfig);
    }
  };

  const addRule = () => {
    if (!newRule) return;
    
    setEditingConfig(prev => ({
      ...prev,
      regles_contextuelles: [...(prev.regles_contextuelles || []), newRule]
    }));
    setNewRule(null);
  };

  const removeRule = (index) => {
    setEditingConfig(prev => ({
      ...prev,
      regles_contextuelles: prev.regles_contextuelles.filter((_, i) => i !== index)
    }));
  };

  const activateConfig = (configId) => {
    // Désactiver toutes, activer celle-ci
    configs.forEach(async (c) => {
      if (c.id === configId) {
        await base44.entities.JudgementConfig.update(c.id, { active: true });
      } else if (c.active) {
        await base44.entities.JudgementConfig.update(c.id, { active: false });
      }
    });
    queryClient.invalidateQueries(['judgementConfigs']);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Configuration Pipeline de Jugement</h2>
              <p className="text-slate-600 text-sm">Personnalisation des poids, seuils et règles contextuelles</p>
            </div>
          </div>
          <Button onClick={createNewConfig} className="bg-purple-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Config
          </Button>
        </div>
      </Card>

      {/* Config Active */}
      {activeConfig && (
        <Card className="p-6 border-2 border-green-300 bg-green-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-bold text-green-900">Configuration Active</h3>
            </div>
            <Badge className="bg-green-600 text-white">EN PRODUCTION</Badge>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-green-700 mb-1">Nom:</p>
              <p className="font-bold text-green-900">{activeConfig.config_name}</p>
            </div>
            <div>
              <p className="text-sm text-green-700 mb-1">Ratio Interne:Externe:</p>
              <p className="font-bold text-green-900">{activeConfig.ratio_interne}:{activeConfig.ratio_externe}</p>
            </div>
            <div>
              <p className="text-sm text-green-700 mb-1">Mode Adaptatif:</p>
              <p className="font-bold text-green-900">{activeConfig.mode_adaptatif ? 'OUI' : 'NON'}</p>
            </div>
          </div>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Liste Configs */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Configurations Disponibles</h3>
          <ScrollArea className="h-[500px]">
            <div className="space-y-3">
              {configs.map(config => (
                <motion.div
                  key={config.id}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-lg border cursor-pointer ${
                    config.active ? 'bg-green-50 border-green-300' : 'bg-white border-slate-200'
                  }`}
                  onClick={() => setEditingConfig(config)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-slate-900">{config.config_name}</h4>
                      <p className="text-xs text-slate-600">Ratio {config.ratio_interne}:{config.ratio_externe}</p>
                    </div>
                    {config.active && <Badge className="bg-green-600 text-white text-xs">ACTIF</Badge>}
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-slate-600 mb-2">
                    <span>Calibration: {config.seuil_calibration_min}-{config.seuil_calibration_optimal}</span>
                    <span>•</span>
                    <span>{config.regles_contextuelles?.length || 0} règles</span>
                  </div>

                  <div className="flex gap-2">
                    {!config.active && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          activateConfig(config.id);
                        }}
                      >
                        Activer
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteMutation.mutate(config.id);
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Éditeur */}
        {editingConfig && (
          <Card className="p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              {editingConfig.id ? 'Modifier' : 'Créer'} Configuration
            </h3>

            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                {/* Nom */}
                <div>
                  <Label>Nom de la Configuration</Label>
                  <Input
                    value={editingConfig.config_name}
                    onChange={(e) => setEditingConfig({ ...editingConfig, config_name: e.target.value })}
                  />
                </div>

                {/* Ratios */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Ratio Interne (0-10)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="10"
                      value={editingConfig.ratio_interne}
                      onChange={(e) => setEditingConfig({ ...editingConfig, ratio_interne: parseInt(e.target.value) })}
                    />
                    <p className="text-xs text-slate-600 mt-1">Traitement conscience</p>
                  </div>
                  <div>
                    <Label>Ratio Externe (0-10)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="10"
                      value={editingConfig.ratio_externe}
                      onChange={(e) => setEditingConfig({ ...editingConfig, ratio_externe: parseInt(e.target.value) })}
                    />
                    <p className="text-xs text-slate-600 mt-1">Divulgation sortie</p>
                  </div>
                </div>

                {/* Seuils */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Calibration Min (0-15)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="15"
                      value={editingConfig.seuil_calibration_min}
                      onChange={(e) => setEditingConfig({ ...editingConfig, seuil_calibration_min: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label>Calibration Optimale (0-15)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="15"
                      value={editingConfig.seuil_calibration_optimal}
                      onChange={(e) => setEditingConfig({ ...editingConfig, seuil_calibration_optimal: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div>
                  <Label>Importance Minimale (0-10)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="10"
                    value={editingConfig.seuil_importance_min}
                    onChange={(e) => setEditingConfig({ ...editingConfig, seuil_importance_min: parseInt(e.target.value) })}
                  />
                </div>

                {/* Mode Adaptatif */}
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <Label>Mode Adaptatif (Auto-ajustement)</Label>
                  <Switch
                    checked={editingConfig.mode_adaptatif}
                    onCheckedChange={(checked) => setEditingConfig({ ...editingConfig, mode_adaptatif: checked })}
                  />
                </div>

                {/* Règles Contextuelles */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-base">Règles Contextuelles</Label>
                    <Button size="sm" variant="outline" onClick={() => setNewRule({
                      contexte: "general",
                      priorite: "precision",
                      ratio_override: { interne: 3, externe: 7 },
                      seuil_calibration_ajuste: 10
                    })}>
                      <Plus className="w-3 h-3 mr-1" />
                      Ajouter
                    </Button>
                  </div>

                  {/* Nouvelle règle */}
                  {newRule && (
                    <Card className="p-3 mb-3 bg-blue-50 border-blue-300">
                      <div className="space-y-2">
                        <Select value={newRule.contexte} onValueChange={(v) => setNewRule({ ...newRule, contexte: v })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {CONTEXTES.map(c => (
                              <SelectItem key={c.value} value={c.value}>{c.icon} {c.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select value={newRule.priorite} onValueChange={(v) => setNewRule({ ...newRule, priorite: v })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Priorité" />
                          </SelectTrigger>
                          <SelectContent>
                            {PRIORITES.map(p => (
                              <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            type="number"
                            placeholder="Interne"
                            value={newRule.ratio_override?.interne || 3}
                            onChange={(e) => setNewRule({
                              ...newRule,
                              ratio_override: { ...newRule.ratio_override, interne: parseInt(e.target.value) }
                            })}
                          />
                          <Input
                            type="number"
                            placeholder="Externe"
                            value={newRule.ratio_override?.externe || 7}
                            onChange={(e) => setNewRule({
                              ...newRule,
                              ratio_override: { ...newRule.ratio_override, externe: parseInt(e.target.value) }
                            })}
                          />
                        </div>

                        <Button size="sm" onClick={addRule} className="w-full">Ajouter Règle</Button>
                      </div>
                    </Card>
                  )}

                  {/* Liste règles */}
                  <div className="space-y-2">
                    {editingConfig.regles_contextuelles?.map((rule, idx) => (
                      <div key={idx} className="p-2 bg-slate-50 rounded border border-slate-200 text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <Badge variant="outline">{rule.contexte}</Badge>
                          <Button size="sm" variant="ghost" onClick={() => removeRule(idx)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                        <p className="text-slate-600">
                          Priorité: {rule.priorite} | Ratio: {rule.ratio_override?.interne}:{rule.ratio_override?.externe}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Save */}
                <Button onClick={saveConfig} className="w-full bg-purple-600 text-white" disabled={createMutation.isPending || updateMutation.isPending}>
                  <Save className="w-4 h-4 mr-2" />
                  {editingConfig.id ? 'Mettre à Jour' : 'Créer'}
                </Button>
              </div>
            </ScrollArea>
          </Card>
        )}
      </div>
    </div>
  );
}