/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Data Retention Policies                                    ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, Clock, Trash2 } from "lucide-react";

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
  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-6 h-6 text-slate-900" />
        <h3 className="text-xl font-bold text-slate-900">Politiques de rétention</h3>
      </div>

      <div className="space-y-4">
        {RETENTION_POLICIES.map((policy, idx) => (
          <div key={idx} className="flex items-start justify-between p-4 bg-slate-50 rounded-lg">
            <div className="flex items-start gap-3">
              <Database className="w-5 h-5 text-slate-600 mt-1" />
              <div>
                <h4 className="font-semibold text-slate-900">{policy.entity}</h4>
                <p className="text-sm text-slate-600">{policy.description}</p>
              </div>
            </div>
            <Badge className={policy.color}>
              {policy.retention}
            </Badge>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-900">
          <strong>Note:</strong> Suppression de compte = toutes les données effacées sous 30 jours (RGPD/Loi 25)
        </p>
      </div>
    </Card>
  );
}