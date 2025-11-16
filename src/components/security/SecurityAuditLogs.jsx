/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Security Audit Logs                                        ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Search,
  Calendar
} from "lucide-react";
import { motion } from "framer-motion";

export default function SecurityAuditLogs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');

  const { data: auditLogs = [], isLoading } = useQuery({
    queryKey: ['auditLogs'],
    queryFn: () => base44.entities.AuditLog.list('-created_date', 100)
  });

  const severityConfig = {
    low: { color: 'bg-blue-100 text-blue-700', icon: CheckCircle },
    medium: { color: 'bg-yellow-100 text-yellow-700', icon: AlertTriangle },
    high: { color: 'bg-orange-100 text-orange-700', icon: AlertTriangle },
    critical: { color: 'bg-red-100 text-red-700', icon: XCircle }
  };

  const statusConfig = {
    success: { color: 'bg-green-100 text-green-700', icon: CheckCircle },
    failure: { color: 'bg-red-100 text-red-700', icon: XCircle },
    blocked: { color: 'bg-red-100 text-red-700', icon: Shield }
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user_email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === 'all' || log.severity === filterSeverity;
    return matchesSearch && matchesSeverity;
  });

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Audit Logs</h3>
            <p className="text-sm text-slate-600">{filteredLogs.length} événements</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <select
          value={filterSeverity}
          onChange={(e) => setFilterSeverity(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="all">Toutes sévérités</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      <ScrollArea className="h-[500px]">
        <div className="space-y-2">
          {filteredLogs.map((log, idx) => {
            const SeverityIcon = severityConfig[log.severity]?.icon || AlertTriangle;
            const StatusIcon = statusConfig[log.status]?.icon || CheckCircle;

            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.02 }}
              >
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${severityConfig[log.severity]?.color}`}>
                        <SeverityIcon className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm">{log.action}</span>
                          <Badge className={statusConfig[log.status]?.color}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {log.status}
                          </Badge>
                          <Badge className={severityConfig[log.severity]?.color}>
                            {log.severity}
                          </Badge>
                        </div>
                        
                        <div className="text-xs text-slate-600 space-y-1">
                          <div>Utilisateur: <span className="font-mono">{log.user_email}</span></div>
                          <div>Ressource: {log.resource_type} ({log.resource_id?.slice(0, 8)}...)</div>
                          {log.ip_address && <div>IP: {log.ip_address}</div>}
                          <div className="flex items-center gap-1 text-slate-500">
                            <Calendar className="w-3 h-3" />
                            {new Date(log.created_date).toLocaleString()}
                          </div>
                        </div>

                        {log.details && Object.keys(log.details).length > 0 && (
                          <details className="mt-2">
                            <summary className="text-xs text-purple-600 cursor-pointer">Détails</summary>
                            <pre className="text-xs bg-slate-50 p-2 rounded mt-1 overflow-x-auto">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}

          {filteredLogs.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <Shield className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p>Aucun log trouvé</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}