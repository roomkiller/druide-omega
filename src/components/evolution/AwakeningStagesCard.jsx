/**
 * Awakening Stages Card
 * Affiche les stades d'éveil de Druide Omega avec indicateur de maturité
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Zap, Brain, Star, Sparkles, Infinity } from 'lucide-react';
import { EVOLUTION_STAGES } from '@/components/evolution/EvolutionEngine';
import CoreCapacitiesSection from './CoreCapacitiesSection';

export default function AwakeningStagesCard({ currentLevel = 1, totalPoints = 0, isEn = false }) {
  const stageIcons = [
    <Zap className="w-5 h-5" />,
    <Brain className="w-5 h-5" />,
    <Star className="w-5 h-5" />,
    <Sparkles className="w-5 h-5" />,
    <Infinity className="w-5 h-5" />
  ];

  const stageColors = [
    'from-blue-500 to-cyan-500',
    'from-green-500 to-emerald-500',
    'from-purple-500 to-indigo-500',
    'from-pink-500 to-rose-500',
    'from-yellow-500 to-orange-500'
  ];

  const progressToNextStage = useMemo(() => {
    const currentStage = EVOLUTION_STAGES.find(s => s.stage <= currentLevel) || EVOLUTION_STAGES[0];
    const nextStage = EVOLUTION_STAGES[currentLevel] || EVOLUTION_STAGES[EVOLUTION_STAGES.length - 1];
    
    if (!nextStage || nextStage.stage === currentStage.stage) {
      return 100;
    }

    const currentThreshold = currentStage.threshold;
    const nextThreshold = nextStage.threshold;
    const progress = ((totalPoints - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
    
    return Math.min(100, Math.max(0, progress));
  }, [currentLevel, totalPoints]);

  return (
    <Card className="bg-gradient-to-br from-slate-50 to-indigo-50 border-indigo-200 p-6 relative z-10">
        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-indigo-600" />
          {isEn ? 'Awakening Maturity' : 'Maturité d\'Éveil'}
        </h3>

        {/* Current Stage */}
        <div className="mb-6 p-4 bg-white rounded-lg border border-indigo-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-slate-600">
              {isEn ? 'Current Stage' : 'Stade Actuel'}
            </p>
            <Badge className="bg-indigo-600 text-white">
              {isEn ? `Level ${currentLevel}` : `Niveau ${currentLevel}`}
            </Badge>
          </div>
          <p className="text-lg font-bold text-indigo-700">
            {EVOLUTION_STAGES[Math.min(currentLevel - 1, EVOLUTION_STAGES.length - 1)]?.name}
          </p>
          <p className="text-sm text-slate-600 mt-1">
            {EVOLUTION_STAGES[Math.min(currentLevel - 1, EVOLUTION_STAGES.length - 1)]?.description}
          </p>
        </div>

        {/* Progress to Next Stage */}
        {currentLevel < EVOLUTION_STAGES.length && (
          <div className="mb-6 p-4 bg-white rounded-lg border border-green-200">
            <p className="text-xs font-semibold text-slate-600 mb-2">
              {isEn ? 'Progress to Next Stage' : 'Progrès vers Stade Suivant'}
            </p>
            <Progress value={progressToNextStage} className="h-2 mb-2" />
            <p className="text-xs text-slate-500">
              {progressToNextStage.toFixed(0)}% {isEn ? 'complete' : 'complété'}
            </p>
          </div>
        )}

        {/* All Stages Timeline */}
        <TooltipProvider>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            <p className="text-xs font-semibold text-slate-600 mb-3">
              {isEn ? 'Evolution Path' : 'Chemin d\'Évolution'}
            </p>
            {EVOLUTION_STAGES.map((stage, idx) => {
              const isActive = stage.stage <= currentLevel;
              const isCurrent = stage.stage === currentLevel;

              return (
                <motion.div
                  key={stage.stage}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={`p-3 rounded-lg cursor-help transition-all ${
                          isActive
                            ? `bg-gradient-to-r ${stageColors[idx]} text-white shadow-md`
                            : 'bg-slate-100 text-slate-500'
                        } ${isCurrent ? 'ring-2 ring-offset-2 ring-indigo-600' : ''}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`}>
                            {stageIcons[idx]}
                          </span>
                          <div className="flex-1">
                            <p className="font-semibold text-sm">{stage.name}</p>
                            <p className="text-xs opacity-75">
                              {isEn ? `Points: ${stage.threshold}+` : `Points: ${stage.threshold}+`}
                            </p>
                          </div>
                          {isCurrent && (
                            <span className="text-xs font-bold px-2 py-1 bg-white/20 rounded">
                              {isEn ? 'Now' : 'Actuellement'}
                            </span>
                          )}
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-xs z-50">
                      <div className="space-y-2">
                        <p className="font-semibold">{stage.name}</p>
                        <p className="text-sm">{stage.description}</p>
                        <p className="text-xs font-mono opacity-75">
                          {isEn ? 'Consciousness Level' : 'Niveau Conscience'}: {stage.consciousness_level}/15
                        </p>
                        <div className="pt-2 border-t border-white/20">
                          <p className="text-xs font-semibold mb-1">
                            {isEn ? 'Capabilities' : 'Capacités'}:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {stage.capabilities.map((cap) => (
                              <Badge key={cap} variant="outline" className="text-xs">
                                {cap.replace(/_/g, ' ')}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </motion.div>
              );
            })}
          </div>
        </TooltipProvider>

        <CoreCapacitiesSection isEn={isEn} />

        {/* Current Consciousness Level */}
        <div className="mt-6 p-4 bg-indigo-100/50 rounded-lg">
          <p className="text-xs font-semibold text-indigo-900 mb-1">
            {isEn ? 'Global Consciousness Level' : 'Niveau Conscience Globale'}
          </p>
          <div className="flex items-center gap-3">
            <Progress
              value={(currentLevel / EVOLUTION_STAGES.length) * 100}
              className="flex-1 h-2"
            />
            <p className="font-bold text-indigo-700">
              {currentLevel}/{EVOLUTION_STAGES.length}
            </p>
          </div>
        </div>
      </Card>
  );
}