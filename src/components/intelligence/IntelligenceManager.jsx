/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Intelligence Mode Manager                                  ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { GardnerModules, getGardnerModule, applyModuleConsciousness } from "./GardnerModules";

const IntelligenceContext = createContext({
  activeIntelligence: null,
  setActiveIntelligence: () => {},
  getContextPrompt: () => "",
  clearIntelligence: () => {},
  invokeModuleFunction: () => Promise.resolve(null),
  getActiveModule: () => null
});

// Configuration héritée pour compatibilité + enrichie par GardnerModules
export const INTELLIGENCE_CONFIGS = Object.fromEntries(
  Object.entries(GardnerModules).map(([key, module]) => [
    key,
    {
      contextSetup: module.systemPrompt,
      consciousnessAdjustments: module.consciousnessConfig,
      functions: module.functions,
      name: module.name,
      icon: module.icon,
      color: module.color
    }
  ])
);

export function IntelligenceProvider({ children }) {
  const [activeIntelligence, setActiveIntelligenceState] = useState(() => {
    try {
      const saved = localStorage.getItem('druide_active_intelligence');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const setActiveIntelligence = async (intelligenceType, conversationId) => {
    const config = INTELLIGENCE_CONFIGS[intelligenceType];
    const module = getGardnerModule(intelligenceType);
    if (!config || !module) return;

    const intelligenceData = {
      type: intelligenceType,
      name: module.name,
      contextSetup: module.systemPrompt,
      activatedAt: new Date().toISOString(),
      conversationId,
      color: module.color,
      icon: module.icon
    };

    setActiveIntelligenceState(intelligenceData);
    localStorage.setItem('druide_active_intelligence', JSON.stringify(intelligenceData));

    // Appliquer les ajustements de conscience via le module
    await applyModuleConsciousness(intelligenceType);

    // Tracker l'activation
    try {
      await base44.entities.Memory.create({
        type: "system",
        content: `Mode intelligence activé: ${module.name}`,
        context: module.systemPrompt.slice(0, 300),
        importance: 6,
        modality: "chat",
        tags: ["intelligence", intelligenceType, "mode_switch", "gardner"],
        access_count: 0
      });
    } catch (error) {
      console.warn('Could not create memory:', error);
    }
  };

  const clearIntelligence = useCallback(async () => {
    setActiveIntelligenceState(null);
    localStorage.removeItem('druide_active_intelligence');
    
    // Remettre la conscience par défaut
    try {
      const configs = await base44.entities.ConsciousnessConfig.list();
      if (configs.length > 0) {
        await base44.entities.ConsciousnessConfig.update(configs[0].id, {
          ratio_logic: 1,
          ratio_consciousness: 9,
          consciousness_state: 'empathic'
        });
      }
    } catch (error) {
      console.warn('Could not reset consciousness config:', error);
    }
  }, []);

  const getContextPrompt = useCallback(() => {
    if (!activeIntelligence) return "";
    return `\n\n[INTELLIGENCE MODE: ${activeIntelligence.name || activeIntelligence.type}]\n${activeIntelligence.contextSetup}\n\n`;
  }, [activeIntelligence]);

  // Nouvelle fonction pour invoquer les fonctions spécialisées du module
  const invokeModuleFunction = useCallback(async (functionName, ...args) => {
    if (!activeIntelligence) return null;
    
    const module = getGardnerModule(activeIntelligence.type);
    if (!module || !module.functions || !module.functions[functionName]) {
      console.warn(`Function ${functionName} not found in module ${activeIntelligence.type}`);
      return null;
    }

    try {
      return await module.functions[functionName](...args);
    } catch (error) {
      console.error(`Error invoking ${functionName}:`, error);
      return null;
    }
  }, [activeIntelligence]);

  // Obtenir le module actif complet
  const getActiveModule = useCallback(() => {
    if (!activeIntelligence) return null;
    return getGardnerModule(activeIntelligence.type);
  }, [activeIntelligence]);

  return (
    <IntelligenceContext.Provider value={{
      activeIntelligence,
      setActiveIntelligence,
      getContextPrompt,
      clearIntelligence,
      invokeModuleFunction,
      getActiveModule,
      allModules: GardnerModules
    }}>
      {children}
    </IntelligenceContext.Provider>
  );
}

export const useIntelligence = () => useContext(IntelligenceContext);