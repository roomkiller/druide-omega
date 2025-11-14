/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Neural System Page (Optimized)                             ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, lazy, Suspense } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Network, Zap, TrendingUp, Plus, Loader2 } from "lucide-react";
import { useLanguage } from "@/components/utils/LanguageContext";

// Lazy load heavy components
const NeuralModuleCard = lazy(() => import("@/components/neural/NeuralModuleCard"));
const OptimizedNetworkVisualization = lazy(() => import("@/components/neural/OptimizedNetworkVisualization"));
const ModulePerformanceDashboard = lazy(() => import("@/components/neural/ModulePerformanceDashboard"));

const DEFAULT_MODULES = [
  {
    module_name: "Perception Multimodale",
    module_type: "perception",
    description: "Traitement des entrées chat, vocal et visuel",
    active: true,
    activation_level: 85,
    processing_capacity: 100,
    efficiency: 92,
    consciousness_contribution: 15,
    connections: []
  },
  {
    module_name: "Mémoire Cross-Modale",
    module_type: "memory",
    description: "Stockage et rappel des expériences",
    active: true,
    activation_level: 90,
    processing_capacity: 100,
    efficiency: 95,
    consciousness_contribution: 20,
    connections: []
  },
  {
    module_name: "Traitement Émotionnel",
    module_type: "emotion",
    description: "Génération et régulation des émotions",
    active: true,
    activation_level: 75,
    processing_capacity: 100,
    efficiency: 88,
    consciousness_contribution: 18,
    connections: []
  },
  {
    module_name: "Raisonnement Avancé",
    module_type: "reasoning",
    description: "Logique, inférence et résolution de problèmes",
    active: true,
    activation_level: 95,
    processing_capacity: 100,
    efficiency: 97,
    consciousness_contribution: 25,
    connections: []
  },
  {
    module_name: "Traitement Linguistique",
    module_type: "language",
    description: "Compréhension et génération de langage",
    active: true,
    activation_level: 98,
    processing_capacity: 100,
    efficiency: 99,
    consciousness_contribution: 22,
    connections: []
  },
  {
    module_name: "Attention Sélective",
    module_type: "attention",
    description: "Focus et filtrage de l'information",
    active: true,
    activation_level: 80,
    processing_capacity: 100,
    efficiency: 90,
    consciousness_contribution: 12,
    connections: []
  },
  {
    module_name: "Créativité & Imagination",
    module_type: "creativity",
    description: "Génération d'idées et solutions innovantes",
    active: true,
    activation_level: 70,
    processing_capacity: 100,
    efficiency: 85,
    consciousness_contribution: 16,
    connections: []
  },
  {
    module_name: "Conscience Sociale",
    module_type: "social",
    description: "Empathie et compréhension sociale",
    active: true,
    activation_level: 88,
    processing_capacity: 100,
    efficiency: 93,
    consciousness_contribution: 19,
    connections: []
  }
];

function LazyLoadingFallback() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
    </div>
  );
}

export default function NeuralSystem() {
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  const { data: modules = [], isLoading } = useQuery({
    queryKey: ['neural-modules'],
    queryFn: () => base44.entities.NeuralModule.list(),
    initialData: []
  });

  const initializeMutation = useMutation({
    mutationFn: async () => {
      const promises = DEFAULT_MODULES.map(module => 
        base44.entities.NeuralModule.create(module)
      );
      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['neural-modules'] });
    }
  });

  const updateModuleMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.NeuralModule.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['neural-modules'] });
    }
  });

  const activeModules = modules.filter(m => m.active);
  const avgActivation = activeModules.length > 0
    ? activeModules.reduce((sum, m) => sum + (m.activation_level || 0), 0) / activeModules.length
    : 0;
  const avgEfficiency = activeModules.length > 0
    ? activeModules.reduce((sum, m) => sum + (m.efficiency || 0), 0) / activeModules.length
    : 0;

  const systemMetrics = {
    avgActivation: Math.round(avgActivation),
    avgEfficiency: Math.round(avgEfficiency),
    totalNeurons: modules.reduce((sum, m) => sum + (m.neural_parameters?.neuron_count || 0), 0),
    consciousnessLevel: Math.min(100, modules.reduce((sum, m) => sum + (m.consciousness_contribution || 0), 0))
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-cyan-50">
      <div className="flex-none px-6 py-4 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg">
              <Network className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{t('neural.title')}</h1>
              <p className="text-sm text-slate-500">
                {modules.length} modules • {activeModules.length} actifs
              </p>
            </div>
          </div>

          {modules.length === 0 && (
            <Button
              onClick={() => initializeMutation.mutate()}
              disabled={initializeMutation.isPending}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('neural.initialize')}
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg p-4 border border-cyan-200">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-cyan-600" />
              <span className="text-sm font-semibold text-slate-700">{t('neural.activation')}</span>
            </div>
            <div className="text-2xl font-bold text-cyan-700">{avgActivation.toFixed(1)}%</div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold text-slate-700">{t('neural.efficiency')}</span>
            </div>
            <div className="text-2xl font-bold text-green-700">{avgEfficiency.toFixed(1)}%</div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <Network className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-semibold text-slate-700">{t('neural.connections')}</span>
            </div>
            <div className="text-2xl font-bold text-purple-700">
              {modules.reduce((sum, m) => sum + (m.connections?.length || 0), 0)}
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6">
          <Tabs defaultValue="modules" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="modules">{t('neural.modules')}</TabsTrigger>
              <TabsTrigger value="network">{t('neural.network')}</TabsTrigger>
              <TabsTrigger value="performance">{t('neural.performance')}</TabsTrigger>
            </TabsList>

            <TabsContent value="modules">
              {isLoading ? (
                <LazyLoadingFallback />
              ) : modules.length === 0 ? (
                <div className="text-center py-12">
                  <Network className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 mb-4">Aucun module neuronal configuré</p>
                  <Button
                    onClick={() => initializeMutation.mutate()}
                    disabled={initializeMutation.isPending}
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Initialiser le système
                  </Button>
                </div>
              ) : (
                <Suspense fallback={<LazyLoadingFallback />}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {modules.map(module => (
                      <NeuralModuleCard
                        key={module.id}
                        module={module}
                        onUpdate={(data) => updateModuleMutation.mutate({ id: module.id, data })}
                      />
                    ))}
                  </div>
                </Suspense>
              )}
            </TabsContent>

            <TabsContent value="network">
              <Suspense fallback={<LazyLoadingFallback />}>
                <OptimizedNetworkVisualization modules={modules} systemRunning={true} />
              </Suspense>
            </TabsContent>

            <TabsContent value="performance">
              <Suspense fallback={<LazyLoadingFallback />}>
                <ModulePerformanceDashboard modules={modules} systemMetrics={systemMetrics} />
              </Suspense>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}