import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, Activity, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function ModuleStatusPanel({ modules, moduleStates, detailed = false }) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-bold text-slate-900">Modules Actifs</h3>
        <Badge className="ml-auto bg-purple-100 text-purple-700">{modules.length}</Badge>
      </div>

      <div className="space-y-3">
        {modules.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-4">Aucun module actif</p>
        ) : (
          modules.map((moduleName, idx) => {
            const state = moduleStates?.[moduleName] || {};
            const hasError = state.error;
            const lastUpdate = state.lastUpdate ? new Date(state.lastUpdate).toLocaleTimeString('fr-FR') : 'N/A';
            
            return (
              <motion.div
                key={moduleName}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`p-4 rounded-lg border ${
                  hasError ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {hasError ? (
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    )}
                    <span className="font-semibold text-slate-900">{moduleName}</span>
                  </div>
                  <Badge className={hasError ? 'bg-red-500' : 'bg-green-500'}>
                    {hasError ? 'Erreur' : 'Actif'}
                  </Badge>
                </div>

                {detailed && (
                  <div className="text-xs text-slate-600 space-y-1 mt-2">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Dernière MAJ: {lastUpdate}</span>
                    </div>
                    {state.messages && (
                      <div>Messages: {state.messages.length}</div>
                    )}
                    {state.error && (
                      <div className="text-red-600 font-medium mt-2">
                        Erreur: {state.error}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </div>
    </Card>
  );
}