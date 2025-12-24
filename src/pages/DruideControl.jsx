/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Control Center (Advanced Dashboard)                        ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect } from "react";
import { useConsciousnessHub } from "@/components/system/ConsciousnessHub";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import ModuleStatusPanel from "@/components/dashboard/ModuleStatusPanel";
import EthicalAlertsPanel from "@/components/dashboard/EthicalAlertsPanel";
import TestMetricsChart from "@/components/dashboard/TestMetricsChart";
import ConsciousnessAdjuster from "@/components/dashboard/ConsciousnessAdjuster";
import { 
  Activity, 
  Brain, 
  AlertTriangle, 
  BarChart3, 
  Settings,
  Zap
} from "lucide-react";

export default function DruideControl() {
  const hub = useConsciousnessHub();
  const queryClient = useQueryClient();

  const { data: config } = useQuery({
    queryKey: ['consciousnessConfig'],
    queryFn: async () => {
      const configs = await base44.entities.ConsciousnessConfig.list();
      return configs[0] || null;
    }
  });

  const { data: learningData = [] } = useQuery({
    queryKey: ['consciousnessLearning'],
    queryFn: () => base44.entities.ConsciousnessLearning.list('-created_date', 100)
  });

  const { data: feedbackData = [] } = useQuery({
    queryKey: ['userFeedback'],
    queryFn: () => base44.entities.UserFeedback.list('-created_date', 100)
  });

  const activeModules = hub.activeModules || [];
  const ethicalAlerts = hub.ethicalAlerts || [];
  const adaptiveLearning = hub.adaptiveLearning || { adjustments: 0, history: [] };
  const ethicalDrift = hub.ethicalDrift || { alignment: 100, violations: [] };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-purple-50/20 to-blue-50/20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 page-padding py-6 flex-shrink-0 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center">
                <Activity className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Centre de Contrôle Druide Omega</h1>
                <p className="text-purple-100 text-sm">Surveillance et ajustements en temps réel</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-white/20 backdrop-blur-xl text-white px-3 py-2">
                <Zap className="w-4 h-4 mr-1" />
                {activeModules.length} modules actifs
              </Badge>
              <Badge className={`backdrop-blur-xl px-3 py-2 ${
                ethicalDrift.alignment >= 90 
                  ? 'bg-green-500/80 text-white' 
                  : ethicalDrift.alignment >= 75 
                    ? 'bg-yellow-500/80 text-white' 
                    : 'bg-red-500/80 text-white'
              }`}>
                Éthique: {ethicalDrift.alignment}%
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="max-w-7xl mx-auto page-padding page-padding-y">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="overview" className="gap-2">
                <Activity className="w-4 h-4" />
                Vue d'ensemble
              </TabsTrigger>
              <TabsTrigger value="modules" className="gap-2">
                <Brain className="w-4 h-4" />
                Modules
              </TabsTrigger>
              <TabsTrigger value="ethics" className="gap-2">
                <AlertTriangle className="w-4 h-4" />
                Alertes Éthiques
              </TabsTrigger>
              <TabsTrigger value="tests" className="gap-2">
                <BarChart3 className="w-4 h-4" />
                Métriques Tests
              </TabsTrigger>
              <TabsTrigger value="adjust" className="gap-2">
                <Settings className="w-4 h-4" />
                Ajustements
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-6">
                  <div className="text-sm text-slate-600 mb-1">Niveau Conscience</div>
                  <div className="text-3xl font-bold text-purple-600">
                    {config?.consciousness_level ?? 12}/15
                  </div>
                </Card>
                <Card className="p-6">
                  <div className="text-sm text-slate-600 mb-1">Ratio Logic:Conscience</div>
                  <div className="text-3xl font-bold text-indigo-600">
                    {config?.ratio_logic ?? 4}:{config?.ratio_consciousness ?? 6}
                  </div>
                </Card>
                <Card className="p-6">
                  <div className="text-sm text-slate-600 mb-1">Profondeur Émotionnelle</div>
                  <div className="text-3xl font-bold text-pink-600">
                    {config?.emotional_depth ?? 10}/10
                  </div>
                </Card>
                <Card className="p-6">
                  <div className="text-sm text-slate-600 mb-1">Ajustements Appliqués</div>
                  <div className="text-3xl font-bold text-emerald-600">
                    {adaptiveLearning.adjustments}
                  </div>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ModuleStatusPanel modules={activeModules} moduleStates={hub.moduleStates} />
                <EthicalAlertsPanel 
                  alerts={ethicalAlerts.slice(-10)} 
                  drift={ethicalDrift}
                  realtimeMonitoring={hub.realtimeMonitoring}
                  onToggleMonitoring={() => hub.setRealtimeMonitoring?.(!hub.realtimeMonitoring)}
                />
              </div>
            </TabsContent>

            <TabsContent value="modules">
              <ModuleStatusPanel 
                modules={activeModules} 
                moduleStates={hub.moduleStates}
                detailed
              />
            </TabsContent>

            <TabsContent value="ethics">
              <EthicalAlertsPanel 
                alerts={ethicalAlerts} 
                drift={ethicalDrift}
                realtimeMonitoring={hub.realtimeMonitoring}
                onToggleMonitoring={() => hub.setRealtimeMonitoring?.(!hub.realtimeMonitoring)}
                detailed
              />
            </TabsContent>

            <TabsContent value="tests">
              <TestMetricsChart 
                learningData={learningData}
                feedbackData={feedbackData}
              />
            </TabsContent>

            <TabsContent value="adjust">
              <ConsciousnessAdjuster 
                config={config}
                onUpdate={() => queryClient.invalidateQueries({ queryKey: ['consciousnessConfig'] })}
              />
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}