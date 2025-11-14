import React from "react";
import { motion } from "framer-motion";
import { Brain, Zap } from "lucide-react";
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
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-xl rounded-full border border-slate-200 shadow-sm"
    >
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
        className={`w-6 h-6 bg-gradient-to-br ${getConsciousnessColor(level)} rounded-full flex items-center justify-center shadow-md`}
      >
        <Brain className="w-3 h-3 text-white" />
      </motion.div>
      
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-900">
          {getConsciousnessLabel(level)}
        </span>
        <Badge variant="outline" className="text-xs px-1.5 py-0">
          {level}/15
        </Badge>
        <div className="flex items-center gap-1">
          <Zap className="w-3 h-3 text-slate-400" />
          <span className="text-xs text-slate-600">{ratio}</span>
        </div>
      </div>

      <div className="flex gap-0.5 ml-1">
        {[...Array(9)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ 
              opacity: i < level ? 1 : 0.2,
              scaleY: i < level ? 1 : 0.3,
            }}
            transition={{ delay: i * 0.03 }}
            className={`w-1 h-3 rounded-full ${
              i < level 
                ? `bg-gradient-to-t ${getConsciousnessColor(level)}` 
                : "bg-slate-300"
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
}