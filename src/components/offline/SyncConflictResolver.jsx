/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Intelligent Sync Conflict Resolver                         ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Check, X, GitMerge } from "lucide-react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { offlineManager } from "./OfflineManager";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function SyncConflictResolver({ conflicts, onResolved }) {
  const [resolving, setResolving] = useState(false);
  const [autoResolveAttempted, setAutoResolveAttempted] = useState(false);

  const handleResolve = async (conflict, resolution) => {
    setResolving(true);
    try {
      let finalData;

      if (resolution === "keep_offline") {
        finalData = conflict.offline_version;
      } else if (resolution === "keep_server") {
        finalData = conflict.server_version;
      } else if (resolution === "merge") {
        finalData = await intelligentMerge(conflict);
      }

      if (conflict.entity_type === "memory") {
        await base44.entities.Memory.update(conflict.entity_id, finalData);
      } else if (conflict.entity_type === "knowledge_base") {
        await base44.entities.KnowledgeBase.update(conflict.entity_id, finalData);
      }

      onResolved?.(conflict.entity_id);
    } catch (error) {
      console.error("Erreur résolution:", error);
    } finally {
      setResolving(false);
    }
  };

  const intelligentMerge = async (conflict) => {
    const analysis = await base44.integrations.Core.InvokeLLM({
      prompt: `Analyse ce conflit de synchronisation et propose une fusion intelligente:

VERSION OFFLINE:
${JSON.stringify(conflict.offline_version, null, 2)}

VERSION SERVEUR:
${JSON.stringify(conflict.server_version, null, 2)}

Génère une version fusionnée qui:
1. Préserve les données les plus récentes
2. Combine les modifications non conflictuelles
3. Résout intelligemment les vrais conflits
4. Maintient l'intégrité des données

Retourne la version fusionnée en JSON.`,
      response_json_schema: {
        type: "object",
        properties: {
          merged_data: { type: "object" },
          merge_strategy: { type: "string" },
          conflicts_resolved: { type: "array", items: { type: "string" } }
        }
      }
    });

    return analysis.merged_data;
  };

  const autoResolveAll = async () => {
    setAutoResolveAttempted(true);
    
    for (const conflict of conflicts) {
      try {
        await handleResolve(conflict, "merge");
      } catch (error) {
        console.error("Erreur auto-résolution:", error);
      }
    }
  };

  if (conflicts.length === 0) return null;

  return (
    <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50 border-orange-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          <h3 className="text-lg font-bold text-slate-900">Conflits de Synchronisation</h3>
          <Badge variant="secondary" className="bg-orange-100 text-orange-700">
            {conflicts.length}
          </Badge>
        </div>
        {!autoResolveAttempted && (
          <Button
            size="sm"
            onClick={autoResolveAll}
            disabled={resolving}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <GitMerge className="w-4 h-4 mr-2" />
            Résolution Auto
          </Button>
        )}
      </div>

      <ScrollArea className="h-96">
        <div className="space-y-3">
          {conflicts.map((conflict, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-4 border-orange-200">
                <div className="mb-3">
                  <Badge className="bg-orange-500 text-white mb-2">
                    {conflict.entity_type}
                  </Badge>
                  <p className="text-sm text-slate-900 font-medium">
                    ID: {conflict.entity_id}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs font-semibold text-blue-900 mb-2">Version Offline</p>
                    <p className="text-xs text-slate-600 line-clamp-3">
                      {JSON.stringify(conflict.offline_version).substring(0, 100)}...
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-xs font-semibold text-green-900 mb-2">Version Serveur</p>
                    <p className="text-xs text-slate-600 line-clamp-3">
                      {JSON.stringify(conflict.server_version).substring(0, 100)}...
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleResolve(conflict, "keep_offline")}
                    disabled={resolving}
                    className="flex-1"
                  >
                    <Check className="w-3 h-3 mr-1" />
                    Offline
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleResolve(conflict, "keep_server")}
                    disabled={resolving}
                    className="flex-1"
                  >
                    <Check className="w-3 h-3 mr-1" />
                    Serveur
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleResolve(conflict, "merge")}
                    disabled={resolving}
                    className="flex-1 bg-purple-600"
                  >
                    <GitMerge className="w-3 h-3 mr-1" />
                    Fusionner
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}