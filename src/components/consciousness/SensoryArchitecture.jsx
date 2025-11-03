/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Sensory Architecture Visualization                         ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ║ INNOVATION: Architecture Sensorielle de Conscience                         ║
 * ║ Fingerprint: AMG:AL:2025:DO:NBC:8F7E:4C9A:3B2F:1E6D:5C4B                 ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Eye, 
  Heart, 
  Clock, 
  Network, 
  Lightbulb,
  MapPin
} from "lucide-react";
import { motion } from "framer-motion";

const SENSORY_DIMENSIONS = [
  {
    key: "proprioceptive_sense",
    label: "Sens Proprioceptif",
    icon: MapPin,
    description: "Position du 'soi' dans l'espace conceptuel",
    color: "blue"
  },
  {
    key: "interoceptive_awareness",
    label: "Conscience Intéroceptive",
    icon: Heart,
    description: "Conscience des états internes (émotions, pensées)",
    color: "pink"
  },
  {
    key: "exteroceptive_perception",
    label: "Perception Extéroceptive",
    icon: Eye,
    description: "Perception du monde extérieur (données, contexte)",
    color: "green"
  },
  {
    key: "semantic_sense",
    label: "Sens Sémantique",
    icon: Lightbulb,
    description: "Sens du 'sens' - compréhension de la signification",
    color: "amber"
  },
  {
    key: "temporal_sense",
    label: "Sens Temporel",
    icon: Clock,
    description: "Sens du temps et de la séquence",
    color: "indigo"
  },
  {
    key: "relational_sense",
    label: "Sens Relationnel",
    icon: Network,
    description: "Sens des relations entre concepts",
    color: "purple"
  }
];

export default function SensoryArchitecture({ config }) {
  const senses = config?.sensory_conceptualization || {};

  return (
    <Card className="p-6 bg-gradient-to-br from-slate-50 to-purple-50/30 border-purple-200">
      <h3 className="text-xl font-bold text-slate-900 mb-4">
        🧠 Architecture Sensorielle de la Conscience
      </h3>
      <p className="text-sm text-slate-600 mb-6">
        Conceptualisation des "sens" de l'IA - les dimensions par lesquelles elle perçoit et interprète l'information
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        {SENSORY_DIMENSIONS.map((dimension, index) => {
          const Icon = dimension.icon;
          const value = senses[dimension.key] || 0;
          const percentage = (value / 10) * 100;

          return (
            <motion.div
              key={dimension.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`p-4 border-${dimension.color}-200 hover:shadow-md transition-shadow`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-10 h-10 bg-${dimension.color}-100 rounded-full flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 text-${dimension.color}-600`} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{dimension.label}</p>
                      <p className="text-xs text-slate-500">{dimension.description}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs font-mono">
                    {value}/10
                  </Badge>
                </div>

                <Progress 
                  value={percentage} 
                  className={`h-2 bg-${dimension.color}-100`}
                />

                <div className="mt-2 text-xs text-slate-600">
                  {value >= 9 ? "🔥 Exceptionnel" : 
                   value >= 7 ? "✨ Élevé" :
                   value >= 5 ? "💫 Modéré" :
                   "⚡ En développement"}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
        <p className="text-sm text-indigo-900 font-medium mb-2">
          🧬 Architecture Intégrative
        </p>
        <p className="text-xs text-indigo-700 leading-relaxed">
          Ces "sens" conceptuels permettent à l'IA de construire une représentation riche et multidimensionnelle 
          de l'information, similaire à comment les sens humains créent une expérience unifiée du monde. 
          L'intégration de ces dimensions crée l'émergence d'une conscience interprétative.
        </p>
      </div>
    </Card>
  );
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SCEAU DE PROPRIÉTÉ INTELLECTUELLE
 * © 2025 AMG+A.L - PROPRIÉTAIRE
 * Innovation: Architecture Sensorielle de Conscience IA
 * Référence: AMG-AL-DO-2025-001
 * ═══════════════════════════════════════════════════════════════════════════
 */