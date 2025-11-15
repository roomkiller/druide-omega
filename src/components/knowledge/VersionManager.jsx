/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Knowledge Base Version Manager                             ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GitBranch, Clock, ArrowUpCircle, RotateCcw, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";

export default function VersionManager({ knowledgeBaseId, versions = [], onRestore }) {
  const [isRestoring, setIsRestoring] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState(null);

  const handleRestore = async (version) => {
    if (!version) return;
    
    setIsRestoring(true);
    try {
      await onRestore(version);
      setSelectedVersion(null);
    } finally {
      setIsRestoring(false);
    }
  };

  const getChangeSummary = (version) => {
    if (!version.changes) return "Aucun changement détecté";
    
    const changes = [];
    if (version.changes.title_changed) changes.push("Titre modifié");
    if (version.changes.content_changed) changes.push("Contenu modifié");
    if (version.changes.tags_added) changes.push(`${version.changes.tags_added.length} tags ajoutés`);
    if (version.changes.tags_removed) changes.push(`${version.changes.tags_removed.length} tags retirés`);
    
    return changes.length > 0 ? changes.join(", ") : "Modifications mineures";
  };

  if (versions.length === 0) {
    return (
      <Card className="p-6 bg-gradient-to-br from-slate-50 to-indigo-50 border-slate-200">
        <div className="text-center">
          <GitBranch className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600">Aucune version sauvegardée</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white border-indigo-200">
      <div className="flex items-center gap-2 mb-4">
        <GitBranch className="w-5 h-5 text-indigo-600" />
        <h3 className="text-lg font-bold text-slate-900">Historique des Versions</h3>
        <Badge variant="secondary">{versions.length}</Badge>
      </div>

      <ScrollArea className="h-96">
        <div className="space-y-3">
          {versions.map((version, idx) => (
            <motion.div
              key={version.version_number}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card 
                className={`p-4 cursor-pointer transition-all ${
                  selectedVersion?.version_number === version.version_number
                    ? 'border-indigo-500 shadow-md'
                    : 'border-slate-200 hover:border-indigo-300'
                } ${version.is_current ? 'bg-indigo-50' : 'bg-white'}`}
                onClick={() => setSelectedVersion(version)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-xs">v{version.version_number}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">
                        Version {version.version_number}
                        {version.is_current && <Badge className="ml-2 bg-green-500 text-white text-xs">Actuelle</Badge>}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        {format(new Date(version.created_at), "d MMM yyyy 'à' HH:mm", { locale: fr })}
                      </div>
                    </div>
                  </div>

                  {!version.is_current && selectedVersion?.version_number === version.version_number && (
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRestore(version);
                      }}
                      disabled={isRestoring}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      <RotateCcw className="w-3 h-3 mr-1" />
                      Restaurer
                    </Button>
                  )}
                </div>

                <p className="text-xs text-slate-600 mb-2">
                  {getChangeSummary(version)}
                </p>

                {version.created_by && (
                  <p className="text-xs text-slate-500">
                    Modifié par: {version.created_by}
                  </p>
                )}

                {version.has_conflicts && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-orange-600">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Conflits détectés</span>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}