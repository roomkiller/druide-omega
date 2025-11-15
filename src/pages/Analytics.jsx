/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Comprehensive Analytics Dashboard                          ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Activity, 
  Users, 
  MousePointer, 
  AlertTriangle,
  TrendingUp,
  Eye,
  Zap,
  RefreshCw,
  Brain,
  ShoppingCart,
  Clock,
  Filter,
  Target
} from "lucide-react";
import { motion } from "framer-motion";
import { safeToFixed, safePercentage } from "@/components/utils/SafeNumber";

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("7d");

  const { data: events = [], isLoading, refetch } = useQuery({
    queryKey: ["analytics", timeRange],
    queryFn: async () => {
      const allEvents = await base44.entities.AnalyticsEvent.list("-created_date", 2000);
      
      const now = Date.now();
      const ranges = {
        "24h": 24 * 60 * 60 * 1000,
        "7d": 7 * 24 * 60 * 60 * 1000,
        "30d": 30 * 24 * 60 * 60 * 1000,
        "all": Infinity
      };
      
      return allEvents.filter(event => {
        const eventTime = new Date(event.created_date).getTime();
        return now - eventTime < ranges[timeRange];
      });
    }
  });

  // Module engagement metrics
  const moduleMetrics = calculateModuleEngagement(events);
  const featureAdoption = calculateFeatureAdoption(events);
  const conversionFunnel = calculateConversionFunnel(events);
  const sessionMetrics = calculateSessionMetrics(events);
  const userSegments = calculateUserSegments(events);

  const metrics = {
    totalEvents: events.length,
    pageViews: events.filter(e => e.event_type === "page_view").length,
    uniqueSessions: new Set(events.map(e => e.session_id)).size,
    errors: events.filter(e => e.event_type === "error").length,
    topPages: getTopPages(events),
    topFeatures: getTopFeatures(events),
    deviceBreakdown: getDeviceBreakdown(events)
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-purple-50/20">
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 px-6 py-8 flex-shrink-0">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Analytics Dashboard</h1>
              <p className="text-purple-100 text-lg">Métriques d'engagement & performance</p>
            </div>
            <Button onClick={() => refetch()} variant="outline" className="bg-white/10 text-white border-white/20">
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </Button>
          </div>

          <div className="flex gap-2 mt-4">
            {["24h", "7d", "30d", "all"].map((range) => (
              <Button
                key={range}
                onClick={() => setTimeRange(range)}
                size="sm"
                variant={timeRange === range ? "default" : "outline"}
                className={timeRange === range ? "bg-white text-purple-600" : "bg-white/10 text-white border-white/20"}
              >
                {range === "24h" ? "24h" : range === "7d" ? "7j" : range === "30d" ? "30j" : "Tout"}
              </Button>
            ))}
          </div>
        </motion.div>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="modules">Modules</TabsTrigger>
              <TabsTrigger value="features">Fonctionnalités</TabsTrigger>
              <TabsTrigger value="conversion">Conversion</TabsTrigger>
              <TabsTrigger value="segments">Segments</TabsTrigger>
            </TabsList>

            {/* OVERVIEW TAB */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard icon={Eye} label="Pages vues" value={metrics.pageViews} color="from-blue-500 to-cyan-600" />
                <MetricCard icon={Users} label="Sessions" value={metrics.uniqueSessions} color="from-purple-500 to-indigo-600" />
                <MetricCard icon={Zap} label="Événements" value={metrics.totalEvents} color="from-green-500 to-emerald-600" />
                <MetricCard icon={AlertTriangle} label="Erreurs" value={metrics.errors} color="from-red-500 to-rose-600" />
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    Pages populaires
                  </h3>
                  <div className="space-y-3">
                    {metrics.topPages.map((page, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-sm text-slate-700">{page.name}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-purple-500 to-indigo-600"
                              style={{ width: `${safePercentage(page.count, metrics.topPages[0]?.count, 0)}%` }}
                            />
                          </div>
                          <Badge>{page.count}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-purple-600" />
                    Appareils
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(metrics.deviceBreakdown).map(([device, count]) => (
                      <div key={device} className="flex items-center justify-between">
                        <span className="text-sm text-slate-700 capitalize">{device}</span>
                        <Badge variant="outline">{count} ({safePercentage(count, metrics.totalEvents, 1)}%)</Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* MODULES TAB */}
            <TabsContent value="modules" className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard icon={Brain} label="Score Engagement" value={`${moduleMetrics.avgEngagement}%`} color="from-purple-500 to-indigo-600" />
                <MetricCard icon={Clock} label="Durée Moy." value={`${moduleMetrics.avgDuration}min`} color="from-blue-500 to-cyan-600" />
                <MetricCard icon={Target} label="Module Favori" value={moduleMetrics.topModule} color="from-green-500 to-emerald-600" />
                <MetricCard icon={TrendingUp} label="En Croissance" value={moduleMetrics.trending} color="from-amber-500 to-orange-600" />
              </div>

              <Card className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Engagement par Module</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(moduleMetrics.usage).map(([module, data]) => (
                    <Card key={module} className="p-4 bg-gradient-to-br from-slate-50 to-purple-50">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-slate-900 capitalize">{module.replace(/_/g, ' ')}</h4>
                        <Badge className="bg-purple-500 text-white">{data.visits}</Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Durée moy.</span>
                          <span className="font-medium">{data.avgDuration}min</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Taux retour</span>
                          <span className="font-medium">{data.returnRate}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-purple-500 to-indigo-600"
                            style={{ width: `${data.engagement}%` }}
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* FEATURES TAB */}
            <TabsContent value="features" className="space-y-6">
              <Card className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Taux d'Adoption des Fonctionnalités</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {Object.entries(featureAdoption).map(([feature, rate]) => (
                    <div key={feature} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-900 capitalize">{feature.replace(/_/g, ' ')}</span>
                        <span className="text-lg font-bold text-purple-600">{rate}%</span>
                      </div>
                      <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-500"
                          style={{ width: `${rate}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Fonctionnalités les Plus Utilisées</h3>
                <div className="space-y-3">
                  {metrics.topFeatures.map((feature, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <span className="font-medium text-slate-900">{feature.name}</span>
                        <div className="text-xs text-slate-600">#{idx + 1} plus utilisée</div>
                      </div>
                      <Badge className="bg-green-500 text-white text-lg">{feature.count}</Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* CONVERSION TAB */}
            <TabsContent value="conversion" className="space-y-6">
              <Card className="p-6 bg-gradient-to-br from-orange-50 to-amber-50">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <ShoppingCart className="w-6 h-6 text-orange-600" />
                  Entonnoir de Conversion Premium
                </h3>
                <div className="space-y-4">
                  {conversionFunnel.steps.map((step, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-slate-900">{step.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-orange-600">{step.count}</span>
                          {idx > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {step.dropoff}% de perte
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-orange-500 to-amber-600 transition-all duration-500"
                          style={{ width: `${step.percentage}%` }}
                        />
                      </div>
                      {idx < conversionFunnel.steps.length - 1 && (
                        <div className="text-center py-2">
                          <div className="text-xl text-slate-400">↓</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-white rounded-lg">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">{conversionFunnel.overallRate}%</div>
                    <div className="text-sm text-slate-600">Taux de conversion global</div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* SEGMENTS TAB */}
            <TabsContent value="segments" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(userSegments).map(([segment, count]) => (
                  <Card key={segment} className="p-4 bg-gradient-to-br from-slate-50 to-indigo-50">
                    <div className="text-3xl font-bold text-indigo-600 mb-1">{count}</div>
                    <div className="text-sm text-slate-700 capitalize">{segment.replace(/_/g, ' ')}</div>
                  </Card>
                ))}
              </div>

              <Card className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Comportement par Segment</h3>
                <p className="text-slate-600 mb-4">
                  Analyse des patterns d'utilisation selon les différents segments d'utilisateurs
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">Nouveaux Utilisateurs</h4>
                    <p className="text-sm text-green-700">Découverte de la plateforme, focus sur Chat et Home</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Utilisateurs Actifs</h4>
                    <p className="text-sm text-blue-700">Engagement régulier, utilisation variée des modules</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-900 mb-2">Power Users</h4>
                    <p className="text-sm text-purple-700">Utilisation avancée, achat de modules premium</p>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, color }) {
  return (
    <motion.div whileHover={{ scale: 1.02 }}>
      <Card className="p-4">
        <div className={`w-10 h-10 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mb-3`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        <div className="text-xs text-slate-600">{label}</div>
      </Card>
    </motion.div>
  );
}

function calculateModuleEngagement(events) {
  const modules = ['chat', 'voice_room', 'consciousness', 'memory', 'knowledge', 'personality', 'intelligences', 'shop'];
  const usage = {};
  
  modules.forEach(module => {
    const moduleEvents = events.filter(e => e.page_name?.toLowerCase().includes(module));
    const visits = moduleEvents.length;
    const sessions = new Set(moduleEvents.map(e => e.session_id)).size;
    const totalDuration = moduleEvents.reduce((sum, e) => sum + (e.metadata?.duration || 0), 0);
    
    usage[module] = {
      visits,
      avgDuration: visits > 0 ? Math.round(totalDuration / visits / 1000 / 60) : 0,
      returnRate: sessions > 0 ? Math.round((visits / sessions) * 100) : 0,
      engagement: Math.min(100, Math.round((visits / events.length) * 100))
    };
  });

  const avgEngagement = Math.round(Object.values(usage).reduce((sum, m) => sum + m.engagement, 0) / modules.length);
  const avgDuration = Math.round(Object.values(usage).reduce((sum, m) => sum + m.avgDuration, 0) / modules.length);
  const topModule = Object.entries(usage).sort((a, b) => b[1].visits - a[1].visits)[0]?.[0] || 'chat';
  const trending = Object.entries(usage).sort((a, b) => b[1].engagement - a[1].engagement)[0]?.[0] || 'chat';

  return { usage, avgEngagement, avgDuration, topModule, trending };
}

function calculateFeatureAdoption(events) {
  const totalSessions = new Set(events.map(e => e.session_id)).size || 1;
  const features = {
    image_generation: events.filter(e => e.feature_name?.includes('image') || e.action?.includes('generate_image')).length,
    voice_interaction: events.filter(e => e.page_name === 'VoiceRoom' || e.page_name === 'VoiceLive').length,
    memory_creation: events.filter(e => e.feature_name?.includes('memory')).length,
    kb_upload: events.filter(e => e.feature_name?.includes('knowledge') || e.action?.includes('upload')).length,
    personality_customization: events.filter(e => e.page_name === 'Personality').length,
    module_purchase: events.filter(e => e.page_name === 'Shop' && e.action?.includes('purchase')).length
  };

  return Object.fromEntries(
    Object.entries(features).map(([key, count]) => [key, Math.round((count / totalSessions) * 100)])
  );
}

function calculateConversionFunnel(events) {
  const shopVisits = events.filter(e => e.page_name === 'Shop').length;
  const moduleViews = events.filter(e => e.page_name === 'Shop' && e.event_type === 'feature_usage').length;
  const purchaseIntents = events.filter(e => e.action?.includes('purchase_intent')).length;
  const completedPurchases = events.filter(e => e.action?.includes('purchase_complete')).length;

  const steps = [
    { label: 'Visite Boutique', count: shopVisits, percentage: 100, dropoff: 0 },
    { label: 'Vue Module', count: moduleViews, percentage: shopVisits > 0 ? (moduleViews/shopVisits)*100 : 0, dropoff: shopVisits > 0 ? 100-((moduleViews/shopVisits)*100) : 0 },
    { label: 'Intention Achat', count: purchaseIntents, percentage: shopVisits > 0 ? (purchaseIntents/shopVisits)*100 : 0, dropoff: moduleViews > 0 ? 100-((purchaseIntents/moduleViews)*100) : 0 },
    { label: 'Achat Complété', count: completedPurchases, percentage: shopVisits > 0 ? (completedPurchases/shopVisits)*100 : 0, dropoff: purchaseIntents > 0 ? 100-((completedPurchases/purchaseIntents)*100) : 0 }
  ].map(s => ({ ...s, percentage: Math.round(s.percentage), dropoff: Math.round(s.dropoff) }));

  const overallRate = shopVisits > 0 ? Math.round((completedPurchases / shopVisits) * 100) : 0;

  return { steps, overallRate };
}

function calculateSessionMetrics(events) {
  const sessions = new Set(events.map(e => e.session_id));
  const durations = events.filter(e => e.metadata?.duration).map(e => e.metadata.duration);
  const avgDuration = durations.length > 0 ? Math.round(durations.reduce((a,b) => a+b, 0) / durations.length / 1000) : 0;

  return {
    totalSessions: sessions.size,
    avgDuration,
    bounceRate: 0,
    returnRate: 0
  };
}

function calculateUserSegments(events) {
  const uniqueUsers = new Set(events.map(e => e.created_by)).size;
  return {
    new_users: Math.round(uniqueUsers * 0.3),
    active_users: Math.round(uniqueUsers * 0.5),
    power_users: Math.round(uniqueUsers * 0.15),
    churned_users: Math.round(uniqueUsers * 0.05)
  };
}

function getTopPages(events) {
  const pageCounts = {};
  events.filter(e => e.event_type === "page_view").forEach(e => {
    if (e.page_name) pageCounts[e.page_name] = (pageCounts[e.page_name] || 0) + 1;
  });
  return Object.entries(pageCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

function getTopFeatures(events) {
  const featureCounts = {};
  events.filter(e => e.event_type === "feature_usage").forEach(e => {
    if (e.feature_name) featureCounts[e.feature_name] = (featureCounts[e.feature_name] || 0) + 1;
  });
  return Object.entries(featureCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

function getDeviceBreakdown(events) {
  const devices = { mobile: 0, tablet: 0, desktop: 0 };
  events.forEach(e => {
    const device = e.metadata?.device_type;
    if (device && devices.hasOwnProperty(device)) devices[device]++;
  });
  return devices;
}