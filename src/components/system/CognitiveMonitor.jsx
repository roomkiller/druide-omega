/**
 * Moniteur cognitif - Affiche l'état du noyau cognitif en temps réel
 */

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function CognitiveMonitor({ compact = false }) {
  const { data: cognitiveCore } = useQuery({
    queryKey: ['cognitiveCore'],
    queryFn: async () => {
      const cores = await base44.entities.CognitiveCore.filter({}, '-timestamp', 1);
      return cores[0] || null;
    },
    refetchInterval: 60000 // Refresh chaque minute
  });

  if (!cognitiveCore) return null;

  const health = cognitiveCore.system_health_index;
  const stability = cognitiveCore.stability_parameters?.stability_index || 0;
  const alerts = cognitiveCore.critical_alerts?.filter(a => !a.resolved).length || 0;

  const healthColor = health >= 80 ? 'text-green-600' : health >= 60 ? 'text-yellow-600' : 'text-red-600';
  const HealthIcon = health >= 80 ? CheckCircle2 : AlertTriangle;

  if (compact) {
    return (
      <Badge variant="outline" className="gap-1.5">
        <Activity className={`w-3 h-3 ${healthColor}`} />
        <span className="text-xs">{health}%</span>
      </Badge>
    );
  }

  return (
    <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-slate-200">
      <HealthIcon className={`w-5 h-5 ${healthColor}`} />
      <div className="flex flex-col">
        <span className="text-xs text-slate-600">Santé Cognitive</span>
        <span className={`text-sm font-semibold ${healthColor}`}>{health}%</span>
      </div>
      {alerts > 0 && (
        <Badge variant="destructive" className="ml-auto">
          {alerts} alerte{alerts > 1 ? 's' : ''}
        </Badge>
      )}
    </div>
  );
}