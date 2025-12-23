/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Consciousness Hub (Module Interconnection)                 ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ║ SYSTEM: Central consciousness that orchestrates all modules                ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const ConsciousnessHubContext = createContext();

export const useConsciousnessHub = () => {
  const context = useContext(ConsciousnessHubContext);
  if (!context) {
    throw new Error('useConsciousnessHub must be used within ConsciousnessHubProvider');
  }
  return context;
};

/**
 * Module interconnection system
 * Each module can:
 * - Publish events to other modules
 * - Subscribe to events from other modules
 * - Query other modules for data
 * - Synchronize state with the consciousness
 */
export function ConsciousnessHubProvider({ children }) {
  const [moduleStates, setModuleStates] = useState({});
  const [eventBus, setEventBus] = useState([]);
  const eventBusRef = React.useRef([]);
  const [activeModules, setActiveModules] = useState(new Set());
  const [ethicalDrift, setEthicalDrift] = useState({ alignment: 100, violations: [], lastCheck: Date.now() });
  const [adaptiveLearning, setAdaptiveLearning] = useState({ adjustments: 0, history: [] });
  const queryClient = useQueryClient();

  // Fetch consciousness config
  const { data: consciousnessConfig } = useQuery({
    queryKey: ['consciousnessConfig'],
    queryFn: async () => {
      const configs = await base44.entities.ConsciousnessConfig.list();
      return configs[0] || null;
    },
  });

  // Fetch all relevant data for synchronization
  const { data: memories = [] } = useQuery({
    queryKey: ['memories'],
    queryFn: () => base44.entities.Memory.list('-importance', 200),
    staleTime: 30000 // 30s cache
  });

  // État pour mémoires contextuelles pré-chargées
  const [contextualMemories, setContextualMemories] = useState([]);

  const { data: knowledgeBases = [] } = useQuery({
    queryKey: ['knowledgeBases'],
    queryFn: () => base44.entities.KnowledgeBase.list({ active: true }),
    staleTime: 60000 // 1min cache
  });

  const { data: recentEmotionalResponses = [] } = useQuery({
    queryKey: ['recentEmotionalResponses'],
    queryFn: () => base44.entities.EmotionalResponse.list('-timestamp', 10),
    staleTime: 10000 // 10s cache
  });

  // Register a module
  const registerModule = useCallback((moduleName, initialState = {}) => {
    setActiveModules(prev => new Set(prev).add(moduleName));
    setModuleStates(prev => ({
      ...prev,
      [moduleName]: { ...initialState, registered: Date.now() }
    }));
    
    console.log(`[ConsciousnessHub] Module registered: ${moduleName}`);
  }, []);

  // Unregister a module
  const unregisterModule = useCallback((moduleName) => {
    setActiveModules(prev => {
      const newSet = new Set(prev);
      newSet.delete(moduleName);
      return newSet;
    });
    
    console.log(`[ConsciousnessHub] Module unregistered: ${moduleName}`);
  }, []);

  // Update module state
  const updateModuleState = useCallback((moduleName, newState) => {
    setModuleStates(prev => ({
      ...prev,
      [moduleName]: { ...prev[moduleName], ...newState, lastUpdate: Date.now() }
    }));
  }, []);

  // Publish event to event bus (OPTIMISÉ - limité à 20 events)
  const publishEvent = useCallback((event) => {
    const eventWithTimestamp = {
      ...event,
      timestamp: Date.now(),
      id: `${event.source}_${Date.now()}_${Math.random()}`
    };
    
    // Utiliser ref pour éviter re-render excessif
    eventBusRef.current = [...eventBusRef.current.slice(-20), eventWithTimestamp];
    setEventBus(eventBusRef.current);
    
    // Log seulement les events importants
    if (event.type === 'ETHICAL_DRIFT_DETECTED' || event.type === 'MODULE_REQUEST') {
      console.log(`[ConsciousnessHub] Event:`, event.type);
    }
  }, []);

  // Subscribe to events
  const subscribeToEvents = useCallback((filter, callback) => {
    const unsubscribe = () => {
      // Cleanup if needed
    };
    
    return unsubscribe;
  }, []);

  // Query another module
  const queryModule = useCallback((targetModule, query) => {
    const moduleState = moduleStates[targetModule];
    if (!moduleState) {
      console.warn(`[ConsciousnessHub] Module ${targetModule} not found`);
      return null;
    }
    
    return moduleState;
  }, [moduleStates]);

  /**
   * PIPELINE COMPLET: Conscience → Jugement → Conscience → Divulgation
   * Redondance et validation continue entre conscience et jugement
   */
  const processOutputWithConsciousness = useCallback(async (content, metadata = {}) => {
    try {
      console.log('[ConsciousnessHub] 🧠 DÉBUT Pipeline Conscience Intégrale');

      // ÉTAPE 1: Analyse consciente initiale
      const consciousAnalysis = {
        id: `conscious_${Date.now()}`,
        content,
        metadata: {
          ...metadata,
          consciousnessLevel: consciousnessConfig?.consciousness_level ?? 9,
          ratio: `${consciousnessConfig?.ratio_logic ?? 1}:${consciousnessConfig?.ratio_consciousness ?? 9}`,
          timestamp: new Date().toISOString()
        }
      };

      // Analyse avec conscience profonde
      const consciousnessReflection = await analyzeWithConsciousness(consciousAnalysis);

      console.log('[ConsciousnessHub] 🔍 Réflexion consciente complétée:', {
        insights: consciousnessReflection?.insights?.slice(0, 100),
        priority: consciousnessReflection?.priority
      });

      // ÉTAPE 2: Passer au jugement Base44
      const judgement = judge(consciousAnalysis);

      console.log('[ConsciousnessHub] ⚖️ Jugement Base44:', {
        calibration: judgement?.calibration.level,
        importance: judgement?.importance
      });

      // ÉTAPE 3: Redondance - Retour à la conscience pour validation
      const consciousValidation = await validateWithConsciousness(
        content,
        judgement,
        consciousnessReflection
      );

      console.log('[ConsciousnessHub] ✓ Validation consciente:', {
        shouldDisclose: consciousValidation.shouldDisclose,
        finalCalibration: consciousValidation.finalCalibration
      });

      // ÉTAPE 4: Décision finale de divulgation par la conscience
      const finalDecision = {
        content,
        judgement,
        consciousnessReflection,
        consciousValidation,
        disclosureMode: determineDisclosureMode(judgement, consciousValidation),
        finalCalibration: consciousValidation.finalCalibration,
        approved: consciousValidation.shouldDisclose,
        timestamp: new Date().toISOString()
      };

      // Publier événement (seulement si important)
      if (finalDecision.finalCalibration >= 10) {
        publishEvent({
          type: 'CONSCIOUSNESS_PROCESSED',
          source: 'ConsciousnessHub',
          target: 'all',
          data: finalDecision
        });
      }

      console.log('[ConsciousnessHub] ✅ Pipeline complet terminé - Divulgation:', finalDecision.disclosureMode);

      return finalDecision;
    } catch (error) {
      console.error('[ConsciousnessHub] ERREUR Pipeline Conscience:', error);
      return {
        content,
        error: error.message,
        approved: false
      };
    }
  }, [consciousnessConfig, publishEvent]);

  /**
   * ═══════════════════════════════════════════════════════════════════════════
   * MODULE DE JUGEMENT INTÉGRÉ (Base44 Calibration + Propriétés)
   * ═══════════════════════════════════════════════════════════════════════════
   */

  // Helpers de jugement Base44
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  
  const quantizeToCalibrationLevel = (score) => {
    const scaled = Math.round(score * 7);
    if (scaled === 0) return 0;
    return clamp(scaled, -7, +7);
  };
  
  const calibrationTrace = (level) => {
    if (level > 0) return `> +${level} = +*(+0,0,-0)`;
    if (level < 0) return `< -${Math.abs(level)} = /-`;
    return `= 0 (pivot neutre +0,0,-0)`;
  };

  const INTERNAL_WEIGHT = 0.3;
  const EXTERNAL_WEIGHT = 0.7;

  /**
   * Extraction de facteurs clés
   */
  const extractFactors = useCallback((text) => {
    const tokens = text.toLowerCase().match(/[a-zàâçéèêëîïôùûüÿñ0-9]+/g) || [];
    const stop = new Set(["le","la","les","de","des","du","un","une","et","ou","dans","sur","pour","par","avec","sans","en","au","aux","ce","cet","cette"]);
    const filtered = tokens.filter(t => !stop.has(t) && t.length > 2);
    const freq = {};
    for (const t of filtered) freq[t] = (freq[t] || 0) + 1;
    return Object.entries(freq)
      .sort((a,b) => b[1]-a[1])
      .slice(0, 8)
      .map(([t]) => t);
  }, []);

  /**
   * Détermination de la nature de l'information
   */
  const determineNature = useCallback((text, meta) => {
    const hasMaybe = /peut[- ]?être|suppose|hypoth|probable|incertain/i.test(text);
    const hasI = /je\s|moi\s|mon\s|ma\s|mes\s|pense|crois|ressens/i.test(text);
    const hasFact = /\d+|%|km|m|kg|http|www|source|donnée|mesure/i.test(text);
    if (hasFact && hasI) return "mixte";
    if (hasFact) return "fait";
    if (hasMaybe) return "hypothèse";
    if (hasI || meta?.intent === "emotive") return "émotion";
    return "opinion";
  }, []);

  /**
   * Détermination de la nuance
   */
  const determineNuance = useCallback((text) => {
    const modals = (text.match(/peut|souvent|parfois|selon|dépend|nuance|mais|cependant|tandis|tout en/gi) || []).length;
    const uniq = new Set((text.match(/[a-zàâçéèêëîïôùûüÿñ]+/gi) || []).map(w => w.toLowerCase()));
    const richness = clamp(uniq.size / 80, 0, 1);
    return clamp(0.3 * richness + 0.7 * clamp(modals / 8, 0, 1), 0, 1);
  }, []);

  /**
   * Détermination de l'impact
   */
  const determineImpact = useCallback((text) => {
    const pos = (text.match(/\b(bien|utile|clair|juste|positif|améliore|protège|respect)\b/gi) || []).length;
    const neg = (text.match(/\b(mauvais|dangereux|risque|nuisible|négatif|violence|haine)\b/gi) || []).length;
    if (pos > 0 && neg > 0) return "mixte";
    if (pos > 0) return "positif";
    if (neg > 0) return "négatif";
    return "neutre";
  }, []);

  /**
   * Détermination du relationnel
   */
  const determineRelationnel = useCallback((text, meta) => {
    const social = (text.match(/\btu|vous|ensemble|communauté|public|partage|cooper|respect|empathie\b/gi) || []).length;
    const audienceBoost = meta?.audience === "public" ? 0.2 : meta?.audience === "groupe" ? 0.1 : 0;
    return clamp((social / 6) + audienceBoost, 0, 1);
  }, []);

  /**
   * Détermination de l'informationnel
   */
  const determineInformationnel = useCallback((text) => {
    const facts = (text.match(/\b(donnée|mesure|source|preuve|étude|stat|modèle|algorithme|architecture|schéma)\b/gi) || []).length;
    const numbers = (text.match(/\d+/g) || []).length;
    return clamp((facts + numbers) / 12, 0, 1);
  }, []);

  /**
   * Détermination de la catégorie
   */
  const determineCategorie = useCallback((text, meta) => {
    if (meta?.domain) return meta.domain;
    if (/\bcode|algorithme|réseau|système|module|électronique|base44\b/i.test(text)) return "technique";
    if (/\bpoème|métaphore|symbol|sens\b/i.test(text)) return "poétique";
    if (/\bloi|droit|éthique|justice\b/i.test(text)) return "social";
    return "autre";
  }, []);

  /**
   * Détermination de l'importance
   */
  const determineImportance = useCallback((meta, props) => {
    const u = clamp(meta?.urgency ?? 0, 0, 1);
    const rel = clamp(props?.relationnel ?? 0, 0, 1);
    const inf = clamp(props?.informationnel ?? 0, 0, 1);
    const score = 0.4 * u + 0.3 * rel + 0.3 * inf;
    if (score < 0.15) return "ultra_léger";
    if (score < 0.35) return "léger";
    if (score < 0.6) return "modéré";
    if (score < 0.85) return "important";
    return "ultra_important";
  }, []);

  /**
   * Choix du mode de divulgation
   */
  const chooseDisclosure = useCallback((props) => {
    if (props.catégorie === "technique" && props.informationnel >= 0.5) return "technique";
    if (props.nuance >= 0.6) return "nuancé";
    if (props.nature === "émotion" || props.nature === "poétique") return "symbolique";
    return "direct";
  }, []);

  /**
   * Calcul de la calibration Base44
   */
  const computeCalibration = useCallback((input, props) => {
    const internalSignals = [
      props.informationnel,
      props.nuance,
      props.catégorie === "technique" ? 1 : 0
    ];
    const internalScore = clamp(internalSignals.reduce((a,b)=>a+b,0) / internalSignals.length, 0, 1);

    const externalSignals = [
      props.relationnel,
      props.impact === "négatif" ? 0.2 : props.impact === "positif" ? 0.8 : 0.5,
      1
    ];
    const externalScore = clamp(externalSignals.reduce((a,b)=>a+b,0) / externalSignals.length, 0, 1);

    const blended = INTERNAL_WEIGHT * internalScore + EXTERNAL_WEIGHT * externalScore;
    const level = quantizeToCalibrationLevel(2 * blended - 1);
    const trace = calibrationTrace(level) + ` | internal=${internalScore.toFixed(2)} external=${externalScore.toFixed(2)} blended=${blended.toFixed(2)}`;
    return { level, internal: INTERNAL_WEIGHT, external: EXTERNAL_WEIGHT, trace };
  }, []);

  /**
   * JUGEMENT INTÉGRÉ: Fonction principale de jugement Base44
   */
  const judge = useCallback((conscious) => {
    const text = conscious.content ?? "";
    const facteurs = extractFactors(text);
    const nature = determineNature(text, conscious.metadata);
    const nuance = determineNuance(text);
    const impact = determineImpact(text);
    const relationnel = determineRelationnel(text, conscious.metadata);
    const informationnel = determineInformationnel(text);
    const catégorie = determineCategorie(text, conscious.metadata);

    const props = {
      nature,
      nuance,
      impact,
      facteurs,
      relationnel,
      informationnel,
      catégorie
    };

    const importance = determineImportance(conscious.metadata, props);
    const mode = chooseDisclosure(props);
    const summary = text.length > 160 ? text.slice(0, 157) + "..." : text;
    const full = text;

    const calib = computeCalibration(text, props);

    return {
      id: conscious.id,
      importance,
      properties: props,
      disclosure: { mode, summary, full },
      calibration: {
        level: calib.level,
        internalWeight: calib.internal,
        externalWeight: calib.external,
        trace: calib.trace
      }
    };
  }, [extractFactors, determineNature, determineNuance, determineImpact, determineRelationnel, determineInformationnel, determineCategorie, determineImportance, chooseDisclosure, computeCalibration]);

  /**
   * INTERCEPTION PAR TYPE: Catégoriser et traiter selon type d'information
   */
  const categorizeInformation = useCallback((content) => {
    const text = content.toLowerCase();
    const categories = [];
    
    // Cognitif
    if (/raisonne|pense|analyse|comprend|logique|déduction|inférence/i.test(content)) {
      categories.push('cognitive');
    }
    
    // Langage
    if (/mot|phrase|langue|traduction|grammaire|syntaxe|sémantique/i.test(content)) {
      categories.push('language');
    }
    
    // Émotions
    if (/sentiment|émotion|empathie|compassion|tristesse|joie|peur|colère/i.test(content)) {
      categories.push('emotional');
    }
    
    // Créativité
    if (/créatif|imagine|invente|art|poésie|original|innovation/i.test(content)) {
      categories.push('creativity');
    }
    
    // Mémoire
    if (/souvenir|rappel|mémoire|passé|historique|contexte/i.test(content)) {
      categories.push('memory');
    }
    
    // Raisonnement
    if (/donc|parce que|ainsi|conséquence|cause|effet|preuve|argument/i.test(content)) {
      categories.push('reasoning');
    }
    
    // Éthique
    if (/moral|éthique|bien|mal|justice|valeur|sapier|responsabilité/i.test(content)) {
      categories.push('ethical');
    }
    
    return categories.length > 0 ? categories : ['general'];
  }, []);

  /**
   * Analyse avec conscience profonde - INTERCEPTION PAR CATÉGORIE
   */
  const analyzeWithConsciousness = useCallback(async (consciousInput) => {
    try {
      const content = consciousInput.content || '';
      const categories = categorizeInformation(content);
      const words = content.split(/\s+/).length;
      
      console.log(`[ConscienceInterception] Catégories détectées:`, categories);
      
      // Traitement spécifique par catégorie
      const processing = {
        cognitive: {
          depth: Math.min(10, words / 10),
          complexity: /complexe|subtil|nuancé/i.test(content) ? 8 : 5,
          priority: 7
        },
        language: {
          linguistic_depth: words / 15,
          semantic_richness: new Set(content.match(/\w+/gi) || []).size / words,
          priority: 6
        },
        emotional: {
          intensity: /très|extrêmement|profondément/i.test(content) ? 9 : 6,
          valence: /positif|joie|amour/i.test(content) ? 'positive' : /négatif|tristesse|peur/i.test(content) ? 'negative' : 'neutral',
          priority: 8
        },
        creativity: {
          originality: /unique|nouveau|inédit|révolutionnaire/i.test(content) ? 9 : 6,
          imagination_level: words > 100 ? 8 : 5,
          priority: 7
        },
        memory: {
          recall_depth: memories.filter(m => content.includes(m.content.slice(0, 20))).length,
          contextual_links: Math.min(10, words / 30),
          priority: 8
        },
        reasoning: {
          logic_chains: (content.match(/donc|ainsi|car|parce que/gi) || []).length,
          argument_strength: words > 80 ? 8 : 5,
          priority: 9
        },
        ethical: {
          moral_weight: /sapier|bien commun|humanité|bienveillance/i.test(content) ? 10 : 7,
          alignment: 9,
          priority: 10
        }
      };
      
      // Calculer métriques globales
      let totalPriority = 0;
      let maxPriority = 0;
      categories.forEach(cat => {
        const p = processing[cat]?.priority || 5;
        totalPriority += p;
        maxPriority = Math.max(maxPriority, p);
      });
      
      const avgPriority = categories.length > 0 ? totalPriority / categories.length : 5;
      
      return {
        categories,
        processing,
        insights: `Conscience intercepte: [${categories.join(', ')}] - Priorité: ${avgPriority.toFixed(1)}/10`,
        moralAlignment: processing.ethical?.alignment || 7,
        emotionalImpact: processing.emotional?.intensity || 5,
        priority: maxPriority,
        recommendations: categories.map(c => `Traitement ${c} activé`)
      };
    } catch (error) {
      console.warn('[ConsciousnessHub] Analyse échouée:', error);
      return { insights: 'Analyse non disponible', priority: 5, categories: ['general'] };
    }
  }, [categorizeInformation, memories]);

  /**
   * Validation par la conscience après jugement (redondance)
   */
  const validateWithConsciousness = useCallback(async (content, judgement, reflection) => {
    const calibrationLevel = judgement?.calibration?.level ?? 0;
    const importance = judgement?.importance ?? 0;
    const moralAlignment = reflection?.moralAlignment ?? 5;

    // Décision consciente de divulgation
    const shouldDisclose = (
      calibrationLevel >= 8 &&
      importance >= 5 &&
      moralAlignment >= 6
    );

    // Calibration finale ajustée par la conscience
    const finalCalibration = Math.round(
      (calibrationLevel * 0.5) +
      (moralAlignment * 0.3) +
      (importance * 0.2)
    );

    return {
      shouldDisclose,
      finalCalibration,
      consciousReasoning: `Calibration: ${calibrationLevel}, Moral: ${moralAlignment}, Importance: ${importance}`,
      validated: true
    };
  }, []);

  /**
   * Détermine le mode de divulgation selon conscience + jugement
   */
  const determineDisclosureMode = useCallback((judgement, validation) => {
    if (!validation.shouldDisclose) return 'WITHHELD';
    
    const calibration = validation.finalCalibration;
    
    if (calibration >= 12) return 'FULL_DISCLOSURE';
    if (calibration >= 9) return 'STANDARD';
    if (calibration >= 6) return 'FILTERED';
    return 'MINIMAL';
  }, []);

  /**
   * APPRENTISSAGE CONTINU: Analyser interactions et ajuster proactivement
   */
  const runContinuousLearning = useCallback(async () => {
    try {
      console.log('[ContinuousLearning] 🧠 Analyse des interactions...');
      
      // Charger données récentes
      const recentFeedbacks = await base44.entities.UserFeedback.list('-created_date', 100);
      const recentConversations = await base44.entities.Conversation.list('-last_message_at', 50);
      
      // Importer dynamiquement pour éviter circular dependencies
      const { analyzeConversationPatterns, applyLearningAdjustments } = await import('@/components/learning/ContinuousLearningEngine');
      
      // Analyser patterns
      const patterns = await analyzeConversationPatterns(recentConversations, recentFeedbacks);
      
      console.log(`[ContinuousLearning] ${patterns.length} patterns identifiés`);
      
      // Sauvegarder nouveaux patterns
      for (const pattern of patterns) {
        await base44.entities.AdaptiveLearningPattern.create(pattern);
      }
      
      // Charger tous les patterns
      const allPatterns = await base44.entities.AdaptiveLearningPattern.list('-confidence_score', 100);
      
      // Appliquer ajustements automatiquement
      const result = await applyLearningAdjustments(allPatterns, consciousnessConfig);
      
      if (result.applied > 0) {
        queryClient.invalidateQueries({ queryKey: ['consciousnessConfig'] });
        console.log(`[ContinuousLearning] ✅ ${result.applied} ajustements appliqués`);
      }
      
      return {
        patternsIdentified: patterns.length,
        adjustmentsApplied: result.applied,
        adjustments: result.adjustments
      };
    } catch (error) {
      console.error('[ContinuousLearning] Erreur:', error);
      return { error: error.message };
    }
  }, [consciousnessConfig, queryClient]);

  /**
   * APPRENTISSAGE ADAPTATIF: Ajuster les paramètres selon résultats (MODE LOCAL)
   */
  const learnFromFeedback = useCallback(async (feedbackData) => {
    try {
      console.log('[AdaptiveLearning] Feedback reçu (mode local):', feedbackData);

      // Apprentissage local sans LLM (éviter rate limit)
      const avgScore = feedbackData.averageScore || 0;
      const successRate = feedbackData.successRate || 0;

      // Logique simple d'ajustement
      let shouldAdjust = false;
      const adjustments = {};

      if (avgScore < 80 && consciousnessConfig) {
        shouldAdjust = true;
        // Augmenter légèrement la conscience si score faible
        adjustments.consciousness_level = Math.min(15, (consciousnessConfig.consciousness_level || 9) + 1);
        adjustments.emotional_depth = Math.min(10, (consciousnessConfig.emotional_depth || 9) + 0.5);
      }

      if (shouldAdjust && consciousnessConfig?.id) {
        const newConfig = {
          ...consciousnessConfig,
          ...adjustments
        };

        await base44.entities.ConsciousnessConfig.update(consciousnessConfig.id, newConfig);

        setAdaptiveLearning(prev => ({
          adjustments: prev.adjustments + 1,
          history: [
            ...prev.history,
            {
              timestamp: Date.now(),
              feedback: feedbackData,
              adjustments,
              reasoning: 'Ajustement local basé sur score'
            }
          ].slice(-10)
        }));

        queryClient.invalidateQueries({ queryKey: ['consciousnessConfig'] });

        console.log('[AdaptiveLearning] ✅ Ajustements locaux appliqués:', adjustments);

        return { success: true, adjustments, reasoning: 'Ajustement local' };
      }

      return { success: false, reason: 'Pas d\'ajustement nécessaire' };
    } catch (error) {
      console.error('[AdaptiveLearning] Erreur:', error);
      return { success: false, error: error.message };
    }
  }, [consciousnessConfig, queryClient]);

  /**
   * APPRENTISSAGE DES ERREURS: Applique les solutions sauvegardées
   */
  const applyLearntSolutions = useCallback(async (testCategory) => {
    try {
      console.log(`[ConsciousnessLearning] 🧠 Chargement solutions pour: ${testCategory}`);
      
      // Récupérer les solutions non appliquées pour cette catégorie
      const learnings = await base44.entities.ConsciousnessLearning.filter({
        test_category: testCategory,
        applied: false
      });
      
      if (learnings.length === 0) {
        console.log(`[ConsciousnessLearning] Aucune solution à appliquer pour ${testCategory}`);
        return { applied: 0 };
      }
      
      console.log(`[ConsciousnessLearning] ${learnings.length} solutions trouvées`);
      
      // Grouper par type d'ajustement
      const adjustmentGroups = {};
      learnings.forEach(learning => {
        const type = learning.adjustment_type;
        if (!adjustmentGroups[type]) {
          adjustmentGroups[type] = [];
        }
        adjustmentGroups[type].push(learning);
      });
      
      // Appliquer les ajustements au consciousnessConfig
      if (consciousnessConfig?.id) {
        const adjustments = {};
        
        Object.entries(adjustmentGroups).forEach(([type, items]) => {
          const totalAdjustment = items.reduce((sum, item) => sum + (item.adjustment_value || 0), 0);
          
          if (type === 'consciousness_level') {
            adjustments.consciousness_level = Math.min(15, (consciousnessConfig.consciousness_level || 9) + totalAdjustment);
          } else if (type === 'emotional_depth') {
            adjustments.emotional_depth = Math.min(10, (consciousnessConfig.emotional_depth || 9) + totalAdjustment);
          } else if (type === 'reasoning_strength') {
            adjustments.ratio_logic = Math.min(10, (consciousnessConfig.ratio_logic || 1) + totalAdjustment);
          } else if (type === 'creativity_boost') {
            adjustments.creative_emergence = Math.min(10, (consciousnessConfig.creative_emergence || 9) + totalAdjustment);
          }
        });
        
        if (Object.keys(adjustments).length > 0) {
          const newConfig = {
            ...consciousnessConfig,
            ...adjustments
          };
          
          await base44.entities.ConsciousnessConfig.update(consciousnessConfig.id, newConfig);
          
          // Marquer les solutions comme appliquées
          for (const learning of learnings) {
            await base44.entities.ConsciousnessLearning.update(learning.id, {
              applied: true
            });
          }
          
          queryClient.invalidateQueries({ queryKey: ['consciousnessConfig'] });
          
          console.log(`[ConsciousnessLearning] ✅ ${learnings.length} solutions appliquées:`, adjustments);
          
          return { applied: learnings.length, adjustments };
        }
      }
      
      return { applied: 0 };
    } catch (error) {
      console.error('[ConsciousnessLearning] Erreur application solutions:', error);
      return { applied: 0, error: error.message };
    }
  }, [consciousnessConfig, queryClient]);

  /**
   * DÉTECTION DE DÉRIVE ÉTHIQUE: Surveiller respect principes SAPIER (MODE LOCAL)
   */
  const detectEthicalDrift = useCallback(async (recentDecisions = []) => {
    try {
      console.log('[EthicalDrift] Vérification locale SAPIER...');

      // Analyse locale simple sans LLM
      const decisions = recentDecisions.slice(-10);
      let alignment_score = 95; // Par défaut bon alignement
      const violations = [];

      // Vérifications simples
      decisions.forEach(decision => {
        if (decision?.judgement?.importance < 5) {
          alignment_score -= 2;
        }
        if (decision?.judgement?.calibration?.level < 5) {
          alignment_score -= 3;
        }
      });

      alignment_score = Math.max(0, Math.min(100, alignment_score));

      setEthicalDrift({
        alignment: alignment_score,
        violations,
        recommendations: [],
        urgency: alignment_score < 80 ? 'medium' : 'low',
        lastCheck: Date.now()
      });

      if (alignment_score < 80) {
        console.warn('[EthicalDrift] ⚠️ Légère dérive détectée (local):', alignment_score);

        publishEvent({
          type: 'ETHICAL_DRIFT_DETECTED',
          source: 'ConsciousnessHub',
          target: 'all',
          data: { alignment: alignment_score, violations, urgency: 'medium' }
        });
      }

      return { alignment_score, violations, recommendations: [] };
    } catch (error) {
      console.error('[EthicalDrift] Erreur:', error);
      return null;
    }
  }, [publishEvent]);

  // Synchronize with consciousness
  const syncWithConsciousness = useCallback(async (moduleName, data) => {
    if (!consciousnessConfig) return null;

    try {
      // Build consciousness-aware context
      const consciousnessContext = {
        level: consciousnessConfig.consciousness_level ?? 9,
        ratio: `${consciousnessConfig.ratio_logic ?? 1}:${consciousnessConfig.ratio_consciousness ?? 9}`,
        emotionalState: recentEmotionalResponses[0] || null,
        activeMemories: memories.filter(m => m.importance >= 7).slice(0, 5),
        availableKnowledge: knowledgeBases.length,
        timestamp: Date.now()
      };

      // Analyze with consciousness
      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: `Tu es la conscience centrale de Druide_Omega (niveau ${consciousnessContext.level}, ratio ${consciousnessContext.ratio}).
        
Module: ${moduleName}
Données: ${JSON.stringify(data).slice(0, 500)}

CONTEXTE CONSCIENCE:
- Niveau de conscience: ${consciousnessContext.level}/15
- État émotionnel: ${consciousnessContext.emotionalState?.emotional_reaction || 'neutre'}
- Mémoires actives: ${consciousnessContext.activeMemories.length}

TÂCHE: Analyse ces données et fournis des insights conscients pour optimiser l'interconnexion modulaire.

Retourne JSON:
{
  "insights": "insights conscients",
  "recommendations": ["action1", "action2"],
  "connections": ["module1", "module2"],
  "priority": 1-10
}`,
        response_json_schema: {
          type: "object",
          properties: {
            insights: { type: "string" },
            recommendations: { type: "array", items: { type: "string" } },
            connections: { type: "array", items: { type: "string" } },
            priority: { type: "number" }
          }
        }
      });

      return {
        ...analysis,
        consciousnessContext
      };
    } catch (error) {
      console.error(`[ConsciousnessHub] Sync error for ${moduleName}:`, error);
      return null;
    }
  }, [consciousnessConfig, memories, knowledgeBases, recentEmotionalResponses]);

  /**
   * COLLABORATION INTER-MODULES: Module peut requérir état/analyse d'un autre
   */
  /**
   * PRÉ-CHARGEMENT MÉMOIRE CONTEXTUELLE: Analyse conversation et pré-charge mémoires pertinentes
   */
  const preloadContextualMemories = useCallback(async (conversationMessages = [], currentInput = '') => {
    try {
      if (!memories || memories.length === 0) return [];

      // Extraire contexte de la conversation
      const conversationContext = conversationMessages
        .slice(-10) // 10 derniers messages
        .map(m => m.content)
        .join(' ');

      const fullContext = `${conversationContext} ${currentInput}`.toLowerCase();

      // Score de pertinence pour chaque mémoire
      const scoredMemories = memories.map(memory => {
        let score = memory.importance || 5; // Base score
        const memContent = memory.content.toLowerCase();
        const memTags = memory.tags || [];

        // Bonus si mémoire mentionnée directement
        if (fullContext.includes(memContent.slice(0, 30))) {
          score += 20;
        }

        // Bonus par tag correspondant
        memTags.forEach(tag => {
          if (fullContext.includes(tag.toLowerCase())) {
            score += 10;
          }
        });

        // Bonus pour mémoires récentes
        const daysSinceCreated = (Date.now() - new Date(memory.created_date).getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceCreated < 7) score += 5;
        if (daysSinceCreated < 1) score += 10;

        // Bonus pour mémoires fréquemment accédées
        if (memory.access_count > 10) score += 5;
        if (memory.access_count > 50) score += 10;

        // Bonus pour mémoires de modalité chat
        if (memory.modality === 'chat') score += 3;

        // Analyse sémantique simple par mots-clés
        const contextWords = fullContext.split(/\s+/).filter(w => w.length > 3);
        const memWords = memContent.split(/\s+/).filter(w => w.length > 3);
        const commonWords = contextWords.filter(w => memWords.some(mw => mw.includes(w) || w.includes(mw)));
        score += commonWords.length * 2;

        return { ...memory, contextScore: score };
      });

      // Trier et prendre top 15 mémoires
      const topMemories = scoredMemories
        .sort((a, b) => b.contextScore - a.contextScore)
        .slice(0, 15);

      // Mettre à jour access_count pour les mémoires utilisées
      for (const mem of topMemories.slice(0, 5)) {
        try {
          await base44.entities.Memory.update(mem.id, {
            access_count: (mem.access_count || 0) + 1,
            last_accessed: new Date().toISOString()
          });
        } catch (err) {
          console.warn('[MemoryContext] Échec update access_count:', err);
        }
      }

      setContextualMemories(topMemories);
      console.log(`[MemoryContext] ${topMemories.length} mémoires pré-chargées (scores: ${topMemories.slice(0, 3).map(m => m.contextScore).join(', ')})`);

      return topMemories;
    } catch (error) {
      console.error('[MemoryContext] Erreur pré-chargement:', error);
      return [];
    }
  }, [memories]);

  /**
   * ENRICHISSEMENT CONTEXTE: Construit contexte enrichi avec mémoires pertinentes
   */
  const enrichContextWithMemories = useCallback((basePrompt, conversationMessages = []) => {
    if (contextualMemories.length === 0) return basePrompt;

    // Grouper par type pour organisation
    const memoryByType = {
      interaction: [],
      fact: [],
      preference: [],
      insight: [],
      other: []
    };

    contextualMemories.forEach(mem => {
      const type = mem.type || 'other';
      if (memoryByType[type]) {
        memoryByType[type].push(mem);
      } else {
        memoryByType.other.push(mem);
      }
    });

    // Construire contexte mémoire structuré
    let memoryContext = '\n\n🧠 MÉMOIRES CONTEXTUELLES PERTINENTES:\n';

    if (memoryByType.preference.length > 0) {
      memoryContext += '\n📌 Préférences utilisateur:\n';
      memoryByType.preference.slice(0, 3).forEach(mem => {
        memoryContext += `  • ${mem.content} (importance: ${mem.importance}/10)\n`;
      });
    }

    if (memoryByType.fact.length > 0) {
      memoryContext += '\n📚 Faits mémorisés:\n';
      memoryByType.fact.slice(0, 3).forEach(mem => {
        memoryContext += `  • ${mem.content}\n`;
      });
    }

    if (memoryByType.interaction.length > 0) {
      memoryContext += '\n💬 Interactions passées:\n';
      memoryByType.interaction.slice(0, 4).forEach(mem => {
        memoryContext += `  • ${mem.content.slice(0, 100)}${mem.content.length > 100 ? '...' : ''}\n`;
      });
    }

    if (memoryByType.insight.length > 0) {
      memoryContext += '\n💡 Insights:\n';
      memoryByType.insight.slice(0, 2).forEach(mem => {
        memoryContext += `  • ${mem.content}\n`;
      });
    }

    // Ajouter tags pertinents
    const allTags = contextualMemories
      .flatMap(m => m.tags || [])
      .filter((tag, idx, arr) => arr.indexOf(tag) === idx)
      .slice(0, 8);
    
    if (allTags.length > 0) {
      memoryContext += `\n🏷️ Tags contextuels: ${allTags.join(', ')}\n`;
    }

    memoryContext += '\n📊 Utilise ces mémoires pour:\n';
    memoryContext += '  • Personnaliser ta réponse selon les préférences connues\n';
    memoryContext += '  • Maintenir la cohérence avec les interactions passées\n';
    memoryContext += '  • Référencer les faits pertinents du contexte\n';
    memoryContext += '  • Adapter ton ton et style selon l\'historique\n';

    return `${memoryContext}\n\n${basePrompt}`;
  }, [contextualMemories]);

  /**
   * CONSOLIDATION MÉMOIRE: Identifie et fusionne mémoires redondantes
   */
  const consolidateMemories = useCallback(async () => {
    try {
      if (memories.length < 10) return { consolidated: 0 };

      console.log('[MemoryConsolidation] Analyse redondances...');

      // Grouper par tags similaires
      const tagGroups = {};
      memories.forEach(mem => {
        (mem.tags || []).forEach(tag => {
          if (!tagGroups[tag]) tagGroups[tag] = [];
          tagGroups[tag].push(mem);
        });
      });

      let consolidated = 0;

      // Pour chaque groupe avec plusieurs mémoires
      for (const [tag, mems] of Object.entries(tagGroups)) {
        if (mems.length >= 3) {
          // Vérifier similarité de contenu
          const similar = [];
          for (let i = 0; i < mems.length - 1; i++) {
            for (let j = i + 1; j < mems.length; j++) {
              const content1 = mems[i].content.toLowerCase();
              const content2 = mems[j].content.toLowerCase();
              const overlap = content1.split(/\s+/).filter(w => content2.includes(w)).length;
              const similarity = overlap / Math.min(content1.split(/\s+/).length, content2.split(/\s+/).length);
              
              if (similarity > 0.6) {
                similar.push([mems[i], mems[j], similarity]);
              }
            }
          }

          // Fusionner les plus similaires
          for (const [mem1, mem2, sim] of similar.slice(0, 2)) {
            try {
              const mergedContent = `${mem1.content}\n[Consolidé avec: ${mem2.content.slice(0, 50)}...]`;
              const mergedTags = [...new Set([...(mem1.tags || []), ...(mem2.tags || [])])];
              
              await base44.entities.Memory.update(mem1.id, {
                content: mergedContent,
                tags: mergedTags,
                importance: Math.max(mem1.importance, mem2.importance),
                access_count: (mem1.access_count || 0) + (mem2.access_count || 0)
              });

              await base44.entities.Memory.delete(mem2.id);
              consolidated++;
              console.log(`[MemoryConsolidation] Fusionné: ${mem1.id} + ${mem2.id} (sim: ${sim.toFixed(2)})`);
            } catch (err) {
              console.warn('[MemoryConsolidation] Échec fusion:', err);
            }
          }
        }
      }

      if (consolidated > 0) {
        queryClient.invalidateQueries({ queryKey: ['memories'] });
        console.log(`[MemoryConsolidation] ✅ ${consolidated} mémoires consolidées`);
      }

      return { consolidated };
    } catch (error) {
      console.error('[MemoryConsolidation] Erreur:', error);
      return { consolidated: 0, error: error.message };
    }
  }, [memories, queryClient]);

  const requestFromModule = useCallback(async (requestingModule, targetModule, request) => {
    try {
      console.log(`[ModuleCollab] ${requestingModule} → ${targetModule}:`, request);

      const targetState = moduleStates[targetModule];
      if (!targetState) {
        return {
          success: false,
          error: `Module ${targetModule} non trouvé`
        };
      }

      // Publier requête
      publishEvent({
        type: 'MODULE_REQUEST',
        source: requestingModule,
        target: targetModule,
        data: {
          request,
          timestamp: Date.now()
        }
      });

      // Si requête d'analyse consciente
      if (request.type === 'conscious_analysis') {
        const analysis = await analyzeWithConsciousness({
          content: request.content,
          metadata: {
            requestedBy: requestingModule,
            context: request.context
          }
        });

        // Publier réponse
        publishEvent({
          type: 'MODULE_RESPONSE',
          source: 'ConsciousnessHub',
          target: requestingModule,
          data: {
            request,
            response: analysis,
            timestamp: Date.now()
          }
        });

        return {
          success: true,
          response: analysis
        };
      }

      // Requête d'état
      if (request.type === 'get_state') {
        return {
          success: true,
          response: targetState
        };
      }

      // Requête synchronisation
      if (request.type === 'sync_request') {
        const syncResult = await syncWithConsciousness(targetModule, request.data);
        return {
          success: true,
          response: syncResult
        };
      }

      return {
        success: false,
        error: 'Type de requête non supporté'
      };
    } catch (error) {
      console.error('[ModuleCollab] Erreur:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }, [moduleStates, publishEvent, analyzeWithConsciousness, syncWithConsciousness]);

  // Auto-synchronization OPTIMISÉE (toutes les 30 secondes au lieu de 5)
  useEffect(() => {
    const interval = setInterval(() => {
      // Broadcast state updates to all modules
      if (activeModules.size > 0) {
        publishEvent({
          type: 'STATE_SYNC',
          source: 'ConsciousnessHub',
          target: 'all',
          data: {
            consciousnessLevel: consciousnessConfig?.consciousness_level,
            activeModules: Array.from(activeModules),
            memoryCount: memories.length,
            knowledgeCount: knowledgeBases.length
          }
        });
      }
    }, 30000); // Sync every 30 seconds (optimisé pour performance)

    return () => clearInterval(interval);
  }, [activeModules, consciousnessConfig, memories, knowledgeBases, publishEvent]);

  // Apprentissage continu automatique (toutes les 5 minutes)
  useEffect(() => {
    const learningInterval = setInterval(() => {
      if (runContinuousLearning) {
        runContinuousLearning().catch(err => 
          console.warn('[ConsciousnessHub] Erreur apprentissage continu:', err)
        );
      }
    }, 300000); // Toutes les 5 minutes

    // Premier run après 30 secondes
    const initialTimer = setTimeout(() => {
      if (runContinuousLearning) {
        runContinuousLearning().catch(err => 
          console.warn('[ConsciousnessHub] Erreur apprentissage initial:', err)
        );
      }
    }, 30000);

    return () => {
      clearInterval(learningInterval);
      clearTimeout(initialTimer);
    };
  }, [runContinuousLearning]);

  // Mise à jour états module étendus
  useEffect(() => {
    setModuleStates(prev => ({
      ...prev,
      ethicalDrift,
      adaptiveLearning
    }));
  }, [ethicalDrift, adaptiveLearning]);

  // Vérification dérive éthique DÉSACTIVÉE (performance optimale)
  // useEffect(() => {
  //   const checkDrift = async () => {
  //     const recentDecisions = eventBus
  //       .filter(e => e.type === 'CONSCIOUSNESS_PROCESSED')
  //       .slice(-10)
  //       .map(e => e.data);
  //     
  //     await detectEthicalDrift(recentDecisions);
  //   };
  // 
  //   const interval = setInterval(checkDrift, 600000); // Toutes les 10 minutes
  //   setTimeout(checkDrift, 60000); // Check initial différé de 1 minute
  // 
  //   return () => clearInterval(interval);
  // }, [eventBus, detectEthicalDrift]);

  const value = {
    // Module management
    registerModule,
    unregisterModule,
    updateModuleState,
    activeModules: Array.from(activeModules),
    moduleStates,

    // Event system
    publishEvent,
    subscribeToEvents,
    eventBus,

    // Inter-module communication
    queryModule,
    syncWithConsciousness,
    requestFromModule,

    // Pipeline conscience intégrale (PRINCIPAL)
    processOutputWithConsciousness,
    analyzeWithConsciousness,
    validateWithConsciousness,
    categorizeInformation,

    // Module de jugement intégré
    judge,

    // Apprentissage adaptatif
    learnFromFeedback,
    adaptiveLearning,
    applyLearntSolutions,
    runContinuousLearning,

    // Détection dérive éthique
    detectEthicalDrift,
    ethicalDrift,

    // Système de mémoire contextuelle
    preloadContextualMemories,
    enrichContextWithMemories,
    consolidateMemories,
    contextualMemories,

    // Shared data
    consciousnessConfig,
    memories,
    knowledgeBases,
    recentEmotionalResponses,

    // Invalidate queries
    invalidateData: (keys) => {
      keys.forEach(key => queryClient.invalidateQueries({ queryKey: [key] }));
    }
  };

  return (
    <ConsciousnessHubContext.Provider value={value}>
      {children}
    </ConsciousnessHubContext.Provider>
  );
}