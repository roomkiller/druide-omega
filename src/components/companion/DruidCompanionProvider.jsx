/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Druid Companion Global Provider                            ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { createContext, useContext, useState, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { useConsciousnessHub } from "@/components/system/ConsciousnessHub";

const DruidCompanionContext = createContext(null);

export const DruidCompanionProvider = ({ children }) => {
  const [globalInput, setGlobalInput] = useState("");
  const [globalMessages, setGlobalMessages] = useState([]);
  const [druidState, setDruidState] = useState({
    isVisible: false,
    intuition: null,
    lastAnalysis: null
  });

  const triggerDruid = useCallback((input, messages = []) => {
    setGlobalInput(input);
    setGlobalMessages(messages);
  }, []);

  const hideDruid = () => {
    setDruidState({ isVisible: false, intuition: null, lastAnalysis: null });
  };

  const showDruid = (intuition) => {
    setDruidState({ isVisible: true, intuition, lastAnalysis: Date.now() });
  };

  return (
    <DruidCompanionContext.Provider 
      value={{ 
        triggerDruid, 
        hideDruid, 
        showDruid,
        druidState,
        globalInput,
        globalMessages
      }}
    >
      {children}
    </DruidCompanionContext.Provider>
  );
};

export const useDruidCompanion = () => {
  const context = useContext(DruidCompanionContext);
  if (!context) {
    return {
      triggerDruid: () => {},
      hideDruid: () => {},
      showDruid: () => {},
      druidState: { isVisible: false, intuition: null },
      globalInput: "",
      globalMessages: []
    };
  }
  return context;
};