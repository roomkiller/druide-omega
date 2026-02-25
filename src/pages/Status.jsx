/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Public Status Page                                         ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, CheckCircle, AlertCircle, Clock, ArrowLeft } from "lucide-react";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/utils/LanguageContext";

const SERVICES_FR = [
  { name: "API", key: "api" },
  { name: "Base de données", key: "database" },
  { name: "Intégrations LLM", key: "llm" },
  { name: "Stockage fichiers", key: "storage" },
  { name: "Notifications", key: "notifications" }
];
const SERVICES_EN = [
  { name: "API", key: "api" },
  { name: "Database", key: "database" },
  { name: "LLM Integrations", key: "llm" },
  { name: "File Storage", key: "storage" },
  { name: "Notifications", key: "notifications" }
];

export default function Status() {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const { data: health, isLoading } = useQuery({
    queryKey: ['systemHealth'],
    queryFn: async () => {
      try {
        const response = await base44.functions.invoke('healthCheck');
        return response.data;
      } catch (e) {
        return { status: 'unhealthy' };
      }
    },
    refetchInterval: 30000 // 30s
  });

  const getStatusColor = (status) => {
    if (status === 'healthy' || status === 'up') return 'text-green-500 bg-green-100';
    if (status === 'degraded') return 'text-yellow-500 bg-yellow-100';
    return 'text-red-500 bg-red-100';
  };

  const getStatusIcon = (status) => {
    if (status === 'healthy' || status === 'up') return <CheckCircle className="w-5 h-5" />;
    if (status === 'degraded') return <AlertCircle className="w-5 h-5" />;
    return <AlertCircle className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-green-50/30 dark:from-slate-900 dark:via-blue-900/20 dark:to-green-900/20">
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <Button
            onClick={() => window.location.href = createPageUrl('ArchitectDashboard')}
            variant="ghost"
            size="sm"
            className="mb-4 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {isEn ? 'Back' : 'Retour Dashboard'}
          </Button>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">{isEn ? 'System Status' : 'Statut Système'}</h1>
              <p className="text-green-100">{isEn ? 'Druide Omega - Real-time monitoring' : 'Druide Omega - Monitoring en temps réel'}</p>
            </div>
          </div>

          {!isLoading && (
            <div className="mt-6">
              <Badge className={`text-lg px-4 py-2 ${getStatusColor(health?.status)}`}>
                {getStatusIcon(health?.status)}
                <span className="ml-2">
                  {health?.status === 'healthy' ? (isEn ? 'All systems operational' : 'Tous les systèmes opérationnels') : (isEn ? 'Issues detected' : 'Problèmes détectés')}
                </span>
              </Badge>
            </div>
          )}
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-300px)]">
        <div className="max-w-4xl mx-auto px-6 py-12 space-y-6">
          <Card className="p-6 dark:bg-slate-800 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{isEn ? 'Services Status' : 'État des services'}</h2>
            
            <div className="space-y-4">
              {SERVICES.map((service) => {
                const status = health?.checks?.[service.key]?.status || 'unknown';
                return (
                  <div key={service.key} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(status)}
                      <span className="font-semibold text-slate-900 dark:text-white">{service.name}</span>
                    </div>
                    <Badge className={getStatusColor(status)}>
                      {status === 'up' ? (isEn ? 'Operational' : 'Opérationnel') : status === 'degraded' ? (isEn ? 'Degraded' : 'Dégradé') : (isEn ? 'Offline' : 'Hors ligne')}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-6 dark:bg-slate-800 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{isEn ? 'System Metrics' : 'Métriques système'}</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-600 dark:text-slate-400">{isEn ? 'Response time' : 'Temps de réponse'}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {health?.response_time_ms || 0}ms
                </p>
              </div>
              
              <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-600 dark:text-slate-400">{isEn ? 'Memory used' : 'Mémoire utilisée'}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {health?.checks?.memory?.heapUsed || 'N/A'}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-bold text-blue-900 dark:text-blue-100">{isEn ? 'Last update' : 'Dernière mise à jour'}</h3>
            </div>
            <p className="text-blue-700 dark:text-blue-300 text-sm">
              {new Date().toLocaleString('fr-CA')}
            </p>
          </Card>

          <div className="text-center text-sm text-slate-500 dark:text-slate-400">
            <p>{isEn ? 'Auto-refresh every 30 seconds' : 'Mise à jour automatique toutes les 30 secondes'}</p>
            <p className="mt-2">Support: support@druideomega.com</p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}