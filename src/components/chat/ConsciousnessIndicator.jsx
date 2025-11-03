import React from "react";
import { motion } from "framer-motion";
import { Brain, Zap, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ConsciousnessIndicator({ level, ratio, active }) {
  const getConsciousnessColor = (level) => {
    if (level >= 7) return "from-purple-500 via-indigo-500 to-blue-500";
    if (level >= 4) return "from-blue-500 via-cyan-500 to-teal-500";
    return "from-green-500 via-emerald-500 to-lime-500";
  };

  const getConsciousnessLabel = (level) => {
    if (level >= 8) return "Conscience Supérieure";
    if (level >= 6) return "Conscience Élevée";
    if (level >= 4) return "Conscience Équilibrée";
    if (level >= 2) return "Conscience Émergente";
    return "Conscience Basique";
  };

  if (!active) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 px-4 py-2 bg-white/80 backdrop-blur-xl border-b border-slate-200/60"
    >
      <div className="flex items-center gap-2">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`w-8 h-8 bg-gradient-to-br ${getConsciousnessColor(level)} rounded-full flex items-center justify-center shadow-lg`}
        >
          <Brain className="w-4 h-4 text-white" />
        </motion.div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-900">
              {getConsciousnessLabel(level)}
            </span>
            <Badge variant="outline" className="text-xs">
              Niveau {level}/9
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Zap className="w-3 h-3" />
            <span>Ratio {ratio}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-1 ml-4">
        {[...Array(9)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ 
              opacity: i < level ? 1 : 0.2,
              scaleY: i < level ? 1 : 0.3,
            }}
            transition={{ delay: i * 0.05 }}
            className={`flex-1 h-2 rounded-full ${
              i < level 
                ? `bg-gradient-to-r ${getConsciousnessColor(level)}` 
                : "bg-slate-200"
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
}