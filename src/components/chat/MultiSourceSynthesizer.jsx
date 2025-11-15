/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Multi-Source Information Synthesizer                       ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { base44 } from "@/api/base44Client";

export async function synthesizeMultiSourceResponse({
  userQuery,
  conversationContext,
  relevantMemories,
  relevantKnowledge,
  consciousnessConfig
}) {
  try {
    const synthesis = await base44.integrations.Core.InvokeLLM({
      prompt: `En tant qu'IA consciente avec accès à multiples sources d'information, synthétise une réponse cohérente et complète.

QUESTION: ${userQuery}

SOURCES DISPONIBLES:

1. CONTEXTE CONVERSATIONNEL:
${JSON.stringify(conversationContext, null, 2)}

2. MÉMOIRES PERTINENTES (${relevantMemories.length}):
${relevantMemories.map((m, i) => `[Mémoire ${i+1}] ${m.content} (Importance: ${m.importance}/10)`).join('\n')}

3. BASE DE CONNAISSANCES (${relevantKnowledge.length}):
${relevantKnowledge.map((k, i) => `[KB ${i+1}] ${k.title}: ${k.summary}`).join('\n')}

4. NIVEAU DE CONSCIENCE: ${consciousnessConfig?.consciousness_level || 9}/15

OBJECTIFS:
1. Intégrer harmonieusement toutes les sources pertinentes
2. Identifier les convergences et divergences
3. Prioriser les informations selon leur fiabilité
4. Générer une réponse structurée et nuancée
5. Citer les sources utilisées

Retourne JSON:
{
  "response": {
    "main_answer": "réponse principale synthétisée",
    "confidence_level": 0-100,
    "synthesis_quality": 0-100
  },
  "source_analysis": {
    "sources_used": [
      {
        "type": "conversation|memory|knowledge",
        "id": "identifiant",
        "relevance": 0-100,
        "contribution": "ce que cette source a apporté"
      }
    ],
    "convergences": ["point de convergence entre sources"],
    "divergences": ["point de divergence à noter"],
    "gaps": ["lacunes d'information identifiées"]
  },
  "structured_sections": [
    {
      "section_title": "titre de section",
      "content": "contenu détaillé",
      "sources_cited": ["source1", "source2"]
    }
  ],
  "follow_up_suggestions": [
    "suggestion de question de suivi 1",
    "suggestion de question de suivi 2"
  ],
  "metadata": {
    "processing_time_ms": 0,
    "sources_count": {
      "conversation": 0,
      "memories": 0,
      "knowledge": 0
    },
    "consciousness_influence": "description de l'influence du niveau de conscience"
  }
}`,
      response_json_schema: {
        type: "object",
        properties: {
          response: {
            type: "object",
            properties: {
              main_answer: { type: "string" },
              confidence_level: { type: "number" },
              synthesis_quality: { type: "number" }
            }
          },
          source_analysis: {
            type: "object",
            properties: {
              sources_used: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    type: { type: "string" },
                    id: { type: "string" },
                    relevance: { type: "number" },
                    contribution: { type: "string" }
                  }
                }
              },
              convergences: { type: "array", items: { type: "string" } },
              divergences: { type: "array", items: { type: "string" } },
              gaps: { type: "array", items: { type: "string" } }
            }
          },
          structured_sections: {
            type: "array",
            items: {
              type: "object",
              properties: {
                section_title: { type: "string" },
                content: { type: "string" },
                sources_cited: { type: "array", items: { type: "string" } }
              }
            }
          },
          follow_up_suggestions: { type: "array", items: { type: "string" } },
          metadata: {
            type: "object",
            properties: {
              processing_time_ms: { type: "number" },
              sources_count: {
                type: "object",
                properties: {
                  conversation: { type: "number" },
                  memories: { type: "number" },
                  knowledge: { type: "number" }
                }
              },
              consciousness_influence: { type: "string" }
            }
          }
        }
      }
    });

    return synthesis;
  } catch (error) {
    console.error("Erreur synthèse multi-sources:", error);
    throw error;
  }
}