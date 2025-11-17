/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Intelligence Mode Indicator                                ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { useIntelligence } from "./IntelligenceManager";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Brain } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const INTELLIGENCE_DISPLAY = {
  logico_mathematique: { label: "Logico-Math", color: "from-blue-500 to-cyan-600", icon: "🔢" },
  verbo_linguistique: { label: "Verbo-Ling", color: "from-purple-500 to-pink-600", icon: "✍️" },
  musicale_rythmique: { label: "Musicale", color: "from-rose-500 to-orange-600", icon: "🎵" },
  corporelle_kinesthesique: { label: "Kinesthésique", color: "from-green-500 to-emerald-600", icon: "🤸" },
  visuelle_spatiale: { label: "Visuo-Spatiale", color: "from-indigo-500 to-blue-600", icon: "🎨" },
  interpersonnelle: { label: "Interpersonnelle", color: "from-amber-500 to-yellow-600", icon: "👥" },
  intrapersonnelle: { label: "Intrapersonnelle", color: "from-violet-500 to-purple-600", icon: "🧘" },
  naturaliste: { label: "Naturaliste", color: "from-lime-500 to-green-600", icon: "🌿" },
  existentielle: { label: "Existentielle", color: "from-slate-600 to-indigo-800", icon: "∞" }
};

export default function IntelligenceIndicator({ compact = false }) {
  const { activeIntelligence, clearIntelligence } = useIntelligence();

  if (!activeIntelligence) return null;

  const display = INTELLIGENCE_DISPLAY[activeIntelligence.type];
  if (!display) return null;

  if (compact) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
        >
          <Badge className={`bg-gradient-to-r ${display.color} text-white shadow-lg`}>
            <Brain className="w-3 h-3 mr-1" />
            {display.icon} {display.label}
          </Badge>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        className="flex items-center gap-2"
      >
        <div className={`bg-gradient-to-r ${display.color} text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2`}>
          <span className="text-lg">{display.icon}</span>
          <span className="font-semibold text-sm">{display.label}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearIntelligence}
            className="h-6 w-6 p-0 hover:bg-white/20 rounded-full"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}