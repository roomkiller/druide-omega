import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { 
  History, 
  CheckCircle2, 
  XCircle, 
  Clock,
  RotateCcw,
  TrendingUp,
  Package
} from "lucide-react";
import { motion } from "framer-motion";

const STATUS_CONFIG = {
  pending: { icon: Clock, color: "bg-slate-500", label: "En attente" },
  testing: { icon: TrendingUp, color: "bg-blue-500", label: "Tests" },
  passed: { icon: CheckCircle2, color: "bg-green-500", label: "Tests OK" },
  failed: { icon: XCircle, color: "bg-red-500", label: "Échoué" },
  deployed: { icon: CheckCircle2, color: "bg-green-600", label: "Déployé" },
  rolled_back: { icon: RotateCcw, color: "bg-orange-500", label: "Rollback" }
};

export default function DeploymentHistory() {
  const { data: deployments = [], isLoading } = useQuery({
    queryKey: ['deployments'],
    queryFn: () => base44.entities.Deployment.list('-created_date', 20)
  });

  if (isLoading) {
    return (
      <Card className="p-6">
        <p className="text-center text-slate-500">Chargement...</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <History className="w-5 h-5 text-cyan-600" />
        <h3 className="text-lg font-bold text-slate-900">Historique des Déploiements</h3>
        <Badge variant="outline" className="ml-auto">{deployments.length}</Badge>
      </div>

      {deployments.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          <Package className="w-12 h-12 mx-auto mb-2 text-slate-300" />
          <p className="text-sm">Aucun déploiement</p>
        </div>
      ) : (
        <div className="space-y-3">
          {deployments.map((deployment, idx) => {
            const statusConfig = STATUS_CONFIG[deployment.status] || STATUS_CONFIG.pending;
            const Icon = statusConfig.icon;

            return (
              <motion.div
                key={deployment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-4 rounded-lg border border-slate-200 hover:border-purple-200 transition-colors bg-white"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 ${statusConfig.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">
                        v{deployment.version}
                      </div>
                      <div className="text-xs text-slate-500">
                        {new Date(deployment.created_date).toLocaleString('fr-FR')}
                      </div>
                    </div>
                  </div>
                  <Badge className={statusConfig.color}>
                    {statusConfig.label}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-600 mb-2">
                  <span className="capitalize bg-slate-100 px-2 py-0.5 rounded">
                    {deployment.deployment_type}
                  </span>
                  {deployment.test_score && (
                    <span className={`font-semibold ${
                      deployment.test_score >= 90 ? 'text-green-600' :
                      deployment.test_score >= 75 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      Tests: {deployment.test_score}%
                    </span>
                  )}
                  {deployment.deployed_by && (
                    <span className="text-slate-500">
                      Par: {deployment.deployed_by}
                    </span>
                  )}
                </div>

                {deployment.changes && deployment.changes.length > 0 && (
                  <div className="text-xs text-slate-600 space-y-0.5 mt-2 pt-2 border-t border-slate-100">
                    {deployment.changes.map((change, cidx) => (
                      <div key={cidx} className="flex items-start gap-1">
                        <span className="text-slate-400">•</span>
                        <span>{change}</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </Card>
  );
}