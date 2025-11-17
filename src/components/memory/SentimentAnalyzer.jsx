/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Advanced Sentiment Analyzer                                ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { base44 } from "@/api/base44Client";

export class SentimentAnalyzer {
  static async analyzeText(text) {
    if (!text || text.length < 3) {
      return { sentiment: "neutral", score: 0, confidence: 0 };
    }

    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyse le sentiment de ce texte de manière nuancée:

"${text}"

Retourne une analyse détaillée du sentiment, de l'intensité émotionnelle et du contexte.`,
        response_json_schema: {
          type: "object",
          properties: {
            sentiment: {
              type: "string",
              enum: ["very_positive", "positive", "neutral", "negative", "very_negative"]
            },
            score: { type: "number", description: "Score -1 to 1" },
            confidence: { type: "number", description: "0 to 1" },
            emotions: {
              type: "array",
              items: { type: "string" }
            },
            intensity: { type: "number", description: "0 to 10" },
            context: { type: "string" }
          }
        }
      });

      return result;
    } catch (error) {
      console.error("Erreur analyse sentiment:", error);
      return { sentiment: "neutral", score: 0, confidence: 0 };
    }
  }

  static async trackSentimentHistory(userId, sentiment) {
    try {
      const existing = await base44.entities.Memory.filter({
        memory_type: "sentiment_history",
        created_by: userId
      });

      if (existing.length > 0) {
        const history = existing[0];
        const sentiments = history.context?.sentiments || [];
        sentiments.push({
          ...sentiment,
          timestamp: new Date().toISOString()
        });

        await base44.entities.Memory.update(history.id, {
          context: {
            ...history.context,
            sentiments: sentiments.slice(-50),
            last_sentiment: sentiment
          }
        });
      } else {
        await base44.entities.Memory.create({
          memory_type: "sentiment_history",
          content: "Historique d'analyse de sentiments",
          importance: 5,
          tags: ["sentiment", "history"],
          context: {
            sentiments: [{ ...sentiment, timestamp: new Date().toISOString() }],
            last_sentiment: sentiment
          }
        });
      }
    } catch (error) {
      console.error("Erreur tracking sentiment:", error);
    }
  }

  static getSentimentTrend(sentimentHistory) {
    if (!sentimentHistory || sentimentHistory.length < 3) {
      return "stable";
    }

    const recent = sentimentHistory.slice(-5);
    const scores = recent.map(s => s.score || 0);
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;

    if (avg > 0.3) return "improving";
    if (avg < -0.3) return "declining";
    return "stable";
  }
}