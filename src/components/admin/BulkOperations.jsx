/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Bulk Operations Panel                                      ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Trash2, Archive, Tag, Database, AlertTriangle, CheckCircle,
  Loader2, RefreshCw, Download, Upload, FileText
} from "lucide-react";
import { motion } from "framer-motion";

const ENTITIES = [
  { value: "Conversation", label: "Conversations", icon: "💬" },
  { value: "Memory", label: "Mémoires", icon: "🧠" },
  { value: "KnowledgeBase", label: "Connaissances", icon: "📚" },
  { value: "ErrorLog", label: "Logs d'erreurs", icon: "⚠️" },
  { value: "VisualContent", label: "Contenus visuels", icon: "🖼️" },
  { value: "ConsciousThought", label: "Pensées conscientes", icon: "💭" },
  { value: "EmotionalResponse", label: "Réponses émotionnelles", icon: "❤️" },
  { value: "Notification", label: "Notifications", icon: "🔔" },
  { value: "Alert", label: "Alertes", icon: "🚨" },
  { value: "AuditLog", label: "Logs d'audit", icon: "📋" }
];

export default function BulkOperations() {
  const [entity, setEntity] = useState("Conversation");
  const [confirmDialog, setConfirmDialog] = useState({ open: false, action: null, days: 0 });
  const [results, setResults] = useState([]);
  const queryClient = useQueryClient();

  const { data: entityCounts = {}, isLoading: loadingCounts } = useQuery({
    queryKey: ['bulk-entity-counts'],
    queryFn: async () => {
      const counts = {};
      for (const e of ENTITIES) {
        try {
          const items = await base44.entities[e.value].list('-created_date', 1000);
          counts[e.value] = {
            total: items.length,
            last30: items.filter(i => new Date(i.created_date) > new Date(Date.now() - 30*24*60*60*1000)).length,
            last90: items.filter(i => new Date(i.created_date) > new Date(Date.now() - 90*24*60*60*1000)).length
          };
        } catch {
          counts[e.value] = { total: 0, last30: 0, last90: 0 };
        }
      }
      return counts;
    },
    staleTime: 60000
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ entity: targetEntity, days }) => {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      
      const items = await base44.entities[targetEntity].list('-created_date', 1000);
      const toDelete = items.filter(i => new Date(i.created_date) < cutoff);
      
      let deleted = 0;
      for (const item of toDelete) {
        try {
          await base44.entities[targetEntity].delete(item.id);
          deleted++;
        } catch (e) {
          console.error(`Failed to delete ${item.id}:`, e);
        }
      }
      
      return { deleted, total: toDelete.length };
    },
    onSuccess: (result, variables) => {
      setResults(prev => [...prev, {
        entity: variables.entity,
        action: `Suppression +${variables.days}j`,
        result: `${result.deleted}/${result.total} supprimés`,
        success: result.deleted === result.total,
        timestamp: new Date().toISOString()
      }]);
      queryClient.invalidateQueries({ queryKey: ['bulk-entity-counts'] });
      queryClient.invalidateQueries();
      setConfirmDialog({ open: false, action: null, days: 0 });
    }
  });

  const archiveMutation = useMutation({
    mutationFn: async ({ entity: targetEntity, days }) => {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      
      const items = await base44.entities[targetEntity].list('-created_date', 1000);
      const toArchive = items.filter(i => new Date(i.created_date) < cutoff && !i.archived);
      
      let archived = 0;
      for (const item of toArchive) {
        try {
          await base44.entities[targetEntity].update(item.id, { archived: true });
          archived++;
        } catch (e) {
          console.error(`Failed to archive ${item.id}:`, e);
        }
      }
      
      return { archived, total: toArchive.length };
    },
    onSuccess: (result, variables) => {
      setResults(prev => [...prev, {
        entity: variables.entity,
        action: `Archivage +${variables.days}j`,
        result: `${result.archived}/${result.total} archivés`,
        success: true,
        timestamp: new Date().toISOString()
      }]);
      queryClient.invalidateQueries();
    }
  });

  const exportEntity = async (targetEntity) => {
    try {
      const items = await base44.entities[targetEntity].list('-created_date', 5000);
      const json = JSON.stringify(items, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${targetEntity}_export_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      
      setResults(prev => [...prev, {
        entity: targetEntity,
        action: 'Export',
        result: `${items.length} éléments exportés`,
        success: true,
        timestamp: new Date().toISOString()
      }]);
    } catch (e) {
      setResults(prev => [...prev, {
        entity: targetEntity,
        action: 'Export',
        result: `Erreur: ${e.message}`,
        success: false,
        timestamp: new Date().toISOString()
      }]);
    }
  };

  const openConfirmDialog = (action, days) => {
    setConfirmDialog({ open: true, action, days });
  };

  const executeConfirmedAction = () => {
    if (confirmDialog.action === 'delete') {
      deleteMutation.mutate({ entity, days: confirmDialog.days });
    } else if (confirmDialog.action === 'archive') {
      archiveMutation.mutate({ entity, days: confirmDialog.days });
    }
  };

  const selectedEntityInfo = ENTITIES.find(e => e.value === entity);
  const currentCounts = entityCounts[entity] || { total: 0, last30: 0, last90: 0 };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-br from-purple-600 to-indigo-700 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Database className="w-8 h-8" />
          <div>
            <h3 className="text-2xl font-bold">Opérations en masse</h3>
            <p className="text-purple-200">Gestion et maintenance des données</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ENTITIES.slice(0, 4).map(e => (
            <div key={e.value} className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-2xl mb-1">{e.icon}</div>
              <div className="text-lg font-bold">{entityCounts[e.value]?.total || 0}</div>
              <div className="text-xs text-purple-200">{e.label}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Entity Selection */}
      <Card className="p-6">
        <h4 className="font-semibold mb-4">Sélectionner une entité</h4>
        <Select value={entity} onValueChange={setEntity}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ENTITIES.map(e => (
              <SelectItem key={e.value} value={e.value}>
                <span className="mr-2">{e.icon}</span>
                {e.label} ({entityCounts[e.value]?.total || 0})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Entity Stats */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="p-3 bg-slate-100 rounded-lg text-center">
            <div className="text-2xl font-bold text-slate-900">{currentCounts.total}</div>
            <div className="text-xs text-slate-600">Total</div>
          </div>
          <div className="p-3 bg-green-100 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-700">{currentCounts.last30}</div>
            <div className="text-xs text-green-600">30 derniers jours</div>
          </div>
          <div className="p-3 bg-blue-100 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-700">{currentCounts.last90}</div>
            <div className="text-xs text-blue-600">90 derniers jours</div>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Deletion Actions */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Trash2 className="w-5 h-5 text-red-600" />
            <h4 className="font-semibold">Suppression</h4>
          </div>
          <div className="space-y-2">
            {[30, 60, 90, 180, 365].map(days => (
              <Button
                key={days}
                variant="outline"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => openConfirmDialog('delete', days)}
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer +{days} jours
              </Button>
            ))}
          </div>
        </Card>

        {/* Archive Actions */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Archive className="w-5 h-5 text-amber-600" />
            <h4 className="font-semibold">Archivage</h4>
          </div>
          <div className="space-y-2">
            {[30, 60, 90, 180, 365].map(days => (
              <Button
                key={days}
                variant="outline"
                className="w-full justify-start text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                onClick={() => openConfirmDialog('archive', days)}
                disabled={archiveMutation.isPending}
              >
                <Archive className="w-4 h-4 mr-2" />
                Archiver +{days} jours
              </Button>
            ))}
          </div>
        </Card>
      </div>

      {/* Export */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Download className="w-5 h-5 text-blue-600" />
          <h4 className="font-semibold">Export de données</h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {ENTITIES.map(e => (
            <Button
              key={e.value}
              variant="outline"
              size="sm"
              onClick={() => exportEntity(e.value)}
            >
              {e.icon} {e.label}
            </Button>
          ))}
        </div>
      </Card>

      {/* Results History */}
      {results.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold">Historique des opérations</h4>
            <Button variant="ghost" size="sm" onClick={() => setResults([])}>
              Effacer
            </Button>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {results.slice().reverse().map((r, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg flex items-center justify-between ${
                  r.success ? 'bg-green-50' : 'bg-red-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {r.success ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  )}
                  <div>
                    <div className="font-medium text-sm">{r.entity} - {r.action}</div>
                    <div className="text-xs text-slate-600">{r.result}</div>
                  </div>
                </div>
                <div className="text-xs text-slate-400">
                  {new Date(r.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Confirm Dialog */}
      <Dialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Confirmer l'opération
            </DialogTitle>
            <DialogDescription>
              {confirmDialog.action === 'delete' 
                ? `Supprimer tous les ${selectedEntityInfo?.label} de plus de ${confirmDialog.days} jours?`
                : `Archiver tous les ${selectedEntityInfo?.label} de plus de ${confirmDialog.days} jours?`
              }
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                {confirmDialog.action === 'delete' 
                  ? "⚠️ Cette action est irréversible. Les données seront définitivement supprimées."
                  : "Les éléments seront marqués comme archivés mais resteront dans la base de données."
                }
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialog({ open: false, action: null, days: 0 })}>
              Annuler
            </Button>
            <Button
              className={confirmDialog.action === 'delete' ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-600 hover:bg-amber-700'}
              onClick={executeConfirmedAction}
              disabled={deleteMutation.isPending || archiveMutation.isPending}
            >
              {(deleteMutation.isPending || archiveMutation.isPending) && (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              )}
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}