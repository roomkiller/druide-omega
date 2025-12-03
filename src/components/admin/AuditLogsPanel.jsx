/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Audit Logs Panel                                           ║
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, User, Database, Key, Webhook, Settings, CreditCard, Loader2, Search } from "lucide-react";
import { motion } from "framer-motion";
import Pagination from "../utils/Pagination";

export default function AuditLogsPanel() {
  const [page, setPage] = useState(1);
  const [resourceFilter, setResourceFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const pageSize = 20;

  const { data: logsData, isLoading } = useQuery({
    queryKey: ['auditLogs', page, resourceFilter, searchQuery],
    queryFn: async () => {
      let logs = await base44.entities.AuditLog.list('-created_date', 200);
      
      if (resourceFilter !== 'all') {
        logs = logs.filter(l => l.resource_type === resourceFilter);
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        logs = logs.filter(l => 
          l.action?.toLowerCase().includes(query) ||
          l.user_email?.toLowerCase().includes(query) ||
          l.resource_id?.toLowerCase().includes(query)
        );
      }

      const start = (page - 1) * pageSize;
      const items = logs.slice(start, start + pageSize);
      
      return { items, total: logs.length };
    },
    initialData: { items: [], total: 0 },
  });

  const resourceIcons = {
    user: User,
    license: Shield,
    api_key: Key,
    webhook: Webhook,
    conversation: Database,
    memory: Database,
    knowledge: Database,
    settings: Settings,
    billing: CreditCard,
    integration: Webhook
  };

  const statusColors = {
    success: "bg-green-100 text-green-700",
    failure: "bg-red-100 text-red-700",
    blocked: "bg-orange-100 text-orange-700"
  };

  const severityColors = {
    low: "bg-blue-100 text-blue-700",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-orange-100 text-orange-700",
    critical: "bg-red-100 text-red-700"
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Rechercher par action, utilisateur ou ressource..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="pl-10"
            />
          </div>
          <Select value={resourceFilter} onValueChange={(v) => { setResourceFilter(v); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Type de ressource" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les ressources</SelectItem>
              <SelectItem value="user">Utilisateurs</SelectItem>
              <SelectItem value="license">Licences</SelectItem>
              <SelectItem value="api_key">Clés API</SelectItem>
              <SelectItem value="webhook">Webhooks</SelectItem>
              <SelectItem value="conversation">Conversations</SelectItem>
              <SelectItem value="settings">Paramètres</SelectItem>
              <SelectItem value="billing">Facturation</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
        </div>
      ) : (
        <>
          <ScrollArea className="h-[600px]">
            <div className="space-y-3">
              {logsData.items.map((log, idx) => {
                const Icon = resourceIcons[log.resource_type] || Database;
                
                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.02 }}
                  >
                    <Card className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-purple-600" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <span className="font-semibold text-slate-900">{log.action}</span>
                            <Badge variant="outline">{log.resource_type}</Badge>
                            <Badge className={statusColors[log.status]}>{log.status}</Badge>
                            {log.severity && (
                              <Badge className={severityColors[log.severity]}>{log.severity}</Badge>
                            )}
                          </div>

                          <div className="text-sm text-slate-600 space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span>Par: <strong>{log.user_email}</strong></span>
                              {log.ip_address && <span>• IP: {log.ip_address}</span>}
                            </div>
                            {log.resource_id && (
                              <div>Ressource: <span className="font-mono text-xs">{log.resource_id}</span></div>
                            )}
                            <div className="text-slate-500 text-xs">
                              {new Date(log.created_date).toLocaleString()}
                            </div>
                          </div>

                          {log.details && Object.keys(log.details).length > 0 && (
                            <details className="mt-2">
                              <summary className="text-xs text-purple-600 cursor-pointer hover:underline">
                                Voir les détails
                              </summary>
                              <pre className="mt-2 bg-slate-50 p-2 rounded text-xs overflow-x-auto">
                                {JSON.stringify(log.details, null, 2)}
                              </pre>
                            </details>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}

              {logsData.items.length === 0 && (
                <Card className="p-12 text-center">
                  <Shield className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600">Aucun log d'audit trouvé</p>
                </Card>
              )}
            </div>
          </ScrollArea>

          {logsData.total > pageSize && (
            <Pagination 
              currentPage={page} 
              totalPages={Math.ceil(logsData.total / pageSize)} 
              totalItems={logsData.total} 
              onPageChange={setPage} 
              itemsPerPage={pageSize} 
            />
          )}
        </>
      )}
    </div>
  );
}