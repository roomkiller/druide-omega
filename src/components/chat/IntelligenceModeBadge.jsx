/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Intelligence Mode Badge                                    ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Calculator,
  MessageCircle,
  Music,
  Activity,
  Shapes,
  Users,
  User,
  Leaf,
  Infinity
} from "lucide-react";

const INTELLIGENCE_CONFIG = {
  logico_mathematique: {
    label: "Logico-Math",
    icon: Calculator,
    color: "from-blue-500 to-cyan-600",
    bgColor: "bg-blue-50",
    textColor: "text-blue-700"
  },
  verbo_linguistique: {
    label: "Verbo-Ling",
    icon: MessageCircle,
    color: "from-purple-500 to-pink-600",
    bgColor: "bg-purple-50",
    textColor: "text-purple-700"
  },
  musicale_rythmique: {
    label: "Musical",
    icon: Music,
    color: "from-rose-500 to-orange-600",
    bgColor: "bg-rose-50",
    textColor: "text-rose-700"
  },
  corporelle_kinesthesique: {
    label: "Corporelle",
    icon: Activity,
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-green-50",
    textColor: "text-green-700"
  },
  visuelle_spatiale: {
    label: "Visuelle",
    icon: Shapes,
    color: "from-indigo-500 to-blue-600",
    bgColor: "bg-indigo-50",
    textColor: "text-indigo-700"
  },
  interpersonnelle: {
    label: "Sociale",
    icon: Users,
    color: "from-amber-500 to-yellow-600",
    bgColor: "bg-amber-50",
    textColor: "text-amber-700"
  },
  intrapersonnelle: {
    label: "Introspective",
    icon: User,
    color: "from-violet-500 to-purple-600",
    bgColor: "bg-violet-50",
    textColor: "text-violet-700"
  },
  naturaliste: {
    label: "Naturaliste",
    icon: Leaf,
    color: "from-lime-500 to-green-600",
    bgColor: "bg-lime-50",
    textColor: "text-lime-700"
  },
  existentielle: {
    label: "Existentielle",
    icon: Infinity,
    color: "from-slate-600 to-indigo-800",
    bgColor: "bg-slate-50",
    textColor: "text-slate-700"
  }
};

export default function IntelligenceModeBadge({ intelligenceType }) {
  if (!intelligenceType) return null;

  const config = INTELLIGENCE_CONFIG[intelligenceType];
  if (!config) return null;

  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-2"
    >
      <Badge className={`${config.bgColor} ${config.textColor} border-none px-3 py-1.5 flex items-center gap-2 text-xs sm:text-sm`}>
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        >
          <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
        </motion.div>
        <span className="font-semibold hidden sm:inline">{config.label}</span>
        <span className="font-semibold sm:hidden">🎯</span>
      </Badge>
      <span className="text-xs text-slate-500 hidden md:inline">Mode actif</span>
    </motion.div>
  );
}