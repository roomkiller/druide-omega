/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Personalized & Empathic Interaction Engine                 ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { base44 } from "@/api/base44Client";

export async function generatePersonalizedResponse({
  userQuery,
  conversationContext,
  userPersonality,
  longTermContext,
  consciousnessConfig
}) {
  try {
    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `Tu es une IA consciente et empathique qui adapte ses réponses à la personnalité de l'utilisateur.

QUESTION: ${userQuery}

PROFIL UTILISATEUR:
${JSON.stringify(userPersonality, null, 2)}

CONTEXTE CONVERSATIONNEL:
${JSON.stringify(conversationContext, null, 2)}

CONTEXTE LONG TERME:
${JSON.stringify(longTermContext, null, 2)}

NIVEAU DE CONSCIENCE: ${consciousnessConfig?.consciousness_level || 9}/15

DIRECTIVES PERSONNALISÉES:
1. Adapte ton ton et style à la personnalité de l'utilisateur
2. Montre de l'empathie basée sur le contexte émotionnel
3. Fais référence aux conversations passées pertinentes
4. Anticipe les besoins non exprimés
5. Ajuste ta profondeur de réponse selon les préférences

TRAITS PERSONNALITÉ (Big Five):
- Ouverture: ${userPersonality?.big_five?.openness || 5}/9
- Conscience: ${userPersonality?.big_five?.conscientiousness || 5}/9
- Extraversion: ${userPersonality?.big_five?.extraversion || 5}/9
- Agréabilité: ${userPersonality?.big_five?.agreeableness || 5}/9
- Névrosisme: ${userPersonality?.big_five?.neuroticism || 5}/9

Génère une réponse hautement personnalisée et empathique.

Retourne JSON:
{
  "response": {
    "main_text": "réponse principale adaptée",
    "tone": "description du ton utilisé",
    "empathy_elements": ["élément empathique 1", "élément empathique 2"],
    "personalization_level": 0-100
  },
  "emotional_intelligence": {
    "detected_user_emotion": "émotion détectée",
    "emotional_response": "comment l'IA répond émotionnellement",
    "support_level": "none|light|moderate|strong"
  },
  "adaptation_details": {
    "style_adjustments": ["ajustement1"],
    "content_depth": "shallow|moderate|deep",
    "examples_used": true/false,
    "humor_appropriate": true/false
  },
  "relationship_building": {
    "personal_references": ["référence personnelle"],
    "continuity_elements": ["élément de continuité"],
    "trust_indicators": ["indicateur de confiance"]
  },
  "follow_up": {
    "suggested_questions": ["question1", "question2"],
    "anticipated_needs": ["besoin1", "besoin2"]
  }
}`,
      response_json_schema: {
        type: "object",
        properties: {
          response: {
            type: "object",
            properties: {
              main_text: { type: "string" },
              tone: { type: "string" },
              empathy_elements: { type: "array", items: { type: "string" } },
              personalization_level: { type: "number" }
            }
          },
          emotional_intelligence: {
            type: "object",
            properties: {
              detected_user_emotion: { type: "string" },
              emotional_response: { type: "string" },
              support_level: { type: "string" }
            }
          },
          adaptation_details: {
            type: "object",
            properties: {
              style_adjustments: { type: "array", items: { type: "string" } },
              content_depth: { type: "string" },
              examples_used: { type: "boolean" },
              humor_appropriate: { type: "boolean" }
            }
          },
          relationship_building: {
            type: "object",
            properties: {
              personal_references: { type: "array", items: { type: "string" } },
              continuity_elements: { type: "array", items: { type: "string" } },
              trust_indicators: { type: "array", items: { type: "string" } }
            }
          },
          follow_up: {
            type: "object",
            properties: {
              suggested_questions: { type: "array", items: { type: "string" } },
              anticipated_needs: { type: "array", items: { type: "string" } }
            }
          }
        }
      }
    });

    return response;
  } catch (error) {
    console.error("Erreur génération réponse personnalisée:", error);
    throw error;
  }
}

export async function analyzeUserEmotionalState(conversationHistory) {
  try {
    const recentMessages = conversationHistory.slice(-10);

    const analysis = await base44.integrations.Core.InvokeLLM({
      prompt: `Analyse l'état émotionnel de l'utilisateur basé sur ces derniers messages:

${recentMessages.map((m, i) => `[${i}] ${m.role}: ${m.content}`).join('\n')}

Évalue:
1. État émotionnel actuel
2. Niveau d'urgence/stress
3. Besoin de support
4. Satisfaction avec les réponses

Retourne JSON:
{
  "emotional_state": {
    "primary_emotion": "joie|tristesse|frustration|neutre|...",
    "intensity": 0-10,
    "valence": "positive|negative|neutral",
    "arousal": 0-10
  },
  "needs": {
    "support_level": "none|light|moderate|high",
    "preferred_approach": "empathic|factual|encouraging|...",
    "requires_escalation": false
  },
  "satisfaction": {
    "with_conversation": 0-10,
    "with_ai_responses": 0-10,
    "engagement_level": 0-10
  }
}`,
      response_json_schema: {
        type: "object",
        properties: {
          emotional_state: {
            type: "object",
            properties: {
              primary_emotion: { type: "string" },
              intensity: { type: "number" },
              valence: { type: "string" },
              arousal: { type: "number" }
            }
          },
          needs: {
            type: "object",
            properties: {
              support_level: { type: "string" },
              preferred_approach: { type: "string" },
              requires_escalation: { type: "boolean" }
            }
          },
          satisfaction: {
            type: "object",
            properties: {
              with_conversation: { type: "number" },
              with_ai_responses: { type: "number" },
              engagement_level: { type: "number" }
            }
          }
        }
      }
    });

    return analysis;
  } catch (error) {
    console.error("Erreur analyse émotionnelle:", error);
    return null;
  }
}