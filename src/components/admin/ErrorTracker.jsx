/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Error Tracking Dashboard                                   ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, CheckCircle, XCircle, Code } from "lucide-react";
import { motion } from "framer-motion";

export default function ErrorTracker() {
  const queryClient = useQueryClient();
  const [expandedError, setExpandedError] = useState(null);

  const { data: errors = [] } = useQuery({
    queryKey: ['errorLogs'],
    queryFn: () => base44.entities.ErrorLog.list('-created_date', 50),
    refetchInterval: 30000 // 30s
  });

  const resolveMutation = useMutation({
    mutationFn: async (errorId) => {
      const user = await base44.auth.me();
      return base44.entities.ErrorLog.update(errorId, {
        resolved: true,
        resolved_by: user.email
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['errorLogs'] });
    }
  });

  const severityConfig = {
    low: { color: "bg-blue-100 text-blue-700", icon: AlertTriangle },
    medium: { color: "bg-yellow-100 text-yellow-700", icon: AlertTriangle },
    high: { color: "bg-orange-100 text-orange-700", icon: AlertTriangle },
    critical: { color: "bg-red-100 text-red-700", icon: XCircle }
  };

  const unresolvedCount = errors.filter(e => !e.resolved).length;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-xl">Error Tracker</h3>
          <p className="text-sm text-slate-600">
            {unresolvedCount} erreur{unresolvedCount !== 1 ? 's' : ''} non résolu{unresolvedCount !== 1 ? 'es' : 'e'}
          </p>
        </div>
        {unresolvedCount > 0 && (
          <Badge className="bg-red-500 text-white">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Attention
          </Badge>
        )}
      </div>

      <ScrollArea className="h-[500px]">
        <div className="space-y-3">
          {errors.map((error, idx) => {
            const SeverityIcon = severityConfig[error.severity]?.icon || AlertTriangle;
            const isExpanded = expandedError === error.id;

            return (
              <motion.div
                key={error.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.02 }}
              >
                <Card className={`p-4 ${error.resolved ? 'bg-green-50 border-green-200' : ''}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${severityConfig[error.severity]?.color}`}>
                        <SeverityIcon className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{error.error_type}</Badge>
                          <Badge className={severityConfig[error.severity]?.color}>
                            {error.severity}
                          </Badge>
                          {error.resolved && (
                            <Badge className="bg-green-500 text-white">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Résolu
                            </Badge>
                          )}
                          {error.occurrences > 1 && (
                            <Badge variant="outline">
                              {error.occurrences}x
                            </Badge>
                          )}
                        </div>

                        <p className="font-semibold text-sm text-slate-900 mb-1">
                          {error.message}
                        </p>

                        <div className="text-xs text-slate-600 space-y-1">
                          {error.page && <div>Page: {error.page}</div>}
                          {error.user_email && <div>User: {error.user_email}</div>}
                          <div>
                            {new Date(error.created_date).toLocaleString()}
                            {error.browser && ` • ${error.browser}`}
                          </div>
                        </div>

                        {isExpanded && error.stack_trace && (
                          <div className="mt-3 bg-slate-900 text-green-400 p-3 rounded font-mono text-xs overflow-x-auto">
                            <pre>{error.stack_trace}</pre>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {error.stack_trace && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setExpandedError(isExpanded ? null : error.id)}
                        >
                          <Code className="w-4 h-4" />
                        </Button>
                      )}
                      
                      {!error.resolved && (
                        <Button
                          size="sm"
                          onClick={() => resolveMutation.mutate(error.id)}
                          disabled={resolveMutation.isPending}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Résoudre
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}

          {errors.length === 0 && (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-3" />
              <p className="text-slate-600">Aucune erreur récente</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}