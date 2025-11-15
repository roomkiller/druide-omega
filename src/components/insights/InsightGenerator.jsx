/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Proactive Insights Generator                               ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { base44 } from "@/api/base44Client";

export async function generateProactiveInsights() {
  try {
    const [memories, knowledgeBases, conversations] = await Promise.all([
      base44.entities.Memory.list('-created_date', 100),
      base44.entities.KnowledgeBase.list('-created_date', 50),
      base44.entities.Conversation.list('-created_date', 30)
    ]);

    const analysis = await base44.integrations.Core.InvokeLLM({
      prompt: `Analyse ces données agrégées et génère des insights proactifs et tendances émergentes:

MÉMOIRES (${memories.length}):
${memories.slice(0, 20).map(m => `- ${m.type}: ${m.content.substring(0, 100)} (Importance: ${m.importance})`).join('\n')}

BASE DE CONNAISSANCES (${knowledgeBases.length}):
${knowledgeBases.slice(0, 10).map(k => `- ${k.title}: ${k.summary?.substring(0, 100)}`).join('\n')}

CONVERSATIONS (${conversations.length}):
${conversations.slice(0, 10).map(c => `- ${c.title} (${c.messages?.length || 0} messages)`).join('\n')}

OBJECTIFS:
1. Identifier des patterns non évidents
2. Détecter des tendances émergentes
3. Suggérer des actions proactives
4. Révéler des connexions cachées
5. Anticiper les besoins futurs

Retourne JSON:
{
  "insights": [
    {
      "title": "titre court et percutant",
      "description": "description détaillée",
      "category": "pattern|trend|opportunity|warning|connection",
      "priority": 0-100,
      "confidence": 0-100,
      "data_sources": ["memory|kb|conversation"],
      "actionable_steps": ["action1", "action2"],
      "time_relevance": "immediate|short_term|long_term"
    }
  ],
  "emerging_trends": [
    {
      "trend": "description de la tendance",
      "strength": 0-100,
      "growth_rate": "accelerating|stable|declining",
      "supporting_evidence": ["preuve1", "preuve2"]
    }
  ],
  "knowledge_gaps": [
    {
      "gap": "lacune identifiée",
      "importance": 0-100,
      "recommended_action": "action recommandée"
    }
  ],
  "predictive_insights": [
    {
      "prediction": "prédiction basée sur les données",
      "probability": 0-100,
      "timeframe": "description",
      "impact": "low|medium|high"
    }
  ]
}`,
      response_json_schema: {
        type: "object",
        properties: {
          insights: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                description: { type: "string" },
                category: { type: "string" },
                priority: { type: "number" },
                confidence: { type: "number" },
                data_sources: { type: "array", items: { type: "string" } },
                actionable_steps: { type: "array", items: { type: "string" } },
                time_relevance: { type: "string" }
              }
            }
          },
          emerging_trends: {
            type: "array",
            items: {
              type: "object",
              properties: {
                trend: { type: "string" },
                strength: { type: "number" },
                growth_rate: { type: "string" },
                supporting_evidence: { type: "array", items: { type: "string" } }
              }
            }
          },
          knowledge_gaps: {
            type: "array",
            items: {
              type: "object",
              properties: {
                gap: { type: "string" },
                importance: { type: "number" },
                recommended_action: { type: "string" }
              }
            }
          },
          predictive_insights: {
            type: "array",
            items: {
              type: "object",
              properties: {
                prediction: { type: "string" },
                probability: { type: "number" },
                timeframe: { type: "string" },
                impact: { type: "string" }
              }
            }
          }
        }
      }
    });

    return analysis;
  } catch (error) {
    console.error("Erreur génération insights:", error);
    throw error;
  }
}