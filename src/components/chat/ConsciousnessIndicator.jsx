import React from "react";
import { motion } from "framer-motion";
import { Brain } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ConsciousnessLevelTooltip from "@/components/chat/ConsciousnessLevelTooltip";

export default function ConsciousnessIndicator({ level, ratio, active }) {
  const getConsciousnessColor = (level) => {
    if (level >= 7) return "from-purple-500 via-indigo-500 to-blue-500";
    if (level >= 4) return "from-blue-500 via-cyan-500 to-teal-500";
    return "from-green-500 via-emerald-500 to-lime-500";
  };

  // Indicateur masqué à la demande de l'architecte
  return null;

  return (
    <ConsciousnessLevelTooltip level={level} ratio={ratio}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="inline-flex items-center gap-1.5 px-2 py-1 bg-white/90 backdrop-blur-xl rounded-full border border-slate-200 shadow-sm"
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
          className={`w-5 h-5 bg-gradient-to-br ${getConsciousnessColor(level)} rounded-full flex items-center justify-center shadow-md`}
        >
          <Brain className="w-2.5 h-2.5 text-white" />
        </motion.div>

        <Badge variant="outline" className="text-[10px] px-1.5 py-0 hidden sm:inline-flex">
          {level}/15
        </Badge>

        <span className="text-[10px] text-slate-600 hidden sm:inline">{ratio}</span>
      </motion.div>
    </ConsciousnessLevelTooltip>
  );
}