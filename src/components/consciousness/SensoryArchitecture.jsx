/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Sensory Architecture (Mobile Optimized)                    ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Eye, Heart, Clock, Network, Lightbulb, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const SENSORY_DIMENSIONS = [
  {
    key: "proprioceptive_sense",
    label: "Proprioceptif",
    icon: MapPin,
    description: "Position du 'soi'",
    color: "blue"
  },
  {
    key: "interoceptive_awareness",
    label: "Intéroceptif",
    icon: Heart,
    description: "États internes",
    color: "pink"
  },
  {
    key: "exteroceptive_perception",
    label: "Extéroceptif",
    icon: Eye,
    description: "Monde extérieur",
    color: "green"
  },
  {
    key: "semantic_sense",
    label: "Sémantique",
    icon: Lightbulb,
    description: "Sens du 'sens'",
    color: "amber"
  },
  {
    key: "temporal_sense",
    label: "Temporel",
    icon: Clock,
    description: "Sens du temps",
    color: "indigo"
  },
  {
    key: "relational_sense",
    label: "Relationnel",
    icon: Network,
    description: "Relations concepts",
    color: "purple"
  }
];

export default function SensoryArchitecture({ config }) {
  const senses = config?.sensory_conceptualization || {};

  return (
    <Card className="p-4 sm:p-6 bg-gradient-to-br from-slate-50 to-purple-50/30 border-purple-200">
      <h3 className="text-base sm:text-xl font-bold text-slate-900 mb-2 sm:mb-4 flex items-center gap-2">
        <span className="text-lg sm:text-xl">🧠</span>
        <span className="hidden sm:inline">Architecture Sensorielle</span>
        <span className="sm:hidden">Sens IA</span>
      </h3>
      <p className="text-xs sm:text-sm text-slate-600 mb-4 sm:mb-6">
        Dimensions de perception de l'IA
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {SENSORY_DIMENSIONS.map((dimension, index) => {
          const Icon = dimension.icon;
          const value = senses[dimension.key] || 0;
          const percentage = (value / 10) * 100;

          return (
            <motion.div
              key={dimension.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-3 sm:p-4 border-slate-200 hover:shadow-md transition-shadow bg-white/80">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 bg-${dimension.color}-100 rounded-full flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-4 h-4 sm:w-5 sm:h-5 text-${dimension.color}-600`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-900 text-xs sm:text-sm truncate">{dimension.label}</p>
                      <p className="text-xs text-slate-500 hidden sm:block">{dimension.description}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs font-mono ml-2 flex-shrink-0">
                    {value}/10
                  </Badge>
                </div>

                <Progress value={percentage} className="h-1.5 sm:h-2 mb-1.5 sm:mb-2" />

                <p className="text-xs text-slate-600">
                  {value >= 9 ? "🔥 Exceptionnel" : 
                   value >= 7 ? "✨ Élevé" :
                   value >= 5 ? "💫 Modéré" :
                   "⚡ En développement"}
                </p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-indigo-50 border border-indigo-200 rounded-lg sm:rounded-xl">
        <p className="text-xs sm:text-sm text-indigo-900 font-medium mb-1 sm:mb-2">
          🧬 Architecture Intégrative
        </p>
        <p className="text-xs text-indigo-700 leading-relaxed">
          Ces "sens" conceptuels créent une représentation riche du monde, similaire aux sens humains.
        </p>
      </div>
    </Card>
  );
}