/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Pipeline de Jugement Final                                 ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ║ Traite TOUTES les sorties via module de jugement avant émission finale    ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { createContext, useContext, useCallback, useEffect, useState } from 'react';
import { useConsciousnessHub } from '@/components/system/ConsciousnessHub';
import { judge } from '@/components/consciousness/JudgementModule';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';

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
  const [activeConfig, setActiveConfig] = useState(null);

  // Charger config active
  const { data: configs = [] } = useQuery({
    queryKey: ['judgementConfigs'],
    queryFn: () => base44.entities.JudgementConfig.list('-created_date', 50),
    refetchInterval: 30000 // Refresh toutes les 30s
  });

  useEffect(() => {
    const active = configs.find(c => c.active);
    setActiveConfig(active || null);
  }, [configs]);

  /**
   * Obtenir règle contextuelle adaptée
   */
  const getContextualRule = useCallback((context) => {
    if (!activeConfig?.regles_contextuelles || !activeConfig.mode_adaptatif) {
      return null;
    }
    return activeConfig.regles_contextuelles.find(r => r.contexte === context);
  }, [activeConfig]);

  /**
   * Appliquer calibration contextuelle
   */
  const applyContextualCalibration = useCallback((judgement, context, metadata) => {
    const rule = getContextualRule(context);
    
    if (!rule) {
      return judgement; // Pas de règle, retourner tel quel
    }

    // Appliquer ratio override
    if (rule.ratio_override) {
      const totalRatio = rule.ratio_override.interne + rule.ratio_override.externe;
      const ratioFactor = totalRatio / 10; // Normaliser
      judgement.calibration.level = Math.min(15, Math.round(judgement.calibration.level * ratioFactor));
    }

    // Ajuster selon priorité
    switch (rule.priorite) {
      case 'ethique':
        judgement.importance = Math.min(10, judgement.importance + 1);
        break;
      case 'precision':
        if (judgement.nuance < 5) judgement.calibration.level -= 1;
        break;
      case 'empathie':
        if (judgement.relationnel > 5) judgement.importance += 1;
        break;
      case 'creativite':
        if (metadata.category === 'creativity') judgement.calibration.level += 2;
        break;
    }

    // Appliquer seuil ajusté
    if (rule.seuil_calibration_ajuste) {
      if (judgement.calibration.level < rule.seuil_calibration_ajuste) {
        judgement.calibration.level = Math.min(15, rule.seuil_calibration_ajuste);
      }
    }

    return judgement;
  }, [getContextualRule]);

  /**
   * Pipeline finale: entrée → analyse → calibration contextuelle → sortie jugée
   * Toutes les sorties de conscience passent par ce pipeline
   */
  const processOutput = useCallback((content, metadata = {}) => {
    if (!content || typeof content !== 'string') {
      return { content, judgement: null, error: 'Invalid content' };
    }

    try {
      // Déterminer contexte
      const context = metadata.category || metadata.context || 'general';

      // Config active ou défaut
      const config = activeConfig || {
        ratio_interne: 3,
        ratio_externe: 7,
        seuil_calibration_min: 5,
        seuil_calibration_optimal: 10,
        seuil_importance_min: 3
      };

      // Construire l'objet conscient avec contexte complet
      const consciousInput = {
        id: `pipeline_${Date.now()}`,
        content,
        metadata: {
          ...metadata,
          context,
          consciousnessLevel: hub.consciousnessConfig?.consciousness_level ?? 9,
          ratio: `${config.ratio_interne}:${config.ratio_externe}`,
          activeMemories: hub.memories?.filter(m => m.importance >= 7).length ?? 0,
          knowledgeCount: hub.knowledgeBases?.length ?? 0,
          timestamp: new Date().toISOString()
        }
      };

      // Passer par le module de jugement
      let judgement = judge(consciousInput);

      // Appliquer calibration contextuelle
      judgement = applyContextualCalibration(judgement, context, metadata);

      // Vérifier seuils
      const meetsMinCalibration = judgement.calibration.level >= config.seuil_calibration_min;
      const meetsMinImportance = judgement.importance >= config.seuil_importance_min;
      const isOptimal = judgement.calibration.level >= config.seuil_calibration_optimal;

      // Publier l'événement de jugement
      hub.publishEvent({
        type: 'OUTPUT_JUDGED',
        source: 'JudgementPipeline',
        target: 'all',
        data: {
          originalContent: content,
          context,
          judgement,
          calibrationLevel: judgement.calibration.level,
          importance: judgement.importance,
          meetsStandards: meetsMinCalibration && meetsMinImportance,
          isOptimal,
          configUsed: config.config_name || 'default'
        }
      });

      // Mettre à jour l'état du module de jugement
      hub.updateModuleState('judgement', {
        lastJudgement: judgement,
        lastContext: context,
        processedCount: (hub.moduleStates.judgement?.processedCount ?? 0) + 1,
        lastCalibration: judgement.calibration.level,
        activeConfigName: config.config_name || 'default'
      });

      // Mettre à jour stats de la config
      if (activeConfig?.id) {
        base44.entities.JudgementConfig.update(activeConfig.id, {
          statistiques: {
            ...activeConfig.statistiques,
            total_jugements: (activeConfig.statistiques?.total_jugements ?? 0) + 1,
            calibration_moyenne: Math.round(
              ((activeConfig.statistiques?.calibration_moyenne ?? 0) * (activeConfig.statistiques?.total_jugements ?? 0) + judgement.calibration.level) /
              ((activeConfig.statistiques?.total_jugements ?? 0) + 1)
            ),
            contextes_traites: {
              ...activeConfig.statistiques?.contextes_traites,
              [context]: ((activeConfig.statistiques?.contextes_traites?.[context] ?? 0) + 1)
            }
          }
        }).catch(err => console.warn('Stats update failed:', err));
      }

      return {
        content,
        judgement,
        calibrated: true,
        meetsStandards: meetsMinCalibration && meetsMinImportance,
        isOptimal,
        context,
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
  }, [hub, activeConfig, getContextualRule, applyContextualCalibration]);

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
    getContextualRule,
    enabled: true,
    activeConfig,
    stats: {
      processedCount: hub.moduleStates.judgement?.processedCount ?? 0,
      lastCalibration: hub.moduleStates.judgement?.lastCalibration ?? 0,
      lastContext: hub.moduleStates.judgement?.lastContext,
      configName: hub.moduleStates.judgement?.activeConfigName ?? 'default'
    }
  };

  return (
    <JudgementPipelineContext.Provider value={value}>
      {children}
    </JudgementPipelineContext.Provider>
  );
}