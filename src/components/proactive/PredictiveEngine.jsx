/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Predictive AI Engine                                       ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { base44 } from "@/api/base44Client";

export class PredictiveEngine {
  static async analyzeUserPatterns() {
    try {
      const [conversations, memories, analytics, knowledge] = await Promise.all([
        base44.entities.Conversation.list('-last_message_at', 20),
        base44.entities.Memory.list('-created_date', 50),
        base44.entities.UserBehaviorAnalytics.list('-timestamp', 30).catch(() => []),
        base44.entities.KnowledgeBase.list('-created_date', 20)
      ]);

      return {
        conversations,
        memories,
        analytics,
        knowledge
      };
    } catch (error) {
      console.error('Error analyzing patterns:', error);
      return null;
    }
  }

  static async predictNextAction(context) {
    const patterns = await this.analyzeUserPatterns();
    if (!patterns) return null;

    try {
      const analysisPrompt = `Tu es un système d'IA prédictive. Analyse ces données utilisateur et PRÉDIS les 3 prochaines actions/besoins probables:

CONVERSATIONS RÉCENTES:
${patterns.conversations.slice(0, 5).map(c => `- ${c.title}: ${c.messages?.slice(-1)[0]?.content?.slice(0, 100)}`).join('\n')}

MÉMOIRES IMPORTANTES:
${patterns.memories.slice(0, 5).map(m => `- [${m.importance}/10] ${m.content.slice(0, 100)}`).join('\n')}

CONNAISSANCES RÉCENTES:
${patterns.knowledge.slice(0, 3).map(k => `- ${k.title}`).join('\n')}

CONTEXTE ACTUEL:
- Heure: ${new Date().getHours()}h
- Jour: ${new Date().toLocaleDateString('fr-FR', { weekday: 'long' })}
- Page: ${context.currentPage || 'Unknown'}
- Dernière action: ${context.lastAction || 'N/A'}

RETOURNE un JSON avec:
{
  "predictions": [
    {
      "type": "action" | "information" | "resource",
      "title": "Titre court",
      "description": "Description détaillée",
      "confidence": 0-100,
      "action_type": "navigate" | "create" | "search" | "suggest",
      "action_target": "URL ou entité cible",
      "reasoning": "Pourquoi cette prédiction"
    }
  ],
  "urgency_level": "low" | "medium" | "high",
  "contextual_insights": "Insights sur le contexte actuel"
}`;

      const prediction = await base44.integrations.Core.InvokeLLM({
        prompt: analysisPrompt,
        response_json_schema: {
          type: "object",
          properties: {
            predictions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: { type: "string" },
                  title: { type: "string" },
                  description: { type: "string" },
                  confidence: { type: "number" },
                  action_type: { type: "string" },
                  action_target: { type: "string" },
                  reasoning: { type: "string" }
                }
              }
            },
            urgency_level: { type: "string" },
            contextual_insights: { type: "string" }
          }
        }
      });

      await this.logPrediction(prediction, context);
      return prediction;
    } catch (error) {
      console.error('Error predicting:', error);
      return null;
    }
  }

  static async logPrediction(prediction, context) {
    try {
      await base44.entities.Memory.create({
        type: "system",
        content: `Prédictions IA: ${prediction.predictions.map(p => p.title).join(', ')}`,
        context: JSON.stringify({ context, prediction }),
        importance: 4,
        modality: "predictive",
        tags: ["prediction", "proactive", "ai_anticipation"],
        access_count: 0
      });
    } catch (error) {
      console.error('Error logging prediction:', error);
    }
  }

  static async generateProactiveSuggestions(currentInput, recentMessages) {
    try {
      const suggestionPrompt = `Basé sur l'input actuel et l'historique, génère 3 suggestions PROACTIVES:

INPUT ACTUEL: "${currentInput}"

MESSAGES RÉCENTS:
${recentMessages.slice(-5).map(m => `${m.role}: ${m.content.slice(0, 100)}`).join('\n')}

RETOURNE:
{
  "suggestions": [
    {
      "text": "Suggestion complète",
      "type": "completion" | "enhancement" | "related_action",
      "confidence": 0-100
    }
  ]
}`;

      const suggestions = await base44.integrations.Core.InvokeLLM({
        prompt: suggestionPrompt,
        response_json_schema: {
          type: "object",
          properties: {
            suggestions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  text: { type: "string" },
                  type: { type: "string" },
                  confidence: { type: "number" }
                }
              }
            }
          }
        }
      });

      return suggestions.suggestions || [];
    } catch (error) {
      console.error('Error generating suggestions:', error);
      return [];
    }
  }

  static async analyzeTimePatterns() {
    try {
      const analytics = await base44.entities.UserBehaviorAnalytics.list('-timestamp', 100);
      
      const hourlyActivity = {};
      analytics.forEach(a => {
        const hour = new Date(a.timestamp).getHours();
        hourlyActivity[hour] = (hourlyActivity[hour] || 0) + 1;
      });

      const peakHours = Object.entries(hourlyActivity)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([hour]) => parseInt(hour));

      return {
        peakHours,
        currentHour: new Date().getHours(),
        isPeakTime: peakHours.includes(new Date().getHours())
      };
    } catch (error) {
      console.error('Error analyzing time patterns:', error);
      return null;
    }
  }
}