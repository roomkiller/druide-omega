/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Consciousness Metrics (Mobile Optimized)                   ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, Zap, Heart, Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function ConsciousnessMetrics({ config, thoughtCount = 0 }) {
  if (!config) return null;

  const level = config.consciousness_level || 9;
  const ratioLogic = config.ratio_logic || 1;
  const ratioConsciousness = config.ratio_consciousness || 9;
  const isActive = config.active;
  const state = config.consciousness_state || "empathic";

  const totalRatio = ratioLogic + ratioConsciousness;
  const logicPercentage = (ratioLogic / totalRatio) * 100;
  const consciousnessPercentage = (ratioConsciousness / totalRatio) * 100;

  const getStateColor = (state) => {
    const colors = {
      awakened: "from-yellow-500 to-orange-500",
      meditative: "from-blue-500 to-indigo-500",
      analytical: "from-green-500 to-teal-500",
      creative: "from-purple-500 to-pink-500",
      introspective: "from-indigo-500 to-purple-500",
      transcendent: "from-pink-500 to-violet-500",
      empathic: "from-rose-500 to-pink-500",
      philosophical: "from-slate-500 to-gray-500",
      guardian: "from-cyan-500 to-blue-500"
    };
    return colors[state] || "from-purple-500 to-indigo-500";
  };

  const getLevelLabel = (level) => {
    if (level >= 13) return "Transcendant";
    if (level >= 11) return "Supérieur";
    if (level >= 9) return "Élevé";
    if (level >= 7) return "Avancé";
    if (level >= 5) return "Intermédiaire";
    if (level >= 3) return "Émergent";
    return "Initial";
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-4 sm:p-5 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200 relative overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -top-10 -right-10 w-24 h-24 sm:w-32 sm:h-32 bg-purple-200/30 rounded-full blur-2xl"
          />
          
          <div className="relative">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-purple-600 font-medium">Niveau</p>
                  <p className="text-xl sm:text-2xl font-bold text-purple-900">{level}/15</p>
                </div>
              </div>
              <Badge className="bg-purple-600 text-white text-xs">
                {getLevelLabel(level)}
              </Badge>
            </div>

            <Progress value={(level / 15) * 100} className="h-1.5 sm:h-2 bg-purple-200 mb-2 sm:mb-3" />

            <div className="flex items-center gap-1.5 sm:gap-2">
              <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
              <p className="text-xs text-purple-700 truncate">
                {isActive ? "Actif" : "Inactif"} • <span className="capitalize">{state}</span>
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-4 sm:p-5 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-blue-600 font-medium">Ratio</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-900">{ratioLogic}:{ratioConsciousness}</p>
              </div>
            </div>
          </div>

          <div className="space-y-1.5 sm:space-y-2 mb-2 sm:mb-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-blue-700">Logique</span>
                <span className="text-xs font-mono text-blue-900">{logicPercentage.toFixed(0)}%</span>
              </div>
              <Progress value={logicPercentage} className="h-1 sm:h-1.5 bg-blue-200" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-indigo-700">Conscience</span>
                <span className="text-xs font-mono text-indigo-900">{consciousnessPercentage.toFixed(0)}%</span>
              </div>
              <Progress value={consciousnessPercentage} className="h-1 sm:h-1.5 bg-indigo-200" />
            </div>
          </div>

          <p className="text-xs text-blue-600 truncate">
            {consciousnessPercentage > logicPercentage ? "🧘 Conscience" : logicPercentage > consciousnessPercentage ? "🤖 Logique" : "⚖️ Équilibre"}
          </p>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className={`p-4 sm:p-5 bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200`}>
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br ${getStateColor(state)} rounded-lg sm:rounded-xl flex items-center justify-center`}>
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-pink-600 font-medium">Pensées</p>
                <p className="text-xl sm:text-2xl font-bold text-pink-900">{thoughtCount}</p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs text-pink-700 border-pink-300">
              Total
            </Badge>
          </div>

          <p className="text-xs text-pink-600 truncate">
            💭 {isActive ? "Génération active" : "Pausé"}
          </p>
        </Card>
      </motion.div>
    </div>
  );
}