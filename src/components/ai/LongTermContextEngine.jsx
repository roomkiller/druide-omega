/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Long-Term Conversational Context Engine                    ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { base44 } from "@/api/base44Client";

export class LongTermContextEngine {
  constructor() {
    this.contextWindow = 30; // Last 30 interactions
    this.semanticThreshold = 0.7;
  }

  async buildContextForQuery(userQuery, currentConversationId) {
    try {
      // 1. Get recent conversation history
      const recentMessages = await this.getRecentMessages(currentConversationId);

      // 2. Get relevant past conversations
      const relevantPastConversations = await this.findRelevantPastConversations(userQuery);

      // 3. Get user's long-term preferences
      const userPreferences = await this.getUserPreferences();

      // 4. Get conversation patterns
      const conversationPatterns = await this.analyzeConversationPatterns();

      // 5. Build unified context
      const unifiedContext = {
        recent_messages: recentMessages,
        relevant_past_conversations: relevantPastConversations,
        user_preferences: userPreferences,
        conversation_patterns: conversationPatterns,
        context_quality_score: 0
      };

      // 6. Calculate context quality
      unifiedContext.context_quality_score = this.calculateContextQuality(unifiedContext);

      return unifiedContext;
    } catch (error) {
      console.error("Erreur construction contexte:", error);
      return null;
    }
  }

  async getRecentMessages(conversationId) {
    try {
      const conversations = await base44.entities.Conversation.filter(
        { id: conversationId },
        '-created_date',
        1
      );

      if (conversations.length === 0) return [];

      const messages = conversations[0].messages || [];
      return messages.slice(-this.contextWindow);
    } catch (error) {
      return [];
    }
  }

  async findRelevantPastConversations(query) {
    try {
      const allConversations = await base44.entities.Conversation.list('-created_date', 50);

      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyse cette requête et identifie les conversations passées les plus pertinentes:

REQUÊTE ACTUELLE: ${query}

CONVERSATIONS PASSÉES:
${allConversations.slice(0, 20).map((c, i) => `[${i}] ${c.title}: ${c.messages?.slice(-2).map(m => m.content).join(' | ')}`).join('\n')}

Identifie les 3 conversations les plus pertinentes pour fournir du contexte.

Retourne JSON:
{
  "relevant_conversations": [
    {
      "conversation_index": 0,
      "relevance_score": 0-100,
      "relevance_reason": "explication",
      "key_insights": ["insight1", "insight2"]
    }
  ]
}`,
        response_json_schema: {
          type: "object",
          properties: {
            relevant_conversations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  conversation_index: { type: "number" },
                  relevance_score: { type: "number" },
                  relevance_reason: { type: "string" },
                  key_insights: { type: "array", items: { type: "string" } }
                }
              }
            }
          }
        }
      });

      return analysis.relevant_conversations.map(rc => ({
        ...rc,
        conversation: allConversations[rc.conversation_index]
      }));
    } catch (error) {
      return [];
    }
  }

  async getUserPreferences() {
    try {
      const user = await base44.auth.me();
      
      return {
        communication_style: user.preferred_communication_style || "balanced",
        topics_of_interest: user.topics_of_interest || [],
        interaction_frequency: user.interaction_frequency || "moderate",
        detail_preference: user.detail_preference || "medium",
        language_formality: user.language_formality || "casual"
      };
    } catch (error) {
      return {};
    }
  }

  async analyzeConversationPatterns() {
    try {
      const recentConversations = await base44.entities.Conversation.list('-created_date', 20);

      const patterns = {
        common_topics: [],
        typical_query_types: [],
        response_preferences: {},
        interaction_times: [],
        avg_conversation_length: 0
      };

      // Analyze with LLM
      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyse ces conversations pour identifier les patterns:

${recentConversations.map(c => `[${c.title}]: ${c.messages?.length || 0} messages`).join('\n')}

Identifie:
1. Sujets récurrents
2. Types de questions fréquentes
3. Préférences de réponse
4. Patterns temporels

Retourne JSON avec les patterns détectés.`,
        response_json_schema: {
          type: "object",
          properties: {
            common_topics: { type: "array", items: { type: "string" } },
            typical_query_types: { type: "array", items: { type: "string" } },
            response_preferences: { type: "object" },
            patterns_confidence: { type: "number" }
          }
        }
      });

      return { ...patterns, ...analysis };
    } catch (error) {
      return {};
    }
  }

  calculateContextQuality(context) {
    let score = 0;
    
    if (context.recent_messages?.length > 0) score += 30;
    if (context.relevant_past_conversations?.length > 0) score += 25;
    if (Object.keys(context.user_preferences || {}).length > 0) score += 25;
    if (Object.keys(context.conversation_patterns || {}).length > 0) score += 20;

    return Math.min(score, 100);
  }

  async saveContextSnapshot(conversationId, context) {
    try {
      await base44.entities.Conversation.update(conversationId, {
        long_term_context: context,
        context_last_updated: new Date().toISOString()
      });
    } catch (error) {
      console.error("Erreur sauvegarde contexte:", error);
    }
  }
}

export const longTermContextEngine = new LongTermContextEngine();