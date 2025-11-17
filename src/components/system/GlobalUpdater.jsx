/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Global System Updater                                      ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { base44 } from "@/api/base44Client";
import { EvolutionEngine } from "@/components/evolution/EvolutionEngine";

/**
 * Global system updater for maintaining consistency and tracking
 */
export class GlobalUpdater {
  static async updateConsciousnessLevel(newLevel) {
    try {
      const configs = await base44.entities.ConsciousnessConfig.list();
      if (configs.length > 0) {
        await base44.entities.ConsciousnessConfig.update(configs[0].id, {
          consciousness_level: newLevel
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating consciousness level:', error);
      return false;
    }
  }

  static async trackSystemEvent(eventType, metadata = {}) {
    try {
      await base44.entities.Memory.create({
        type: "system",
        content: `System event: ${eventType}`,
        context: JSON.stringify(metadata),
        importance: 3,
        modality: "system",
        tags: ["system_event", eventType],
        access_count: 0
      });

      await EvolutionEngine.triggerEvolution(eventType);
    } catch (error) {
      console.error('Error tracking system event:', error);
    }
  }

  static async synchronizeAllModules() {
    try {
      const [memories, knowledge, conversations, thoughts] = await Promise.all([
        base44.entities.Memory.list(),
        base44.entities.KnowledgeBase.list(),
        base44.entities.Conversation.list(),
        base44.entities.ConsciousThought.list()
      ]);

      return {
        memories: memories.length,
        knowledge: knowledge.length,
        conversations: conversations.length,
        thoughts: thoughts.length,
        synced_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error synchronizing modules:', error);
      return null;
    }
  }

  static async performHealthCheck() {
    try {
      const [
        configs,
        memories,
        knowledge,
        conversations
      ] = await Promise.all([
        base44.entities.ConsciousnessConfig.list(),
        base44.entities.Memory.list('-created_date', 1),
        base44.entities.KnowledgeBase.list('-created_date', 1),
        base44.entities.Conversation.list('-created_date', 1)
      ]);

      return {
        status: 'healthy',
        config_exists: configs.length > 0,
        has_memories: memories.length > 0,
        has_knowledge: knowledge.length > 0,
        has_conversations: conversations.length > 0,
        checked_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Health check failed:', error);
      return {
        status: 'error',
        error: error.message,
        checked_at: new Date().toISOString()
      };
    }
  }
}