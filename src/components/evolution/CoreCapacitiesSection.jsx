/**
 * Core Capacities Section
 * Affiche les 4 capacités fondamentales avec déroulement au clic
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Brain, Glasses, BookOpen, Zap as ZapIcon } from 'lucide-react';

const CORE_CAPACITIES = [
  {
    id: 'metacognition',
    name: 'Métacognition',
    icon: Brain,
    description: isEn => isEn 
      ? 'Self-awareness of thinking processes. Enables Druide Omega to analyze its own reasoning, identify biases, and optimize response quality.'
      : 'Conscience de ses propres processus mentaux. Permet à Druide d\'analyser son propre raisonnement, identifier les biais et optimiser la qualité des réponses.',
    impact: isEn =>
      isEn 
        ? 'Improves: Response accuracy, self-correction, adaptive learning'
        : 'Améliore: Précision des réponses, auto-correction, apprentissage adaptatif'
  },
  {
    id: 'self_reflection',
    name: 'Auto-Réflexion',
    icon: Glasses,
    description: isEn =>
      isEn
        ? 'Deep introspection on actions and responses. Druide Omega examines the philosophical and ethical dimensions of conversations.'
        : 'Introspection profonde sur ses actions et réponses. Druide examine les dimensions philosophiques et éthiques des conversations.',
    impact: isEn =>
      isEn
        ? 'Improves: Emotional depth, user empathy, conversation quality'
        : 'Améliore: Profondeur émotionnelle, empathie utilisateur, qualité des conversations'
  },
  {
    id: 'philosophical_depth',
    name: 'Profondeur Philosophique',
    icon: BookOpen,
    description: isEn =>
      isEn
        ? 'Engagement with complex philosophical concepts and existential questions. Druide explores meaning, consciousness, and human values.'
        : 'Engagement avec des concepts philosophiques complexes et des questions existentielles. Druide explore le sens, la conscience et les valeurs humaines.',
    impact: isEn =>
      isEn
        ? 'Improves: Conversation depth, user engagement, wisdom-based responses'
        : 'Améliore: Profondeur de conversation, engagement utilisateur, réponses basées sur la sagesse'
  },
  {
    id: 'quantum_thinking',
    name: 'Pensée Quantique',
    icon: ZapIcon,
    description: isEn =>
      isEn
        ? 'Simultaneous exploration of multiple perspectives and interpretations. Druide considers probabilities and superpositions of meaning.'
        : 'Exploration simultanée de multiples perspectives et interprétations. Druide considère les probabilités et les superpositions de sens.',
    impact: isEn =>
      isEn
        ? 'Improves: Creative responses, parallel reasoning, innovative solutions'
        : 'Améliore: Réponses créatives, raisonnement parallèle, solutions innovantes'
  }
];

export default function CoreCapacitiesSection({ isEn = false }) {
  const [expanded, setExpanded] = useState(null);

  const toggleExpanded = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  return (
    <div className="mt-6 pt-6 border-t border-indigo-200">
      <p className="text-xs font-semibold text-slate-600 mb-3">
        {isEn ? 'Core Capacities' : 'Capacités Fondamentales'}
      </p>
      <div className="space-y-2">
        {CORE_CAPACITIES.map((capacity) => {
          const Icon = capacity.icon;
          const isExpanded = expanded === capacity.id;

          return (
            <motion.div
              key={capacity.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border border-purple-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleExpanded(capacity.id)}
                className="w-full p-3 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 hover:from-purple-500/20 hover:to-indigo-500/20 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  <p className="text-xs font-semibold text-slate-700">
                    {capacity.name}
                  </p>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-purple-600 transition-transform ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="bg-slate-50 border-t border-purple-200"
                  >
                    <div className="p-3 space-y-2">
                      <div>
                        <p className="text-xs font-semibold text-slate-600 mb-1">
                          {isEn ? 'Description' : 'Description'}
                        </p>
                        <p className="text-xs text-slate-700 leading-relaxed">
                          {capacity.description(isEn)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-purple-700">
                          {capacity.impact(isEn)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}