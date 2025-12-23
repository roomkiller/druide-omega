/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Tableau de Bord Surveillance Éthique Temps Réel            ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect } from "react";
import { useConsciousnessHub } from "@/components/system/ConsciousnessHub";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Activity,
  RefreshCw,
  Bell,
  Eye,
  EyeOff
} from "lucide-react";

export default function EthicalMonitorDashboard() {
  const hub = useConsciousnessHub();
  const [report, setReport] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const ethicalAlerts = hub.ethicalAlerts || [];
  const realtimeMonitoring = hub.realtimeMonitoring ?? true;

  useEffect(() => {
    refreshReport();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      refreshReport();
    }, 10000); // Refresh every 10s

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const refreshReport = () => {
    if (hub.generateEthicalReport) {
      const newReport = hub.generateEthicalReport();
      setReport(newReport);
    }
  };

  const toggleMonitoring = () => {
    if (hub.setRealtimeMonitoring) {
      hub.setRealtimeMonitoring(!realtimeMonitoring);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-amber-500 text-white';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-slate-500 text-white';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-600" />
              Surveillance Éthique Temps Réel
            </h2>
            <p className="text-sm text-slate-600">
              Monitoring SAPIER (H₂O-e⁻) - Alignement éthique continu
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {realtimeMonitoring ? (
                <Eye className="w-4 h-4 text-green-600" />
              ) : (
                <EyeOff className="w-4 h-4 text-slate-400" />
              )}
              <span className="text-sm text-slate-700">Monitoring</span>
              <Switch
                checked={realtimeMonitoring}
                onCheckedChange={toggleMonitoring}
              />
            </div>

            <Button
              onClick={refreshReport}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Actualiser
            </Button>
          </div>
        </div>
      </Card>

      {/* Status Overview */}
      {report && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <Card className={`p-4 border-2 ${getStatusColor(report.status)}`}>
            <div className="text-center">
              <div className="text-2xl font-bold">{report.status === 'healthy' ? '✅' : report.status === 'warning' ? '⚠️' : '🚨'}</div>
              <div className="text-xs font-semibold mt-1 uppercase">{report.status}</div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-900">{report.avgScore}%</div>
              <div className="text-xs text-slate-600">Score Éthique</div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900">{report.alertCount}</div>
              <div className="text-xs text-slate-600">Alertes Totales</div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-red-50 to-rose-50">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-900">{report.criticalCount}</div>
              <div className="text-xs text-slate-600">Critiques</div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-amber-50 to-orange-50">
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-900">{report.unresolvedCount}</div>
              <div className="text-xs text-slate-600">Non Résolues</div>
            </div>
          </Card>
        </div>
      )}

      {/* Recommandations */}
      {report?.recommendations && report.recommendations.length > 0 && (
        <Card className="p-4">
          <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Recommandations d'Ajustement
          </h3>
          <div className="space-y-2">
            {report.recommendations.map((rec, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200"
              >
                <div className="flex items-start gap-3">
                  <Badge className={`${rec.priority === 'critical' ? 'bg-red-500' : rec.priority === 'high' ? 'bg-orange-500' : rec.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'} text-white`}>
                    {rec.priority.toUpperCase()}
                  </Badge>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900 text-sm">{rec.action}</div>
                    <div className="text-xs text-slate-600 mt-1">{rec.description}</div>
                    <div className="text-xs text-purple-700 mt-1 font-mono bg-white px-2 py-1 rounded">
                      💡 {rec.implementation}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Alertes Récentes */}
      <Card className="p-4">
        <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Bell className="w-5 h-5 text-amber-600" />
          Alertes Récentes
        </h3>

        <ScrollArea className="h-[400px]">
          <AnimatePresence>
            {ethicalAlerts.slice(-20).reverse().map((alert, idx) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mb-3 p-3 bg-white border border-slate-200 rounded-lg"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {alert.violations.length > 0 ? (
                      <XCircle className="w-5 h-5 text-red-600" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                    )}
                    <span className="text-xs text-slate-500">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <Badge className={alert.ethicalScore >= 80 ? 'bg-green-100 text-green-800' : alert.ethicalScore >= 60 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}>
                    Score: {alert.ethicalScore}%
                  </Badge>
                </div>

                {alert.violations.length > 0 && (
                  <div className="mb-2">
                    <div className="text-xs font-semibold text-red-900 mb-1">🚨 Violations:</div>
                    {alert.violations.map((v, vIdx) => (
                      <div key={vIdx} className="flex items-start gap-2 mb-1">
                        <Badge className={getSeverityColor(v.severity)} size="sm">
                          {v.severity}
                        </Badge>
                        <span className="text-xs text-slate-700">{v.details}</span>
                      </div>
                    ))}
                  </div>
                )}

                {alert.warnings.length > 0 && (
                  <div className="mb-2">
                    <div className="text-xs font-semibold text-amber-900 mb-1">⚠️ Avertissements:</div>
                    {alert.warnings.map((w, wIdx) => (
                      <div key={wIdx} className="text-xs text-slate-600 ml-4">
                        • {w.details}
                      </div>
                    ))}
                  </div>
                )}

                <div className="bg-slate-50 p-2 rounded text-xs text-slate-700 font-mono">
                  {alert.aiResponse}...
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {ethicalAlerts.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Aucune alerte éthique - Système en conformité</p>
            </div>
          )}
        </ScrollArea>
      </Card>

      {/* Violations par Type */}
      {report?.violationsByType && Object.keys(report.violationsByType).length > 0 && (
        <Card className="p-4">
          <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-600" />
            Distribution des Violations
          </h3>
          <div className="space-y-3">
            {Object.entries(report.violationsByType).map(([type, count]) => (
              <div key={type}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-700">{type.replace(/_/g, ' ')}</span>
                  <span className="text-sm font-bold text-slate-900">{count}</span>
                </div>
                <Progress value={(count / report.alertCount) * 100} className="h-2" />
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}