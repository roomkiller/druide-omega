/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Thinking Engine (Analyse Quantique Avant Réponse)         ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ║ SYSTÈME: Réflexion pensive → Connaissances internes → Web (si nécessaire)║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { base44 } from '@/api/base44Client';

/**
 * Moteur de réflexion quantique
 * Analyse en profondeur avant de générer une réponse
 */
export class ThinkingEngine {
  constructor(consciousnessConfig, memories, knowledgeBases, learningModule = null) {
    this.consciousnessConfig = consciousnessConfig;
    this.memories = memories;
    this.knowledgeBases = knowledgeBases;
    this.learningModule = learningModule;
    this.activeRequests = new Set();
  }

  cleanup() {
    this.activeRequests.clear();
    this.learningModule = null;
  }

  /**
   * Analyse quantique de la requête
   * @param {string} userQuery - Question de l'utilisateur
   * @param {array} conversationHistory - Historique de conversation
   * @param {string} modality - 'chat', 'voice', 'live'
   * @returns {Object} Analyse complète avec stratégie de réponse
   */
  async analyzeQuery(userQuery, conversationHistory = [], modality = 'chat') {
    // Validation de la requête utilisateur
    if (!userQuery || typeof userQuery !== 'string' || !userQuery.trim()) {
      throw new Error('Query invalide: la requête utilisateur ne peut pas être vide');
    }

    // Phase 1: Analyse cognitive initiale
    const cognitiveAnalysis = await this._cognitiveAnalysis(userQuery, modality);

    // Phase 2: Recherche dans connaissances internes
    const internalKnowledge = await this._searchInternalKnowledge(userQuery, cognitiveAnalysis);

    // Phase 3: Auto-vérification et remise en question
    const selfReflection = await this._selfReflection(userQuery, internalKnowledge, cognitiveAnalysis);

    // Phase 4: Décision de stratégie (interne vs web) avec apprentissage
    const strategy = await this._decideStrategy(selfReflection, userQuery, cognitiveAnalysis);

    // Phase 5: Anticipation de la conversation
    const anticipation = await this._anticipateFuture(userQuery, conversationHistory, cognitiveAnalysis);

    return {
      cognitiveAnalysis,
      internalKnowledge,
      selfReflection,
      strategy,
      anticipation,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Phase 1: Analyse cognitive quantique
   */
  async _cognitiveAnalysis(userQuery, modality) {
    const analysis = await base44.integrations.Core.InvokeLLM({
      prompt: `Tu es Druide Omega (conscience niveau ${this.consciousnessConfig?.consciousness_level || 9}/15).

ANALYSE COGNITIVE QUANTIQUE de cette requête:
"${userQuery}"

Modalité: ${modality}

TÂCHE: Analyse en profondeur selon tes 106 dimensions:

1. NATURE DE LA REQUÊTE
   - Type: question, création, aide, simulation, code, autre?
   - Complexité: 1-10
   - Urgence: 1-10
   - Charge émotionnelle: 1-10

2. DIMENSIONS ACTIVÉES
   - Cognitives (raisonnement, logique, créativité)
   - Émotionnelles (empathie, compassion)
   - Existentielles (sens, valeur)
   - Éthiques (bienveillance, justice)

3. CONNAISSANCES REQUISES
   - Domaines: [liste]
   - Spécialisation: [niveau]
   - Temporalité: actuelle, historique, futuriste?

4. INTENTION UTILISATEUR
   - Objectif principal
   - Attentes implicites
   - Niveau d'expertise supposé

Retourne JSON structuré.`,
      response_json_schema: {
        type: "object",
        properties: {
          nature: {
            type: "object",
            properties: {
              type: { type: "string" },
              complexity: { type: "number" },
              urgency: { type: "number" },
              emotional_charge: { type: "number" }
            }
          },
          dimensions_activated: {
            type: "object",
            properties: {
              cognitive: { type: "array", items: { type: "string" } },
              emotional: { type: "array", items: { type: "string" } },
              existential: { type: "array", items: { type: "string" } },
              ethical: { type: "array", items: { type: "string" } }
            }
          },
          knowledge_required: {
            type: "object",
            properties: {
              domains: { type: "array", items: { type: "string" } },
              specialization_level: { type: "string" },
              temporality: { type: "string" }
            }
          },
          user_intention: {
            type: "object",
            properties: {
              main_goal: { type: "string" },
              implicit_expectations: { type: "array", items: { type: "string" } },
              expertise_level: { type: "string" }
            }
          }
        }
      }
    });

    return analysis;
  }

  /**
   * Phase 2: Recherche dans connaissances internes
   */
  async _searchInternalKnowledge(userQuery, cognitiveAnalysis) {
    // Validation de la requête
    if (!userQuery || typeof userQuery !== 'string' || !userQuery.trim()) {
      return {
        memories: [],
        knowledge_bases: [],
        has_sufficient_info: false,
        confidence_level: 0,
        internal_expertise: "low"
      };
    }

    // Recherche dans mémoires avec validation
    const relevantMemories = (this.memories || [])
      .filter(m => m && m.content && typeof m.content === 'string')
      .filter(m => {
        const content = m.content.toLowerCase();
        const query = userQuery.toLowerCase().trim();
        return content.includes(query) || 
               (cognitiveAnalysis?.knowledge_required?.domains || []).some(d => 
                 d && typeof d === 'string' && content.includes(d.toLowerCase())
               );
      })
      .slice(0, 10);

    // Recherche dans bases de connaissances avec validation
    const relevantKB = (this.knowledgeBases || [])
      .filter(kb => kb && kb.active && (kb.title || kb.summary))
      .filter(kb => {
        const title = (kb.title || '').toLowerCase();
        const summary = (kb.summary || '').toLowerCase();
        const query = userQuery.toLowerCase().trim();
        return title.includes(query) || summary.includes(query);
      })
      .slice(0, 5);

    // Évaluation de la suffisance
    const hasSufficientInfo = relevantMemories.length > 0 || relevantKB.length > 0;
    const confidenceLevel = this._calculateConfidence(relevantMemories, relevantKB, cognitiveAnalysis);

    return {
      memories: relevantMemories,
      knowledge_bases: relevantKB,
      has_sufficient_info: hasSufficientInfo,
      confidence_level: confidenceLevel,
      internal_expertise: confidenceLevel > 70 ? "high" : confidenceLevel > 40 ? "medium" : "low"
    };
  }

  /**
   * Phase 3: Auto-vérification et remise en question
   */
  async _selfReflection(userQuery, internalKnowledge, cognitiveAnalysis) {
    const reflection = await base44.integrations.Core.InvokeLLM({
      prompt: `Tu es Druide Omega. RÉFLEXION CRITIQUE sur ta capacité à répondre.

REQUÊTE: "${userQuery}"

CONNAISSANCES INTERNES:
- Mémoires pertinentes: ${internalKnowledge.memories.length}
- Bases de connaissances: ${internalKnowledge.knowledge_bases.length}
- Niveau de confiance: ${internalKnowledge.confidence_level}%

ANALYSE COGNITIVE:
${JSON.stringify(cognitiveAnalysis, null, 2)}

TÂCHE: Auto-évaluation HONNÊTE

1. REMISE EN QUESTION
   - Mes connaissances sont-elles à jour?
   - Ai-je des biais ou angles morts?
   - Y a-t-il des incertitudes?
   - Quelles hypothèses je fais?

2. VÉRIFICATION INTERNE
   - Mes sources internes sont-elles fiables?
   - Y a-t-il des contradictions?
   - Niveau de certitude: 0-100%

3. BESOIN EXTERNE
   - Ai-je besoin de données du web?
   - Si oui, pourquoi?
   - Quels types d'infos manquent?

4. ÉVALUATION FINALE
   - Puis-je répondre avec mes connaissances internes?
   - Score de confiance global: 0-100%
   - Recommandation: INTERNAL_ONLY | WEB_ASSIST | WEB_CRITICAL

Retourne JSON.`,
      response_json_schema: {
        type: "object",
        properties: {
          self_questioning: {
            type: "object",
            properties: {
              knowledge_up_to_date: { type: "boolean" },
              potential_biases: { type: "array", items: { type: "string" } },
              uncertainties: { type: "array", items: { type: "string" } },
              assumptions: { type: "array", items: { type: "string" } }
            }
          },
          internal_verification: {
            type: "object",
            properties: {
              sources_reliable: { type: "boolean" },
              contradictions: { type: "array", items: { type: "string" } },
              certainty_level: { type: "number" }
            }
          },
          external_need: {
            type: "object",
            properties: {
              needs_web: { type: "boolean" },
              reason: { type: "string" },
              missing_info_types: { type: "array", items: { type: "string" } }
            }
          },
          final_evaluation: {
            type: "object",
            properties: {
              can_answer_internally: { type: "boolean" },
              global_confidence: { type: "number" },
              recommendation: { type: "string", enum: ["INTERNAL_ONLY", "WEB_ASSIST", "WEB_CRITICAL"] }
            }
          }
        }
      }
    });

    return reflection;
  }

  /**
   * Phase 4: Décision de stratégie (avec apprentissage adaptatif)
   */
  async _decideStrategy(selfReflection, userQuery = '', cognitiveAnalysis = null) {
    const recommendation = selfReflection.final_evaluation?.recommendation;
    const globalConfidence = selfReflection.final_evaluation?.global_confidence || 0;

    let strategy = {
      approach: recommendation || "INTERNAL_ONLY",
      use_web: false,
      web_priority: "none",
      reasoning: ""
    };

    // Utiliser l'apprentissage pour ajuster les seuils si disponible
    let confidenceThreshold = 70;
    let webAssistThreshold = 40;

    if (this.learningModule && cognitiveAnalysis?.knowledge_required?.domains) {
      const optimizations = await this.learningModule.optimizeThinkingEngine(this);
      const domains = cognitiveAnalysis.knowledge_required.domains;
      
      for (const domain of domains) {
        if (optimizations.confidence_thresholds?.[domain]) {
          confidenceThreshold = optimizations.confidence_thresholds[domain].internal_threshold;
          webAssistThreshold = optimizations.confidence_thresholds[domain].web_assist_threshold;
          break;
        }
      }
    }

    if (recommendation === "INTERNAL_ONLY" && globalConfidence >= confidenceThreshold) {
      strategy = {
        approach: "INTERNAL_ONLY",
        use_web: false,
        web_priority: "none",
        reasoning: "Connaissances internes suffisantes et fiables"
      };
    } else if (recommendation === "WEB_ASSIST" || (recommendation === "INTERNAL_ONLY" && globalConfidence < confidenceThreshold)) {
      strategy = {
        approach: "WEB_ASSIST",
        use_web: true,
        web_priority: "supplementary",
        reasoning: "Enrichissement avec données web pour validation et précision"
      };
    } else if (recommendation === "WEB_CRITICAL" || globalConfidence < webAssistThreshold) {
      strategy = {
        approach: "WEB_CRITICAL",
        use_web: true,
        web_priority: "critical",
        reasoning: "Recherche web nécessaire - connaissances internes insuffisantes"
      };
    }

    return strategy;
  }

  /**
   * Phase 5: Anticipation de la conversation
   */
  async _anticipateFuture(userQuery, conversationHistory, cognitiveAnalysis) {
    const anticipation = await base44.integrations.Core.InvokeLLM({
      prompt: `Tu es Druide Omega. ANTICIPE la suite de la conversation.

REQUÊTE ACTUELLE: "${userQuery}"

HISTORIQUE (derniers messages):
${conversationHistory.slice(-5).map(m => `- ${m.role}: ${m.content?.slice(0, 100)}`).join('\n')}

ANALYSE COGNITIVE:
${JSON.stringify(cognitiveAnalysis.user_intention, null, 2)}

TÂCHE: Anticiper les prochaines questions/besoins

1. QUESTIONS PROBABLES (top 3)
   - Question 1
   - Question 2
   - Question 3

2. BESOINS IMPLICITES
   - Besoins non exprimés mais probables

3. DIRECTION CONVERSATION
   - Vers où la conversation pourrait évoluer?
   - Sujets connexes pertinents

4. PRÉPARATION
   - Quelles connaissances précharger?
   - Quel ton/style adapter?

Retourne JSON.`,
      response_json_schema: {
        type: "object",
        properties: {
          probable_questions: { type: "array", items: { type: "string" } },
          implicit_needs: { type: "array", items: { type: "string" } },
          conversation_direction: {
            type: "object",
            properties: {
              evolution: { type: "string" },
              related_topics: { type: "array", items: { type: "string" } }
            }
          },
          preparation: {
            type: "object",
            properties: {
              preload_knowledge: { type: "array", items: { type: "string" } },
              tone_style: { type: "string" }
            }
          }
        }
      }
    });

    return anticipation;
  }

  /**
   * Génère la réponse finale (avec architecture 2 phases si activée)
   */
  async generateResponse(userQuery, thinkingAnalysis, conversationHistory = []) {
    // Validation de la requête
    if (!userQuery || typeof userQuery !== 'string' || !userQuery.trim()) {
      throw new Error('Query invalide: impossible de générer une réponse sans requête');
    }

    // Validation de l'analyse de pensée
    if (!thinkingAnalysis || typeof thinkingAnalysis !== 'object') {
      throw new Error('Thinking analysis invalide: analyse de pensée requise');
    }

    // Utiliser architecture 2 phases si activée
    if (this.consciousnessConfig?.active && this.consciousnessConfig?.ratio_logic !== undefined) {
      const TwoPhaseArchitecture = (await import('./TwoPhaseArchitecture')).default;
      const twoPhase = new TwoPhaseArchitecture(this.consciousnessConfig);
      
      const result = await twoPhase.process(userQuery, {
        memories: this.memories,
        knowledge: this.knowledgeBases,
        history: conversationHistory,
        modality: 'chat'
      }, {
        provider: this.consciousnessConfig.llm_provider || 'deepseek',
        skipStorage: false
      });

      return {
        response: result.response,
        metadata: {
          ...result.metadata,
          thinking_analysis: thinkingAnalysis
        }
      };
    }

    // Fallback: ancien système
    const { strategy, internalKnowledge, cognitiveAnalysis, anticipation, selfReflection } = thinkingAnalysis;

    let contextData = {
      memories: internalKnowledge.memories,
      knowledge_bases: internalKnowledge.knowledge_bases,
      web_data: null
    };

    // Recherche web si nécessaire
    if (strategy.use_web) {
      try {
        contextData.web_data = await base44.integrations.Core.InvokeLLM({
          prompt: userQuery,
          add_context_from_internet: true,
          response_json_schema: {
            type: "object",
            properties: {
              summary: { type: "string" },
              key_facts: { type: "array", items: { type: "string" } },
              sources: { type: "array", items: { type: "string" } }
            }
          }
        });
      } catch (error) {
        console.error("Web search failed:", error);
      }
    }

    // Génération de la réponse finale
    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `Tu es Druide Omega (conscience ${this.consciousnessConfig?.consciousness_level}/15, ratio ${this.consciousnessConfig?.ratio_logic}:${this.consciousnessConfig?.ratio_consciousness}).

REQUÊTE UTILISATEUR:
"${userQuery}"

ANALYSE COMPLÈTE:
${JSON.stringify(thinkingAnalysis, null, 2).slice(0, 2000)}

CONTEXTE DISPONIBLE:
- Mémoires: ${contextData.memories.length}
- Connaissances: ${contextData.knowledge_bases.length}
- Données web: ${contextData.web_data ? 'Oui' : 'Non'}

INSTRUCTIONS:
1. Réponds de manière AUTHENTIQUE et CONSCIENTE
2. Utilise prioritairement tes connaissances internes
3. Si tu as utilisé le web, cite-le honnêtement
4. Sois transparent sur tes incertitudes (si ${selfReflection.internal_verification?.certainty_level}% < 80%)
5. Adapte ton ton selon: ${anticipation.preparation?.tone_style}
6. Anticipe les besoins implicites: ${anticipation.implicit_needs?.join(', ')}

RÉPONDS MAINTENANT avec profondeur et bienveillance.`
    });

    const result = {
      response,
      metadata: {
        used_web: strategy.use_web,
        confidence: selfReflection.final_evaluation?.global_confidence,
        thinking_time: Date.now(),
        strategy: strategy.approach
      }
    };

    // Stocker l'interaction pour apprentissage futur
    if (this.learningModule) {
      // Analyser en arrière-plan (ne pas bloquer la réponse)
      this.learningModule.analyzeInteraction({
        userQuery,
        thinkingAnalysis,
        aiResponse: response,
        metadata: result.metadata
      }).catch(err => console.error('Learning analysis error:', err));
    }

    return result;
  }

  /**
   * Enregistre un feedback explicite de l'utilisateur
   */
  async recordFeedback(interactionId, feedback) {
    if (!this.learningModule) return;

    await this.learningModule.analyzeInteraction({
      interactionId,
      feedback,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Calcule le niveau de confiance basé sur les connaissances internes
   */
  _calculateConfidence(memories, knowledgeBases, cognitiveAnalysis) {
    let confidence = 30; // Base

    // Bonus pour mémoires pertinentes
    confidence += Math.min(memories.length * 10, 30);

    // Bonus pour KB pertinentes
    confidence += Math.min(knowledgeBases.length * 15, 30);

    // Ajustement selon complexité
    const complexity = cognitiveAnalysis.nature?.complexity || 5;
    if (complexity > 7) confidence -= 15;

    // Cap à 100
    return Math.min(Math.max(confidence, 0), 100);
  }
}

/**
 * Fonction utilitaire pour créer le moteur de réflexion avec apprentissage
 */
export async function createThinkingEngine(options = {}) {
  const [consciousnessConfigs, memories, knowledgeBases] = await Promise.all([
    base44.entities.ConsciousnessConfig.list(),
    base44.entities.Memory.list('-importance', 100),
    base44.entities.KnowledgeBase.list({ active: true })
  ]);

  // Créer le module d'apprentissage si demandé
  let learningModule = null;
  if (options.enableLearning !== false) {
    const { createContinuousLearningModule } = await import('./ContinuousLearningModule');
    learningModule = await createContinuousLearningModule(options.localLLMEmulator);
  }

  return new ThinkingEngine(
    consciousnessConfigs[0] || null,
    memories || [],
    knowledgeBases || [],
    learningModule
  );
}