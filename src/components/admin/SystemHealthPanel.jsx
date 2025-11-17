/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - System Health Panel                                        ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Activity, Database, Zap, Globe, Server, Cpu, HardDrive, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function SystemHealthPanel() {
  const { data: metrics = [] } = useQuery({
    queryKey: ['systemMetrics'],
    queryFn: () => base44.asServiceRole.entities.SystemMetrics.list('-timestamp', 100),
    refetchInterval: 10000,
    initialData: [],
  });

  const { data: errors = [] } = useQuery({
    queryKey: ['errorLogs'],
    queryFn: () => base44.asServiceRole.entities.ErrorLog.list('-created_date', 50),
    initialData: [],
  });

  const { data: alerts = [] } = useQuery({
    queryKey: ['alerts'],
    queryFn: () => base44.asServiceRole.entities.Alert.list('-triggered_at', 20),
    initialData: [],
  });

  // Calcul du score de santé global
  const calculateHealthScore = () => {
    const activeAlerts = alerts.filter(a => !a.resolved && a.severity === 'critical').length;
    const criticalErrors = errors.filter(e => e.severity === 'critical' && !e.resolved).length;
    const recentErrors = errors.filter(e => {
      const hourAgo = new Date(Date.now() - 3600000);
      return new Date(e.created_date) > hourAgo;
    }).length;

    let score = 100;
    score -= activeAlerts * 20;
    score -= criticalErrors * 15;
    score -= recentErrors * 2;
    
    return Math.max(0, score);
  };

  const healthScore = calculateHealthScore();

  const getHealthStatus = (score) => {
    if (score >= 90) return { label: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle };
    if (score >= 70) return { label: 'Bon', color: 'text-blue-600', bgColor: 'bg-blue-100', icon: Activity };
    if (score >= 50) return { label: 'Moyen', color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: AlertTriangle };
    return { label: 'Critique', color: 'text-red-600', bgColor: 'bg-red-100', icon: XCircle };
  };

  const status = getHealthStatus(healthScore);
  const StatusIcon = status.icon;

  // Métriques système
  const latestPerformance = metrics.filter(m => m.metric_type === 'performance').slice(-10);
  const avgPerformance = latestPerformance.length > 0 
    ? latestPerformance.reduce((sum, m) => sum + m.value, 0) / latestPerformance.length 
    : 0;

  const latestApi = metrics.filter(m => m.metric_type === 'api').slice(-10);
  const avgApiRequests = latestApi.length > 0 
    ? latestApi.reduce((sum, m) => sum + m.value, 0) / latestApi.length 
    : 0;

  const systemStats = [
    {
      title: "Performance Moyenne",
      value: `${avgPerformance.toFixed(0)}ms`,
      icon: Zap,
      color: "from-yellow-500 to-orange-600",
      status: avgPerformance < 100 ? 'good' : avgPerformance < 300 ? 'medium' : 'poor'
    },
    {
      title: "Requêtes API/min",
      value: avgApiRequests.toFixed(0),
      icon: Globe,
      color: "from-blue-500 to-cyan-600",
      status: 'good'
    },
    {
      title: "Erreurs Critiques",
      value: errors.filter(e => e.severity === 'critical' && !e.resolved).length,
      icon: AlertTriangle,
      color: "from-red-500 to-pink-600",
      status: errors.filter(e => e.severity === 'critical' && !e.resolved).length === 0 ? 'good' : 'poor'
    },
    {
      title: "Alertes Actives",
      value: alerts.filter(a => !a.resolved).length,
      icon: Activity,
      color: "from-purple-500 to-indigo-600",
      status: alerts.filter(a => !a.resolved).length === 0 ? 'good' : 'medium'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Score de santé global */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold mb-2">État du Système</h3>
            <p className="text-slate-600">Score de santé global</p>
          </div>
          <div className={`flex items-center gap-3 ${status.bgColor} px-4 py-2 rounded-lg`}>
            <StatusIcon className={`w-6 h-6 ${status.color}`} />
            <span className={`text-xl font-bold ${status.color}`}>{status.label}</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-600">Score global</span>
            <span className="font-bold text-slate-900">{healthScore}/100</span>
          </div>
          <Progress value={healthScore} className="h-3" />
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-slate-900">
              {alerts.filter(a => !a.resolved).length}
            </div>
            <div className="text-xs text-slate-600">Alertes actives</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">
              {errors.filter(e => !e.resolved).length}
            </div>
            <div className="text-xs text-slate-600">Erreurs non résolues</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">
              {metrics.length}
            </div>
            <div className="text-xs text-slate-600">Métriques collectées</div>
          </div>
        </div>
      </Card>

      {/* Statistiques système */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {systemStats.map((stat, idx) => {
          const Icon = stat.icon;
          const statusDot = stat.status === 'good' ? 'bg-green-500' : stat.status === 'medium' ? 'bg-yellow-500' : 'bg-red-500';

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="p-4 hover:shadow-lg transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className={`w-2 h-2 rounded-full ${statusDot}`} />
                </div>
                <div className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-600">{stat.title}</div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Services status */}
      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4">Statut des Services</h3>
        <div className="space-y-3">
          {[
            { name: "Base de données", status: "operational", icon: Database },
            { name: "API Gateway", status: "operational", icon: Server },
            { name: "Moteur IA", status: "operational", icon: Cpu },
            { name: "Stockage", status: "operational", icon: HardDrive }
          ].map((service, idx) => {
            const Icon = service.icon;
            return (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-slate-600" />
                  <span className="font-medium text-slate-900">{service.name}</span>
                </div>
                <Badge className="bg-green-500 text-white">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Opérationnel
                </Badge>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}