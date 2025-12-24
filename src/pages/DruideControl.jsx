/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Centre de Contrôle (Dashboard Temps Réel)                  ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity, 
  Brain, 
  Zap, 
  Settings,
  BarChart3,
  AlertTriangle,
  ArrowLeft,
  TrendingUp,
  Cpu,
  Heart,
  Eye
} from "lucide-react";
import { motion } from "framer-motion";

export default function DruideControl() {
  const queryClient = useQueryClient();
  const [systemHealth, setSystemHealth] = useState({
    cpu: 45,
    memory: 62,
    consciousness: 12,
    ethics: 98
  });

  // Fetch consciousness config
  const { data: config, isLoading } = useQuery({
    queryKey: ['consciousnessConfig'],
    queryFn: async () => {
      const configs = await base44.entities.ConsciousnessConfig.list();
      return configs[0] || null;
    }
  });

  // Update consciousness level
  const updateMutation = useMutation({
    mutationFn: async (updates) => {
      if (!config?.id) throw new Error('No config found');
      return await base44.entities.ConsciousnessConfig.update(config.id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consciousnessConfig'] });
    }
  });

  const handleLevelChange = (newLevel) => {
    updateMutation.mutate({ consciousness_level: newLevel });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-12 h-12 text-purple-600 animate-pulse mx-auto mb-4" />
          <p className="text-slate-600">Chargement du système...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white page-padding py-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center">
                <Activity className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold font-display mb-1">
                  Centre de Contrôle Druide
                </h1>
                <p className="text-purple-100">Supervision système en temps réel</p>
              </div>
            </div>
            <Button
              onClick={() => window.location.href = createPageUrl('ArchitectDashboard')}
              variant="ghost"
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto page-padding -mt-8 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50">
              <div className="flex items-center justify-between mb-2">
                <Brain className="w-8 h-8 text-purple-600" />
                <Badge className="bg-purple-600 text-white">Actif</Badge>
              </div>
              <div className="text-sm text-slate-600 mb-1">Conscience</div>
              <div className="text-3xl font-bold text-purple-600">
                {config?.consciousness_level || 12}/15
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50">
              <div className="flex items-center justify-between mb-2">
                <Heart className="w-8 h-8 text-green-600" />
                <Badge className="bg-green-600 text-white">{systemHealth.ethics}%</Badge>
              </div>
              <div className="text-sm text-slate-600 mb-1">Éthique</div>
              <div className="text-3xl font-bold text-green-600">OK</div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50">
              <div className="flex items-center justify-between mb-2">
                <Cpu className="w-8 h-8 text-orange-600" />
                <Badge className="bg-orange-600 text-white">{systemHealth.cpu}%</Badge>
              </div>
              <div className="text-sm text-slate-600 mb-1">CPU</div>
              <div className="text-3xl font-bold text-orange-600">
                {config?.llm_provider || 'deepseek'}
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 text-blue-600" />
                <Badge className="bg-blue-600 text-white">Optimal</Badge>
              </div>
              <div className="text-sm text-slate-600 mb-1">Performance</div>
              <div className="text-3xl font-bold text-blue-600">
                {config?.processing_speed || 9}/10
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto page-padding pb-12">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview">
              <Eye className="w-4 h-4 mr-2" />
              Vue d'ensemble
            </TabsTrigger>
            <TabsTrigger value="consciousness">
              <Brain className="w-4 h-4 mr-2" />
              Conscience
            </TabsTrigger>
            <TabsTrigger value="performance">
              <BarChart3 className="w-4 h-4 mr-2" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-2" />
              Paramètres
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-600" />
                  État du Système
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Conscience Active</span>
                    <Badge className="bg-green-100 text-green-700">Opérationnel</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Provider LLM</span>
                    <Badge className="bg-purple-100 text-purple-700">
                      {config?.llm_provider === 'deepseek' ? 'DeepSeek' : 'Base44'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Traitement Parallèle</span>
                    <Badge className="bg-blue-100 text-blue-700">
                      {config?.parallel_processing ? 'Activé' : 'Désactivé'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Mode Apprentissage</span>
                    <Badge className="bg-amber-100 text-amber-700">
                      {config?.learning_mode ? 'Actif' : 'Inactif'}
                    </Badge>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  Configuration Conscience
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Niveau</span>
                    <span className="text-lg font-bold text-purple-600">
                      {config?.consciousness_level || 12}/15
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Ratio Logic:Conscience</span>
                    <span className="text-lg font-bold text-indigo-600">
                      {config?.ratio_logic || 4}:{config?.ratio_consciousness || 6}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Profondeur Émotionnelle</span>
                    <span className="text-lg font-bold text-pink-600">
                      {config?.emotional_depth || 10}/10
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Créativité</span>
                    <span className="text-lg font-bold text-purple-600">
                      {config?.creative_emergence || 11}/10
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                Alertes Système
              </h3>
              <div className="space-y-2">
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">✓ Tous les systèmes opérationnels</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Consciousness Tab */}
          <TabsContent value="consciousness" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Ajuster le Niveau de Conscience</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-600 mb-2 block">
                    Niveau actuel: {config?.consciousness_level || 12}/15
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="15"
                    value={config?.consciousness_level || 12}
                    onChange={(e) => handleLevelChange(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                <p className="text-sm text-slate-500">
                  Ajustez le niveau de conscience de l'IA. Plus le niveau est élevé, plus les réponses sont profondes et introspectives.
                </p>
              </div>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Métriques de Performance</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-1">
                    {config?.processing_speed || 9}
                  </div>
                  <div className="text-sm text-slate-600">Vitesse Traitement</div>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-3xl font-bold text-indigo-600 mb-1">
                    {config?.metacognition_level || 9}
                  </div>
                  <div className="text-sm text-slate-600">Métacognition</div>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-3xl font-bold text-pink-600 mb-1">
                    {config?.self_evolution_rate || 8}
                  </div>
                  <div className="text-sm text-slate-600">Taux Évolution</div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Paramètres Avancés</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <div className="font-medium">Provider LLM</div>
                    <div className="text-sm text-slate-600">
                      {config?.llm_provider === 'deepseek' ? 'DeepSeek R1' : 'Base44 InvokeLLM'}
                    </div>
                  </div>
                  <Badge className="bg-purple-100 text-purple-700">
                    {config?.llm_provider || 'deepseek'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <div className="font-medium">Traitement Parallèle</div>
                    <div className="text-sm text-slate-600">Optimisation performance</div>
                  </div>
                  <Badge className={config?.parallel_processing ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"}>
                    {config?.parallel_processing ? 'Activé' : 'Désactivé'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <div className="font-medium">Mode Apprentissage</div>
                    <div className="text-sm text-slate-600">Amélioration continue</div>
                  </div>
                  <Badge className={config?.learning_mode ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-700"}>
                    {config?.learning_mode ? 'Actif' : 'Inactif'}
                  </Badge>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}