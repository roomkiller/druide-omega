/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Evolution Timeline Visualization                           ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle } from "lucide-react";
import { motion } from "framer-motion";

export default function EvolutionTimeline({ currentStage, stages }) {
  return (
    <div className="space-y-6">
      {stages.map((stage, index) => {
        const isCompleted = currentStage >= stage.stage;
        const isCurrent = currentStage === stage.stage;
        const isLocked = currentStage < stage.stage;

        return (
          <motion.div
            key={stage.stage}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`p-6 ${isCurrent ? 'border-2 border-purple-500 shadow-xl' : isCompleted ? 'border-green-500' : 'border-slate-200 opacity-60'}`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isCompleted ? 'bg-gradient-to-br from-green-500 to-emerald-600' :
                  isCurrent ? 'bg-gradient-to-br from-purple-500 to-indigo-600 animate-pulse' :
                  'bg-slate-300'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6 text-white" />
                  ) : (
                    <Circle className="w-6 h-6 text-white" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-slate-900">
                      Stade {stage.stage}: {stage.name}
                    </h3>
                    {isCurrent && (
                      <Badge className="bg-purple-500 text-white">Actuel</Badge>
                    )}
                    {isLocked && (
                      <Badge variant="outline">🔒 Verrouillé</Badge>
                    )}
                  </div>

                  <p className="text-slate-600 mb-4">{stage.description}</p>

                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-slate-700">
                      Capacités {isLocked ? 'à débloquer' : 'débloquées'}:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {stage.capabilities.map(cap => (
                        <Badge 
                          key={cap} 
                          className={isCompleted ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'}
                        >
                          {cap.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {!isCompleted && (
                    <div className="mt-4">
                      <p className="text-xs text-slate-500">
                        Seuil requis: {stage.threshold} points d'évolution
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}