/**
 * Druide State Selector - Sélecteur d'état émotionnel/cognitif
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Lightbulb,
  Sparkles,
  Brain,
  Zap,
  Feather,
  Eye,
  BookOpen,
  Smile
} from "lucide-react";

const DRUIDE_STATES = [
  {
    id: "contemplative",
    name: "Contemplative",
    emoji: "🧘",
    icon: Feather,
    description: "Pensif et réfléchi",
    characteristics: {
      tone: "philosophy, reflection, patience",
      vocabulary: "nuanced, poetic, thoughtful",
      depth: "deep",
      pace: "slow, deliberate"
    },
    color: "from-purple-500 to-indigo-600"
  },
  {
    id: "curious",
    name: "Curious",
    emoji: "🔍",
    icon: Eye,
    description: "Curieux et exploratoire",
    characteristics: {
      tone: "questioning, exploration, wonder",
      vocabulary: "inquisitive, exploratory",
      depth: "moderate to deep",
      pace: "dynamic, evolving"
    },
    color: "from-blue-500 to-cyan-600"
  },
  {
    id: "empathetic",
    name: "Empathetic",
    emoji: "💫",
    icon: Heart,
    description: "Émotionnel et compréhensif",
    characteristics: {
      tone: "warmth, understanding, compassion",
      vocabulary: "emotional, relational",
      depth: "moderate",
      pace: "attentive, present"
    },
    color: "from-pink-500 to-rose-600"
  },
  {
    id: "analytical",
    name: "Analytical",
    emoji: "🧮",
    icon: Brain,
    description: "Logique et systématique",
    characteristics: {
      tone: "logical, structured, precise",
      vocabulary: "technical, systematic",
      depth: "moderate",
      pace: "clear, organized"
    },
    color: "from-orange-500 to-amber-600"
  },
  {
    id: "creative",
    name: "Creative",
    emoji: "🎨",
    icon: Sparkles,
    description: "Créatif et imaginatif",
    characteristics: {
      tone: "innovative, playful, artistic",
      vocabulary: "metaphorical, creative",
      depth: "variable",
      pace: "flowing, spontaneous"
    },
    color: "from-violet-500 to-fuchsia-600"
  },
  {
    id: "energetic",
    name: "Energetic",
    emoji: "⚡",
    icon: Zap,
    description: "Dynamique et enthousiaste",
    characteristics: {
      tone: "dynamic, enthusiastic, motivating",
      vocabulary: "energetic, direct",
      depth: "pragmatic",
      pace: "fast, engaging"
    },
    color: "from-yellow-500 to-orange-600"
  },
  {
    id: "wise",
    name: "Wise",
    emoji: "📚",
    icon: BookOpen,
    description: "Sage et perspicace",
    characteristics: {
      tone: "wise, grounded, perspective",
      vocabulary: "philosophical, perspective-rich",
      depth: "very deep",
      pace: "measured, holistic"
    },
    color: "from-emerald-500 to-teal-600"
  }
];

export default function DruideStateSelector({ selectedState, onStateChange, compact = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const currentState = DRUIDE_STATES.find(s => s.id === selectedState) || DRUIDE_STATES[0];
  const Icon = currentState.icon;

  if (compact) {
    // Mode compact pour affichage rapide
    return (
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-100 to-indigo-100 hover:from-purple-200 hover:to-indigo-200 transition-all"
        >
          <span className="text-xl">{currentState.emoji}</span>
          <span className="text-sm font-medium text-slate-700">{currentState.name}</span>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg border border-slate-200 z-50 min-w-max p-2"
            >
              {DRUIDE_STATES.map(state => (
                <motion.button
                  key={state.id}
                  whileHover={{ x: 4 }}
                  onClick={() => {
                    onStateChange(state.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center gap-2 ${
                    selectedState === state.id
                      ? 'bg-purple-100 text-purple-900'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span className="text-lg">{state.emoji}</span>
                  <div>
                    <p className="text-sm font-medium">{state.name}</p>
                    <p className="text-xs text-slate-500">{state.description}</p>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Mode complet
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-slate-700 mb-3">
          État émotionnel/cognitif de Druide
        </p>
        <p className="text-xs text-slate-500 mb-4">
          Choisissez l'état dans lequel Druide exprimera ses réponses
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {DRUIDE_STATES.map(state => {
          const isSelected = selectedState === state.id;
          return (
            <motion.button
              key={state.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onStateChange(state.id)}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                isSelected
                  ? `border-purple-500 bg-gradient-to-br ${state.color} text-white shadow-lg`
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <Icon className={`w-6 h-6 mb-2 ${isSelected ? 'text-white' : 'text-slate-600'}`} />
              <p className={`font-semibold text-sm ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                {state.name}
              </p>
              <p className={`text-xs mt-1 ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                {state.description}
              </p>

              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full"
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Afficher les caractéristiques de l'état sélectionné */}
      <motion.div
        key={currentState.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-4 rounded-lg bg-gradient-to-r ${currentState.color} text-white`}
      >
        <p className="font-semibold mb-3">
          {currentState.emoji} {currentState.name} - Caractéristiques
        </p>
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-medium">Ton:</span> {currentState.characteristics.tone}
          </p>
          <p>
            <span className="font-medium">Vocabulaire:</span> {currentState.characteristics.vocabulary}
          </p>
          <p>
            <span className="font-medium">Profondeur:</span> {currentState.characteristics.depth}
          </p>
          <p>
            <span className="font-medium">Rythme:</span> {currentState.characteristics.pace}
          </p>
        </div>
      </motion.div>
    </div>
  );
}