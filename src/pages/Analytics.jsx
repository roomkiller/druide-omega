/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Analytics Dashboard (Admin Only)                           ║
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
import { 
  BarChart, 
  Activity, 
  Users, 
  MousePointer, 
  AlertTriangle,
  TrendingUp,
  Eye,
  Zap,
  RefreshCw
} from "lucide-react";
import { motion } from "framer-motion";

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("24h");

  const { data: events = [], isLoading, refetch } = useQuery({
    queryKey: ["analytics", timeRange],
    queryFn: async () => {
      const allEvents = await base44.entities.AnalyticsEvent.list("-created_date", 1000);
      
      // Filter by time range
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

  // Calculate metrics with safe defaults - FIXED ALL .toFixed() calls
  const errorCount = events.filter(e => e.event_type === "error").length;
  const errorRateRaw = events.length > 0 ? (errorCount / events.length) * 100 : 0;
  const safeErrorRate = (typeof errorRateRaw === 'number' && !isNaN(errorRateRaw) && errorRateRaw !== null && errorRateRaw !== undefined) ? errorRateRaw : 0;
  
  const metrics = {
    totalEvents: events.length,
    pageViews: events.filter(e => e.event_type === "page_view").length,
    uniqueSessions: new Set(events.map(e => e.session_id)).size,
    errors: errorCount,
    avgSessionDuration: calculateAvgDuration(events),
    topPages: getTopPages(events),
    topFeatures: getTopFeatures(events),
    deviceBreakdown: getDeviceBreakdown(events),
    errorRate: safeErrorRate.toFixed(2)
  };

  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-slate-50 to-purple-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                Analytics Dashboard
              </h1>
              <p className="text-sm text-slate-600">
                Métriques de performance et comportement utilisateur
              </p>
            </div>
            <Button onClick={() => refetch()} size="sm" variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </Button>
          </div>

          {/* Time Range Selector */}
          <div className="flex gap-2">
            {["24h", "7d", "30d", "all"].map((range) => (
              <Button
                key={range}
                onClick={() => setTimeRange(range)}
                size="sm"
                variant={timeRange === range ? "default" : "outline"}
              >
                {range === "24h" ? "24 heures" : range === "7d" ? "7 jours" : range === "30d" ? "30 jours" : "Tout"}
              </Button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            icon={Eye}
            label="Pages vues"
            value={metrics.pageViews}
            color="from-blue-500 to-cyan-600"
          />
          <MetricCard
            icon={Users}
            label="Sessions uniques"
            value={metrics.uniqueSessions}
            color="from-purple-500 to-indigo-600"
          />
          <MetricCard
            icon={Zap}
            label="Événements"
            value={metrics.totalEvents}
            color="from-green-500 to-emerald-600"
          />
          <MetricCard
            icon={AlertTriangle}
            label="Taux d'erreur"
            value={`${metrics.errorRate}%`}
            color="from-red-500 to-rose-600"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Top Pages */}
          <Card className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              Pages les plus visitées
            </h3>
            <div className="space-y-3">
              {metrics.topPages.length > 0 ? (
                metrics.topPages.map((page, idx) => {
                  const percentage = metrics.topPages[0]?.count > 0 
                    ? ((page.count / metrics.topPages[0].count) * 100) 
                    : 0;
                  
                  return (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-sm text-slate-700">{page.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-purple-500 to-indigo-600"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <Badge variant="secondary">{page.count}</Badge>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-slate-500 text-center py-4">Aucune donnée disponible</p>
              )}
            </div>
          </Card>

          {/* Top Features */}
          <Card className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <MousePointer className="w-5 h-5 text-purple-600" />
              Features les plus utilisées
            </h3>
            <div className="space-y-3">
              {metrics.topFeatures.length > 0 ? (
                metrics.topFeatures.map((feature, idx) => {
                  const percentage = metrics.topFeatures[0]?.count > 0
                    ? ((feature.count / metrics.topFeatures[0].count) * 100)
                    : 0;
                  
                  return (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-sm text-slate-700">{feature.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-600"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <Badge variant="secondary">{feature.count}</Badge>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-slate-500 text-center py-4">Aucune donnée disponible</p>
              )}
            </div>
          </Card>
        </div>

        {/* Device Breakdown & Errors */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Device Breakdown */}
          <Card className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-600" />
              Répartition par appareil
            </h3>
            <div className="space-y-3">
              {Object.entries(metrics.deviceBreakdown).map(([device, count]) => {
                const percentageRaw = metrics.totalEvents > 0 ? (count / metrics.totalEvents) * 100 : 0;
                const safePercentage = (typeof percentageRaw === 'number' && !isNaN(percentageRaw) && percentageRaw !== null && percentageRaw !== undefined) ? percentageRaw : 0;
                const percentage = safePercentage.toFixed(1);
                
                return (
                  <div key={device} className="flex items-center justify-between">
                    <span className="text-sm text-slate-700 capitalize">{device}</span>
                    <Badge variant="outline">
                      {count} ({percentage}%)
                    </Badge>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Recent Errors */}
          <Card className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Erreurs récentes
            </h3>
            <ScrollArea className="h-48">
              <div className="space-y-2">
                {events.filter(e => e.event_type === "error").slice(0, 10).map((error, idx) => (
                  <div key={idx} className="p-2 bg-red-50 rounded-lg">
                    <div className="text-xs font-medium text-red-900">{error.page_name}</div>
                    <div className="text-xs text-red-700 truncate">{error.metadata?.error_message}</div>
                    <div className="text-xs text-red-600 mt-1">
                      {new Date(error.created_date).toLocaleString("fr-FR")}
                    </div>
                  </div>
                ))}
                {events.filter(e => e.event_type === "error").length === 0 && (
                  <p className="text-sm text-slate-500 text-center py-4">Aucune erreur récente</p>
                )}
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>
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

function getTopPages(events) {
  const pageCounts = {};
  events.filter(e => e.event_type === "page_view").forEach(e => {
    if (e.page_name) {
      pageCounts[e.page_name] = (pageCounts[e.page_name] || 0) + 1;
    }
  });
  return Object.entries(pageCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

function getTopFeatures(events) {
  const featureCounts = {};
  events.filter(e => e.event_type === "feature_usage").forEach(e => {
    if (e.feature_name) {
      featureCounts[e.feature_name] = (featureCounts[e.feature_name] || 0) + 1;
    }
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
    if (device && devices.hasOwnProperty(device)) {
      devices[device]++;
    }
  });
  return devices;
}

function calculateAvgDuration(events) {
  const durations = events
    .filter(e => e.metadata?.duration)
    .map(e => e.metadata.duration);
  
  if (durations.length === 0) return 0;
  return Math.round(durations.reduce((a, b) => a + b, 0) / durations.length / 1000);
}