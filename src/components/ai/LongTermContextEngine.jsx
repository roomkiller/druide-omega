/**
 * Long Term Context Engine — Frontend stub allégé
 * Les appels LLM lourds (findRelevantPastConversations, analyzeConversationPatterns)
 * sont supprimés du front. Seule la construction locale du contexte est conservée.
 */

import { base44 } from "@/api/base44Client";

export class LongTermContextEngine {
  constructor() {
    this.contextWindow = 30;
  }

  async buildContextForQuery(userQuery, currentConversationId) {
    try {
      const recentMessages = await this.getRecentMessages(currentConversationId);
      const userPreferences = await this.getUserPreferences();

      const context = {
        recent_messages: recentMessages,
        user_preferences: userPreferences,
        context_quality_score: recentMessages.length > 0 ? 60 : 20
      };

      return context;
    } catch (error) {
      console.error("Erreur construction contexte:", error);
      return null;
    }
  }

  async getRecentMessages(conversationId) {
    try {
      const conversations = await base44.entities.Conversation.filter(
        { id: conversationId }, '-created_date', 1
      );
      if (conversations.length === 0) return [];
      return (conversations[0].messages || []).slice(-this.contextWindow);
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
        language_formality: user.language_formality || "casual"
      };
    } catch (error) {
      return {};
    }
  }
}

export const longTermContextEngine = new LongTermContextEngine();