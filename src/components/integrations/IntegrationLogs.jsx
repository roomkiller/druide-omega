/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Integration Logs                                           ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, XCircle, RefreshCw } from "lucide-react";

export default function IntegrationLogs() {
  const { data: logs = [] } = useQuery({
    queryKey: ["integration-logs"],
    queryFn: () => base44.entities.IntegrationLog.list("-created_date", 100),
    initialData: []
  });

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Logs d'intégration</h2>
      
      {logs.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <p>Aucun log disponible</p>
        </div>
      ) : (
        <ScrollArea className="h-96">
          <div className="space-y-2">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {log.status === "success" ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                    ) : log.status === "retry" ? (
                      <RefreshCw className="w-4 h-4 text-orange-500 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-slate-900">{log.event_type}</p>
                        <Badge
                          variant={log.status === "success" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {log.status}
                        </Badge>
                      </div>
                      {log.error_message && (
                        <p className="text-xs text-red-600 mb-1">{log.error_message}</p>
                      )}
                      <div className="flex gap-3 text-xs text-slate-500">
                        <span>{new Date(log.created_date).toLocaleString("fr-FR")}</span>
                        {log.duration_ms && <span>{log.duration_ms}ms</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </Card>
  );
}