/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Real-time Alerts Panel                                     ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, AlertTriangle, Info, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/utils/LanguageContext";

export default function AlertsPanel() {
  const { language } = useLanguage();
  const queryClient = useQueryClient();

  const { data: alerts = [] } = useQuery({
    queryKey: ['alerts'],
    queryFn: () => base44.entities.Alert.list('-triggered_at', 20),
    refetchInterval: 15000 // 15s
  });

  const resolveMutation = useMutation({
    mutationFn: (alertId) => base44.entities.Alert.update(alertId, {
      resolved: true,
      resolved_at: new Date().toISOString()
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    }
  });

  const severityConfig = {
    info: { color: "bg-blue-100 text-blue-700", icon: Info },
    warning: { color: "bg-yellow-100 text-yellow-700", icon: AlertTriangle },
    critical: { color: "bg-red-100 text-red-700", icon: AlertTriangle }
  };

  const activeAlerts = alerts.filter(a => !a.resolved);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6 text-purple-600" />
          <div>
            <h3 className="font-bold text-lg">
              {language === 'en' ? 'Active Alerts' : 'Alertes Actives'}
            </h3>
            <p className="text-sm text-slate-600">
              {activeAlerts.length} {language === 'en' ? 'alert' : 'alerte'}{activeAlerts.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {alerts.slice(0, 5).map((alert, idx) => {
          const SeverityIcon = severityConfig[alert.severity]?.icon || Info;

          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className={`p-4 ${alert.resolved ? 'opacity-50' : ''}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${severityConfig[alert.severity]?.color}`}>
                      <SeverityIcon className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{alert.title}</span>
                        {alert.resolved && (
                          <Badge className="bg-green-500 text-white">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            {language === 'en' ? 'Resolved' : 'Résolu'}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mb-2">{alert.description}</p>
                      <div className="text-xs text-slate-500">
                        {new Date(alert.triggered_at).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {!alert.resolved && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => resolveMutation.mutate(alert.id)}
                    >
                      {language === 'en' ? 'Resolve' : 'Résoudre'}
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}

        {alerts.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <Bell className="w-12 h-12 mx-auto mb-2 text-slate-300" />
            <p>{language === 'en' ? 'No alerts' : 'Aucune alerte'}</p>
          </div>
        )}
      </div>
    </Card>
  );
}