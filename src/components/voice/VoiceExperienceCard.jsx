import React from "react";
import { motion } from "framer-motion";
import {
  Check, Circle, Feather, Eye, Heart, Brain, Sparkles, Zap, BookOpen,
  Mountain, Compass, HeartHandshake, Building2, Moon, Target, Smile,
  Infinity as InfinityIcon, Rocket, Calculator, Scale, Leaf
} from "lucide-react";

const ICONS = {
  Feather, Eye, Heart, Brain, Sparkles, Zap, BookOpen, Mountain, Compass,
  HeartHandshake, Building2, Moon, Target, Smile, Infinity: InfinityIcon,
  Rocket, Calculator, Scale, Leaf
};

/** Une expérience sélectionnable — sobre, lisible, clairement exclusive. */
export default function VoiceExperienceCard({ item, isSelected, onSelect }) {
  const Icon = ICONS[item.icon] || Circle;

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`relative text-left p-3 rounded-xl border transition-all ${
        isSelected
          ? `border-transparent bg-gradient-to-br ${item.accent} text-white shadow-lg`
          : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
    >
      <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-white' : 'text-slate-600'}`} />
      <p className={`text-sm font-semibold leading-tight ${isSelected ? 'text-white' : 'text-slate-900'}`}>
        {item.label}
      </p>
      <p className={`text-xs mt-1 leading-snug ${isSelected ? 'text-white/85' : 'text-slate-500'}`}>
        {item.description}
      </p>
      {isSelected && (
        <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white/90 flex items-center justify-center">
          <Check className="w-3 h-3 text-slate-900" />
        </span>
      )}
    </motion.button>
  );
}