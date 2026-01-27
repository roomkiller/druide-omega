/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ Cascade Process Tracker - Affiche progression du traitement multi-modale   ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, AlertCircle, Zap, Search, Image, Layout, Brain, Sparkles, Shuffle, GitMerge, BarChart3, Loader } from 'lucide-react';

const ProcessTracker = ({ 
  cascadeData, 
  isProcessing, 
  intents,
  richness 
}) => {
  // Mapping des intents à icônes et labels
  const processMap = {
    searchWeb: {
      icon: Search,
      label: 'Recherche',
      color: 'from-blue-500 to-cyan-500',
      position: 0
    },
    generateImages: {
      icon: Image,
      label: 'Visuels',
      color: 'from-purple-500 to-pink-500',
      position: 1
    },
    generateStructure: {
      icon: Layout,
      label: 'Structure',
      color: 'from-indigo-500 to-purple-500',
      position: 2
    },
    analyzeDeep: {
      icon: Brain,
      label: 'Analyse',
      color: 'from-amber-500 to-orange-500',
      position: 3
    },
    brainstorm: {
      icon: Sparkles,
      label: 'Créativité',
      color: 'from-rose-500 to-pink-500',
      position: 4
    },
    transform: {
      icon: Shuffle,
      label: 'Transform',
      color: 'from-green-500 to-emerald-500',
      position: 5
    },
    crossModalSynthesis: {
      icon: GitMerge,
      label: 'Synthèse',
      color: 'from-violet-500 to-purple-500',
      position: 6
    },
    nuancedComparison: {
      icon: BarChart3,
      label: 'Comparaison',
      color: 'from-slate-500 to-blue-500',
      position: 7
    }
  };

  // Déterminer les étapes actives
  const activeSteps = Object.entries(intents)
    .filter(([key, value]) => value === true && processMap[key])
    .map(([key]) => key);

  // Déterminer le statut de chaque étape
  const getStepStatus = (stepKey) => {
    if (!activeSteps.includes(stepKey)) return 'inactive';
    
    if (!isProcessing) return 'completed';
    
    if (cascadeData) {
      if (cascadeData[stepKey]) return 'completed';
      if (activeSteps[0] === stepKey) return 'processing';
    }
    
    return 'pending';
  };

  if (!isProcessing && !cascadeData) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="w-72 bg-gradient-to-b from-slate-900/80 via-slate-800/60 to-slate-900/40 backdrop-blur-xl border-l border-slate-700/50 overflow-y-auto space-y-1 p-4"
    >
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-widest mb-1 flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          Cascade Processing
        </h3>
        <div className="h-px bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-transparent" />
      </div>

      {/* Richness Badge */}
      {richness && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 px-3 py-1.5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-full"
        >
          <p className="text-xs text-purple-300 font-medium">
            {richness === 'minimal' && '• Légère'}
            {richness === 'light' && '• Simple'}
            {richness === 'moderate' && '• Modérée'}
            {richness === 'rich' && '⚡ Riche'}
            {richness === 'very_rich' && '⚡⚡ Très Riche'}
          </p>
        </motion.div>
      )}

      {/* Process Steps */}
      <div className="space-y-2">
        <AnimatePresence>
          {activeSteps.map((stepKey, idx) => {
            const config = processMap[stepKey];
            const Icon = config.icon;
            const status = getStepStatus(stepKey);

            return (
              <motion.div
                key={stepKey}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: idx * 0.1 }}
                className={`
                  relative group px-3 py-2.5 rounded-lg transition-all duration-300
                  ${status === 'processing' 
                    ? 'bg-gradient-to-r ' + config.color + ' shadow-lg shadow-purple-500/30' 
                    : status === 'completed'
                    ? 'bg-slate-700/40 border border-green-500/40'
                    : status === 'pending'
                    ? 'bg-slate-700/20 border border-slate-600/30'
                    : 'opacity-40'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  {/* Icon avec animation */}
                  <motion.div
                    animate={status === 'processing' ? { rotate: 360 } : {}}
                    transition={status === 'processing' ? { duration: 2, repeat: Infinity, ease: 'linear' } : {}}
                    className="flex-shrink-0"
                  >
                    {status === 'processing' ? (
                      <Loader className="w-4 h-4 text-white" />
                    ) : status === 'completed' ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', bounce: 0.5 }}
                      >
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      </motion.div>
                    ) : status === 'pending' ? (
                      <Circle className="w-4 h-4 text-slate-500" />
                    ) : (
                      <Icon className="w-4 h-4 text-slate-400" />
                    )}
                  </motion.div>

                  {/* Label */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold truncate
                      ${status === 'processing' ? 'text-white' 
                        : status === 'completed' ? 'text-green-300'
                        : status === 'pending' ? 'text-slate-400'
                        : 'text-slate-500'}
                    `}>
                      {config.label}
                    </p>
                  </div>

                  {/* Status indicator pulse */}
                  {status === 'processing' && (
                    <motion.div
                      animate={{ opacity: [0.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="flex-shrink-0"
                    >
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </motion.div>
                  )}
                </div>

                {/* Progress bar pour processing */}
                {status === 'processing' && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity }}
                    className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent origin-left"
                    style={{ width: '100%' }}
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Completion Stats */}
      {cascadeData && !isProcessing && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 pt-4 border-t border-slate-700/30 space-y-2"
        >
          <div className="text-xs text-slate-400 space-y-1">
            {cascadeData.search && (
              <p>✓ <span className="text-green-400">{cascadeData.search.findings?.length || 0}</span> résultats trouvés</p>
            )}
            {cascadeData.images && (
              <p>✓ <span className="text-green-400">{cascadeData.images.images?.length || 0}</span> images générées</p>
            )}
            {cascadeData.structure && (
              <p>✓ Structure: <span className="text-green-400">{cascadeData.structure.type}</span></p>
            )}
            {cascadeData.analysis && (
              <p>✓ Analyse complétée</p>
            )}
          </div>
          
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="h-1 bg-gradient-to-r from-green-500/20 via-green-500 to-green-500/20 rounded-full origin-left"
          />
          
          <p className="text-xs text-green-400 font-semibold">
            ✓ Cascade complétée
          </p>
        </motion.div>
      )}

      {/* Processing indicator */}
      {isProcessing && (
        <motion.div
          animate={{ opacity: [0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="mt-4 pt-4 border-t border-slate-700/30 text-xs text-slate-400 text-center"
        >
          Processing...
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProcessTracker;