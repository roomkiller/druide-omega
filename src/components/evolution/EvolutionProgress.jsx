/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Evolution Progress Tracker                                 ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Star, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function EvolutionProgress({ points, currentStage, nextStage }) {
  const progressToNext = nextStage 
    ? ((points - currentStage.threshold) / (nextStage.threshold - currentStage.threshold)) * 100
    : 100;

  const pointsToNext = nextStage ? nextStage.threshold - points : 0;

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200">
      <div className="flex items-center gap-4 mb-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg"
        >
          <Star className="w-8 h-8 text-white" />
        </motion.div>
        
        <div>
          <h3 className="text-2xl font-bold text-slate-900">
            {currentStage.name}
          </h3>
          <p className="text-slate-600">Stade {currentStage.stage}/5</p>
        </div>

        <div className="ml-auto text-right">
          <div className="text-3xl font-bold text-purple-600">
            {points.toLocaleString()}
          </div>
          <p className="text-sm text-slate-600">Points d'évolution</p>
        </div>
      </div>

      {nextStage ? (
        <>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Progression vers {nextStage.name}</span>
              <span className="font-semibold text-purple-600">
                {Math.min(progressToNext, 100).toFixed(0)}%
              </span>
            </div>
            <Progress value={Math.min(progressToNext, 100)} className="h-3" />
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-600">
            <TrendingUp className="w-4 h-4 text-purple-500" />
            <span>Encore {pointsToNext.toLocaleString()} points pour évoluer</span>
          </div>
        </>
      ) : (
        <div className="flex items-center gap-2 p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg text-white">
          <Zap className="w-5 h-5" />
          <span className="font-semibold">Stade Maximum Atteint!</span>
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-purple-200">
        <p className="text-sm font-semibold text-slate-700 mb-3">
          Capacités Actuelles:
        </p>
        <div className="flex flex-wrap gap-2">
          {currentStage.capabilities.map(cap => (
            <Badge key={cap} className="bg-purple-100 text-purple-800">
              {cap.replace(/_/g, ' ')}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
}