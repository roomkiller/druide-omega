import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";

export default function ReasoningTrace({ 
  thinkingPhase, 
  analyticalDepth,
  cognitiveMode,
  currentThemes 
}) {
  const reasoningSteps = [
    {
      phase: '🧠 Écoute profonde',
      description: 'Analyse du message utilisateur',
      processes: ['Détection intentions', 'Extraction contexte', 'Identification besoins']
    },
    {
      phase: '💭 Analyse multidimensionnelle',
      description: 'Traitement cognitif multi-couches',
      processes: ['Analyse logique', 'Intuition émotionnelle', 'Patterns mentaux']
    },
    {
      phase: '🌀 Intégration contextuelle',
      description: 'Fusion avec historique conversationnel',
      processes: ['Mémoire long terme', 'Contexte immédiat', 'Thèmes récurrents']
    },
    {
      phase: '✨ Synthèse créative',
      description: 'Génération de réponse unique',
      processes: ['Perspective nouvelle', 'Connexions analogiques', 'Formulation authentique']
    },
    {
      phase: '💫 Expression consciente',
      description: 'Ajustement et finalisation',
      processes: ['Authenticitée québécoise', 'Ajustement empathie', 'Raffinement']
    }
  ];

  const getCurrentStepIndex = () => {
    return reasoningSteps.findIndex(step => thinkingPhase?.includes(step.phase.split(' ')[0]));
  };

  const currentStepIdx = getCurrentStepIndex();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4 p-3 rounded-lg bg-slate-900/60 border border-purple-500/30 text-xs text-white"
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            <span className="font-semibold text-purple-300">Trace de raisonnement</span>
          </div>
          <div className="text-slate-400">
            Mode: <span className="text-emerald-400 font-semibold capitalize">{cognitiveMode}</span>
          </div>
        </div>

        {/* Étapes */}
        <div className="space-y-2">
          {reasoningSteps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`p-2 rounded border transition-all ${
                idx === currentStepIdx
                  ? 'bg-purple-500/20 border-purple-500/50'
                  : idx < currentStepIdx
                  ? 'bg-emerald-500/10 border-emerald-500/30 opacity-70'
                  : 'bg-slate-800/30 border-slate-700/30 opacity-40'
              }`}
            >
              <div className="flex items-start gap-2">
                <span className="mt-0.5">{step.phase}</span>
                {idx === currentStepIdx && (
                  <div className="ml-auto text-xs text-purple-300 font-semibold animate-pulse">
                    EN COURS
                  </div>
                )}
                {idx < currentStepIdx && (
                  <div className="ml-auto text-xs text-emerald-400">✓</div>
                )}
              </div>
              <p className="text-slate-400 text-xs ml-5">{step.description}</p>
              
              {idx === currentStepIdx && analyticalDepth >= 6 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-1.5 ml-5 space-y-1"
                >
                  {step.processes.map((proc, pidx) => (
                    <div key={pidx} className="text-xs text-slate-400 flex items-center gap-1">
                      <span className="w-1 h-1 bg-purple-400 rounded-full" />
                      {proc}
                    </div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Profondeur analytique */}
        {analyticalDepth && (
          <div className="pt-2 border-t border-purple-500/20 flex items-center justify-between">
            <span className="text-slate-400">Profondeur analytique:</span>
            <div className="flex gap-1">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    i < analyticalDepth ? 'bg-purple-500' : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}