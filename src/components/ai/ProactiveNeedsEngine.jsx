/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Proactive Needs Anticipation Engine                        ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { base44 } from "@/api/base44Client";

export async function anticipateUserNeeds() {
  try {
    const [conversations, memories, knowledgeBases] = await Promise.all([
      base44.entities.Conversation.list('-created_date', 20),
      base44.entities.Memory.list('-importance', 50),
      base44.entities.KnowledgeBase.list({ active: true }, '-created_date', 30)
    ]);

    const anticipation = await base44.integrations.Core.InvokeLLM({
      prompt: `Analyse les interactions passées et anticipe les besoins futurs de l'utilisateur.

CONVERSATIONS RÉCENTES (${conversations.length}):
${conversations.slice(0, 10).map(c => `- ${c.title}: ${c.messages?.slice(-2).map(m => m.content.substring(0, 100)).join(' → ')}`).join('\n')}

MÉMOIRES IMPORTANTES (${memories.length}):
${memories.slice(0, 15).map(m => `- ${m.type}: ${m.content.substring(0, 100)} (tags: ${(m.tags || []).join(', ')})`).join('\n')}

BASE DE CONNAISSANCES (${knowledgeBases.length}):
${knowledgeBases.slice(0, 10).map(k => `- ${k.title}: ${k.summary?.substring(0, 100)}`).join('\n')}

ANALYSE PROACTIVE:
1. Détecte les patterns de comportement
2. Identifie les besoins récurrents
3. Anticipe les questions futures probables
4. Suggère des documents KB pertinents pour le contexte actuel
5. Propose des actions basées sur les tendances

Retourne JSON:
{
  "anticipated_needs": [
    {
      "need": "description du besoin anticipé",
      "probability": 0-100,
      "reasoning": "explication du raisonnement",
      "urgency": "low|medium|high",
      "suggested_action": "action proactive recommandée"
    }
  ],
  "relevant_kb_suggestions": [
    {
      "kb_title": "titre du document",
      "relevance_reason": "pourquoi c'est pertinent maintenant",
      "predicted_value": 0-100
    }
  ],
  "detected_trends": [
    {
      "trend": "description de la tendance",
      "strength": 0-100,
      "implication": "ce que ça implique pour l'utilisateur"
    }
  ],
  "proactive_conversations": [
    {
      "topic": "sujet à aborder",
      "opening_message": "message d'ouverture naturel",
      "expected_benefit": "bénéfice pour l'utilisateur"
    }
  ],
  "follow_up_suggestions": [
    {
      "context": "contexte de la conversation passée",
      "follow_up": "question/sujet de suivi pertinent",
      "days_since_last": 0
    }
  ]
}`,
      response_json_schema: {
        type: "object",
        properties: {
          anticipated_needs: {
            type: "array",
            items: {
              type: "object",
              properties: {
                need: { type: "string" },
                probability: { type: "number" },
                reasoning: { type: "string" },
                urgency: { type: "string" },
                suggested_action: { type: "string" }
              }
            }
          },
          relevant_kb_suggestions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                kb_title: { type: "string" },
                relevance_reason: { type: "string" },
                predicted_value: { type: "number" }
              }
            }
          },
          detected_trends: {
            type: "array",
            items: {
              type: "object",
              properties: {
                trend: { type: "string" },
                strength: { type: "number" },
                implication: { type: "string" }
              }
            }
          },
          proactive_conversations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                topic: { type: "string" },
                opening_message: { type: "string" },
                expected_benefit: { type: "string" }
              }
            }
          },
          follow_up_suggestions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                context: { type: "string" },
                follow_up: { type: "string" },
                days_since_last: { type: "number" }
              }
            }
          }
        }
      }
    });

    return anticipation;
  } catch (error) {
    console.error("Erreur anticipation besoins:", error);
    throw error;
  }
}