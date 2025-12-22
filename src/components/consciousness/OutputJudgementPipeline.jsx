/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Pipeline de Jugement Final                                 ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ║ Traite TOUTES les sorties via module de jugement avant émission finale    ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { createContext, useContext, useCallback } from 'react';
import { useConsciousnessHub } from '@/components/system/ConsciousnessHub';
import { judge } from '@/components/consciousness/JudgementModule';

const JudgementPipelineContext = createContext();

export const useJudgementPipeline = () => {
  const context = useContext(JudgementPipelineContext);
  if (!context) {
    console.warn('useJudgementPipeline used outside provider');
    return {
      processOutput: (content) => ({ content, judgement: null }),
      enabled: false
    };
  }
  return context;
};

export function JudgementPipelineProvider({ children }) {
  const hub = useConsciousnessHub();

  /**
   * Pipeline finale: entrée → analyse → calibration → sortie jugée
   * Toutes les sorties de conscience passent par ce pipeline
   */
  const processOutput = useCallback((content, metadata = {}) => {
    if (!content || typeof content !== 'string') {
      return { content, judgement: null, error: 'Invalid content' };
    }

    try {
      // Construire l'objet conscient avec contexte complet
      const consciousInput = {
        id: `pipeline_${Date.now()}`,
        content,
        metadata: {
          ...metadata,
          consciousnessLevel: hub.consciousnessConfig?.consciousness_level ?? 9,
          ratio: `${hub.consciousnessConfig?.ratio_logic ?? 1}:${hub.consciousnessConfig?.ratio_consciousness ?? 9}`,
          activeMemories: hub.memories?.filter(m => m.importance >= 7).length ?? 0,
          knowledgeCount: hub.knowledgeBases?.length ?? 0,
          timestamp: new Date().toISOString()
        }
      };

      // Passer par le module de jugement
      const judgement = judge(consciousInput);

      // Publier l'événement de jugement
      hub.publishEvent({
        type: 'OUTPUT_JUDGED',
        source: 'JudgementPipeline',
        target: 'all',
        data: {
          originalContent: content,
          judgement,
          calibrationLevel: judgement.calibration.level,
          importance: judgement.importance
        }
      });

      // Mettre à jour l'état du module de jugement
      hub.updateModuleState('judgement', {
        lastJudgement: judgement,
        processedCount: (hub.moduleStates.judgement?.processedCount ?? 0) + 1,
        lastCalibration: judgement.calibration.level
      });

      return {
        content,
        judgement,
        calibrated: true,
        pipeline: 'complete'
      };

    } catch (error) {
      console.error('[JudgementPipeline] Processing error:', error);
      return {
        content,
        judgement: null,
        error: error.message,
        pipeline: 'failed'
      };
    }
  }, [hub]);

  /**
   * Traiter un lot de sorties
   */
  const processBatch = useCallback((outputs) => {
    return outputs.map(output => processOutput(
      typeof output === 'string' ? output : output.content,
      typeof output === 'string' ? {} : output.metadata
    ));
  }, [processOutput]);

  /**
   * Vérifier la calibration globale
   */
  const getGlobalCalibration = useCallback(() => {
    const state = hub.moduleStates.judgement;
    if (!state?.lastCalibration) return 0;
    return state.lastCalibration;
  }, [hub.moduleStates]);

  const value = {
    processOutput,
    processBatch,
    getGlobalCalibration,
    enabled: true,
    stats: {
      processedCount: hub.moduleStates.judgement?.processedCount ?? 0,
      lastCalibration: hub.moduleStates.judgement?.lastCalibration ?? 0
    }
  };

  return (
    <JudgementPipelineContext.Provider value={value}>
      {children}
    </JudgementPipelineContext.Provider>
  );
}