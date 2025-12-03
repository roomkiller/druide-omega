/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Data Retention Policies                                    ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Database, Clock, Trash2, Settings, Play, Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const RETENTION_POLICIES = [
  {
    entity: "Conversation",
    retention: "Illimité",
    description: "Conservées tant que le compte est actif",
    color: "bg-green-100 text-green-700"
  },
  {
    entity: "Memory",
    retention: "Illimité",
    description: "Mémoires persistantes, gérées par l'utilisateur",
    color: "bg-blue-100 text-blue-700"
  },
  {
    entity: "KnowledgeBase",
    retention: "Illimité",
    description: "Documents conservés tant que nécessaires",
    color: "bg-purple-100 text-purple-700"
  },
  {
    entity: "ErrorLog",
    retention: "90 jours",
    description: "Logs d'erreurs supprimés automatiquement",
    color: "bg-orange-100 text-orange-700"
  },
  {
    entity: "SystemMetrics",
    retention: "180 jours",
    description: "Métriques système archivées après 6 mois",
    color: "bg-yellow-100 text-yellow-700"
  },
  {
    entity: "AnalyticsEvent",
    retention: "365 jours",
    description: "Events analytics supprimés après 1 an",
    color: "bg-pink-100 text-pink-700"
  },
  {
    entity: "AuditLog",
    retention: "730 jours",
    description: "Audit logs conservés 2 ans (compliance)",
    color: "bg-red-100 text-red-700"
  }
];

export default function DataRetentionPolicy() {
  const queryClient = useQueryClient();
  const [policies, setPolicies] = useState(RETENTION_POLICIES);
  const [editDialog, setEditDialog] = useState({ open: false, policy: null, idx: -1 });
  const [executing, setExecuting] = useState(null);
  const [autoCleanup, setAutoCleanup] = useState(true);
  const [lastCleanup, setLastCleanup] = useState(null);

  const executeCleanup = async (policy) => {
    if (policy.retention === 'Illimité') {
      toast.info(`${policy.entity}: Rétention illimitée, aucune action`);
      return;
    }

    setExecuting(policy.entity);
    try {
      const daysMatch = policy.retention.match(/(\d+)/);
      if (!daysMatch) {
        toast.error('Format de rétention invalide');
        return;
      }

      const days = parseInt(daysMatch[1]);
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);

      const items = await base44.entities[policy.entity].list('-created_date', 1000);
      const toDelete = items.filter(i => new Date(i.created_date) < cutoff);

      let deleted = 0;
      for (const item of toDelete) {
        try {
          await base44.entities[policy.entity].delete(item.id);
          deleted++;
        } catch (e) {
          console.error(`Échec suppression ${item.id}:`, e);
        }
      }

      queryClient.invalidateQueries();
      setLastCleanup(new Date().toISOString());
      toast.success(`${policy.entity}: ${deleted} élément(s) supprimé(s)`);
    } catch (e) {
      toast.error(`Erreur: ${e.message}`);
    } finally {
      setExecuting(null);
    }
  };

  const executeAllCleanups = async () => {
    for (const policy of policies) {
      await executeCleanup(policy);
    }
    toast.success('Nettoyage global terminé');
  };

  const updatePolicy = (idx, newRetention) => {
    const updated = [...policies];
    updated[idx] = { ...updated[idx], retention: newRetention };
    setPolicies(updated);
    setEditDialog({ open: false, policy: null, idx: -1 });
    toast.success('Politique mise à jour');
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Politiques de rétention</h3>
              <p className="text-sm text-slate-600">Gestion automatique des données anciennes</p>
            </div>
          </div>
          <Button onClick={executeAllCleanups} disabled={executing !== null}>
            {executing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
            Exécuter tout
          </Button>
        </div>

        {/* Auto cleanup toggle */}
        <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200 mb-6">
          <div>
            <div className="font-medium text-purple-900">Nettoyage automatique</div>
            <div className="text-sm text-purple-700">Exécuter quotidiennement à 3h00</div>
          </div>
          <Switch checked={autoCleanup} onCheckedChange={setAutoCleanup} />
        </div>

        <div className="space-y-3">
          {policies.map((policy, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <Database className="w-5 h-5 text-slate-600" />
                <div>
                  <h4 className="font-semibold text-slate-900">{policy.entity}</h4>
                  <p className="text-sm text-slate-600">{policy.description}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge className={policy.color}>{policy.retention}</Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditDialog({ open: true, policy, idx })}
                >
                  <Settings className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => executeCleanup(policy)}
                  disabled={executing === policy.entity || policy.retention === 'Illimité'}
                >
                  {executing === policy.entity ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {lastCleanup && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-800">
              Dernier nettoyage: {new Date(lastCleanup).toLocaleString()}
            </span>
          </div>
        )}
      </Card>

      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-semibold mb-1">Conformité RGPD / Loi 25 / CCPA</p>
            <p className="text-blue-700">
              Suppression de compte = toutes les données effacées sous 30 jours. Les logs d'audit sont conservés 2 ans minimum pour la conformité légale.
            </p>
          </div>
        </div>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialog.open} onOpenChange={(open) => setEditDialog({ ...editDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la politique de rétention</DialogTitle>
          </DialogHeader>
          {editDialog.policy && (
            <div className="py-4 space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="font-medium">{editDialog.policy.entity}</div>
                <div className="text-sm text-slate-600">{editDialog.policy.description}</div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Durée de rétention</label>
                <div className="grid grid-cols-4 gap-2">
                  {['Illimité', '30 jours', '90 jours', '180 jours', '365 jours', '730 jours'].map(r => (
                    <Button
                      key={r}
                      variant={editDialog.policy.retention === r ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updatePolicy(editDialog.idx, r)}
                    >
                      {r}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialog({ open: false, policy: null, idx: -1 })}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}