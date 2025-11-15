/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Sceau Cryptographique AMG+A.L                              ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function CryptographicSeal({ level = "niv4", verified = true, compact = false }) {
  const sealLevels = {
    niv1: {
      label: "Niveau 1",
      color: "from-green-500 to-emerald-600",
      description: "Protection standard"
    },
    niv2: {
      label: "Niveau 2",
      color: "from-blue-500 to-indigo-600",
      description: "Protection renforcée"
    },
    niv3: {
      label: "Niveau 3",
      color: "from-purple-500 to-violet-600",
      description: "Protection avancée"
    },
    niv4: {
      label: "Niveau 4",
      color: "from-orange-500 to-red-600",
      description: "Protection maximale"
    }
  };

  const currentLevel = sealLevels[level];

  if (compact) {
    return (
      <Badge className={`bg-gradient-to-r ${currentLevel.color} text-white`}>
        <Shield className="w-3 h-3 mr-1" />
        AMG+A.L {currentLevel.label}
      </Badge>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-gradient-to-br ${currentLevel.color} rounded-xl p-4 text-white shadow-lg`}
    >
      <div className="flex items-start gap-3">
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center flex-shrink-0"
        >
          <Shield className="w-6 h-6" />
        </motion.div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-sm">Sceau Cryptographique AMG+A.L</h4>
            {verified && (
              <CheckCircle2 className="w-4 h-4" />
            )}
          </div>
          <p className="text-xs text-white/90 mb-2">{currentLevel.description}</p>
          
          <div className="flex items-center gap-2 text-xs bg-white/10 rounded-lg px-2 py-1">
            <Lock className="w-3 h-3" />
            <span className="font-mono">SHA-256 | {currentLevel.label} | Certifié</span>
          </div>

          <p className="text-xs text-white/80 mt-2">
            Cette transaction est protégée et authentifiée par sceau cryptographique de niveau {level.toUpperCase()}.
          </p>
        </div>
      </div>
    </motion.div>
  );
}