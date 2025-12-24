import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { AlertTriangle, Shield, TrendingUp, TrendingDown, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

export default function EthicalAlertsPanel({ 
  alerts = [], 
  drift = {}, 
  realtimeMonitoring = true,
  onToggleMonitoring,
  detailed = false 
}) {
  const recentAlerts = detailed ? alerts : alerts.slice(-5);
  const alignment = drift.alignment ?? 100;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-slate-900">Surveillance Éthique</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-600">Temps réel</span>
          <Switch 
            checked={realtimeMonitoring}
            onCheckedChange={onToggleMonitoring}
          />
        </div>
      </div>

      {/* Alignement Score */}
      <div className={`p-4 rounded-lg mb-4 ${
        alignment >= 90 ? 'bg-green-50 border border-green-200' :
        alignment >= 75 ? 'bg-yellow-50 border border-yellow-200' :
        'bg-red-50 border border-red-200'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-600">Alignement SAPIER</div>
            <div className="text-2xl font-bold text-slate-900">{alignment}%</div>
          </div>
          {alignment >= 95 ? (
            <TrendingUp className="w-8 h-8 text-green-600" />
          ) : alignment >= 85 ? (
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          ) : (
            <TrendingDown className="w-8 h-8 text-red-600" />
          )}
        </div>
      </div>

      {/* Alertes */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700">
            Alertes récentes
          </span>
          <Badge variant="outline">{recentAlerts.length}</Badge>
        </div>

        {recentAlerts.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">
            <Shield className="w-8 h-8 mx-auto mb-2 text-green-500" />
            Aucune alerte éthique
          </div>
        ) : (
          recentAlerts.map((alert, idx) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`p-3 rounded-lg border ${
                alert.violations.length > 0 
                  ? 'bg-red-50 border-red-200' 
                  : 'bg-yellow-50 border-yellow-200'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`w-4 h-4 ${
                    alert.violations.length > 0 ? 'text-red-600' : 'text-yellow-600'
                  }`} />
                  <span className="text-xs font-medium text-slate-700">
                    {new Date(alert.timestamp).toLocaleString('fr-FR')}
                  </span>
                </div>
                <Badge className={
                  alert.violations.length > 0 ? 'bg-red-500' : 'bg-yellow-500'
                }>
                  Score: {alert.ethicalScore}
                </Badge>
              </div>

              {detailed && (
                <>
                  <div className="text-xs text-slate-600 mb-2">
                    {alert.aiResponse}
                  </div>
                  {alert.violations.length > 0 && (
                    <div className="space-y-1">
                      {alert.violations.map((v, vidx) => (
                        <div key={vidx} className="text-xs text-red-700 flex items-start gap-1">
                          <span className="font-bold">•</span>
                          <span>{v.details}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {alert.warnings.length > 0 && (
                    <div className="space-y-1 mt-2">
                      {alert.warnings.map((w, widx) => (
                        <div key={widx} className="text-xs text-yellow-700 flex items-start gap-1">
                          <span className="font-bold">⚠</span>
                          <span>{w.details}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </motion.div>
          ))
        )}
      </div>
    </Card>
  );
}