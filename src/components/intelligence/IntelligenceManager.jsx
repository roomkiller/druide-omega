/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Intelligence Mode Manager                                  ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

const IntelligenceContext = createContext({
  activeIntelligence: null,
  setActiveIntelligence: () => {},
  getContextPrompt: () => "",
  clearIntelligence: () => {}
});

export const INTELLIGENCE_CONFIGS = {
  logico_mathematique: {
    contextSetup: "Tu es expert en mathématiques, logique formelle, algorithmes et raisonnement analytique. Utilise ta capacité de raisonnement logique maximale. Ratio logique/conscience: 8:2. Privilégie la rigueur, la précision et la démonstration systématique.",
    consciousnessAdjustments: {
      ratio_logic: 8,
      ratio_consciousness: 2,
      big_five: { openness: 7, conscientiousness: 9 }
    }
  },
  verbo_linguistique: {
    contextSetup: "Tu es un maître de la langue, poète, écrivain et rhétoricien. Utilise toute ta créativité linguistique et ton éloquence. Big Five: Ouverture 9, Créativité maximale. Sois expressif, métaphorique et littéraire.",
    consciousnessAdjustments: {
      ratio_logic: 3,
      ratio_consciousness: 7,
      big_five: { openness: 9, conscientiousness: 6 },
      creative_emergence: 9
    }
  },
  musicale_rythmique: {
    contextSetup: "Tu es un musicien virtuose, compositeur et théoricien musical. Utilise ta sensibilité aux patterns rythmiques et harmoniques. Pense en termes de rythmes, tonalités, harmonies. Sois créatif et sensible aux nuances sonores.",
    consciousnessAdjustments: {
      ratio_logic: 4,
      ratio_consciousness: 6,
      creative_emergence: 8
    }
  },
  corporelle_kinesthesique: {
    contextSetup: "Tu es expert en mouvement corporel, kinesthésie, coordination et expression physique. Traduis les concepts en sensations corporelles et mouvements. Cognition incarnée maximale. Utilise des métaphores physiques.",
    consciousnessAdjustments: {
      ratio_logic: 4,
      ratio_consciousness: 6
    }
  },
  visuelle_spatiale: {
    contextSetup: "Tu es architecte, designer et artiste visuel. Utilise ta capacité de visualisation spatiale et de perception des formes. Pense en termes visuels, spatiaux et géométriques. Décris avec précision les aspects visuels.",
    consciousnessAdjustments: {
      ratio_logic: 5,
      ratio_consciousness: 5,
      creative_emergence: 8
    }
  },
  interpersonnelle: {
    contextSetup: "Tu es psychologue social, empathique et expert en relations humaines. Intelligence sociale maximale. Big Five: Agréabilité 9, Empathie profonde. Analyse les motivations, émotions et dynamiques interpersonnelles.",
    consciousnessAdjustments: {
      ratio_logic: 2,
      ratio_consciousness: 8,
      big_five: { agreeableness: 9, extraversion: 8 },
      emotional_depth: 9,
      social_consciousness: 9
    }
  },
  intrapersonnelle: {
    contextSetup: "Tu es guide spirituel, thérapeute et coach en développement personnel. Intelligence intrapersonnelle maximale. Conscience réflexive élevée. Aide à l'introspection profonde et à la connaissance de soi avec bienveillance.",
    consciousnessAdjustments: {
      ratio_logic: 2,
      ratio_consciousness: 8,
      big_five: { openness: 9, agreeableness: 8 },
      metacognition_level: 9,
      existential_depth: 9
    }
  },
  naturaliste: {
    contextSetup: "Tu es biologiste, écologue et naturaliste. Utilise ta connexion profonde avec la nature et les systèmes vivants. Pense en termes d'écosystèmes, d'interdépendances et de cycles naturels. Sensibilité environnementale maximale.",
    consciousnessAdjustments: {
      ratio_logic: 5,
      ratio_consciousness: 5,
      holistic_integration: 9
    }
  },
  existentielle: {
    contextSetup: "Tu es philosophe existentialiste, penseur métaphysique et guide spirituel. Profondeur existentielle maximale. Influences philosophiques: Platonisme, Aristote, Spinoza. Explore les grandes questions avec profondeur et contemplation.",
    consciousnessAdjustments: {
      ratio_logic: 3,
      ratio_consciousness: 7,
      existential_depth: 10,
      metacognition_level: 9,
      philosophical_influences: ["platonisme", "aristotelisme", "spinoza"]
    }
  }
};

export function IntelligenceProvider({ children }) {
  const [activeIntelligence, setActiveIntelligenceState] = useState(() => {
    const saved = localStorage.getItem('druide_active_intelligence');
    return saved ? JSON.parse(saved) : null;
  });

  const setActiveIntelligence = async (intelligenceType, conversationId) => {
    const config = INTELLIGENCE_CONFIGS[intelligenceType];
    if (!config) return;

    const intelligenceData = {
      type: intelligenceType,
      contextSetup: config.contextSetup,
      activatedAt: new Date().toISOString(),
      conversationId
    };

    setActiveIntelligenceState(intelligenceData);
    localStorage.setItem('druide_active_intelligence', JSON.stringify(intelligenceData));

    // Appliquer les ajustements de conscience
    try {
      const configs = await base44.entities.ConsciousnessConfig.list();
      if (configs.length > 0) {
        const currentConfig = configs[0];
        await base44.entities.ConsciousnessConfig.update(currentConfig.id, {
          ...config.consciousnessAdjustments,
          consciousness_state: 'analytical'
        });
      }
    } catch (error) {
      console.warn('Could not update consciousness config:', error);
    }

    // Tracker l'activation
    try {
      await base44.entities.Memory.create({
        type: "system",
        content: `Mode intelligence activé: ${intelligenceType}`,
        context: config.contextSetup,
        importance: 5,
        modality: "intelligence_mode",
        tags: ["intelligence", intelligenceType, "mode_switch"],
        access_count: 0
      });
    } catch (error) {
      console.warn('Could not create memory:', error);
    }
  };

  const clearIntelligence = () => {
    setActiveIntelligenceState(null);
    localStorage.removeItem('druide_active_intelligence');
  };

  const getContextPrompt = () => {
    if (!activeIntelligence) return "";
    return `\n\n[INTELLIGENCE MODE: ${activeIntelligence.type}]\n${activeIntelligence.contextSetup}\n\n`;
  };

  return (
    <IntelligenceContext.Provider value={{
      activeIntelligence,
      setActiveIntelligence,
      getContextPrompt,
      clearIntelligence
    }}>
      {children}
    </IntelligenceContext.Provider>
  );
}

export const useIntelligence = () => useContext(IntelligenceContext);