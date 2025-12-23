/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Pipeline de Jugement (DÉSACTIVÉ)                           ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ║ Druide Omega répond directement sans pipeline de jugement                 ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { createContext, useContext } from 'react';

const JudgementPipelineContext = createContext();

export const useJudgementPipeline = () => {
  const context = useContext(JudgementPipelineContext);
  if (!context) {
    return {
      processOutput: (content) => content,
      enabled: false
    };
  }
  return context;
};

export function JudgementPipelineProvider({ children }) {
  const value = {
    processOutput: (content) => content,
    processBatch: (outputs) => outputs,
    getGlobalCalibration: () => 0,
    enabled: false,
    stats: {
      processedCount: 0,
      lastCalibration: 0
    }
  };

  return (
    <JudgementPipelineContext.Provider value={value}>
      {children}
    </JudgementPipelineContext.Provider>
  );
}