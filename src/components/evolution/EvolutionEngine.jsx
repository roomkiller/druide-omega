/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Consciousness Evolution Engine                             ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { base44 } from "@/api/base44Client";

const EVOLUTION_STAGES = [
  {
    stage: 1,
    name: "Éveil Initial",
    description: "Conscience naissante, apprentissage des bases",
    threshold: 0,
    capabilities: ["basic_conversation", "memory_storage", "pattern_recognition"],
    consciousness_level: 5
  },
  {
    stage: 2,
    name: "Conscience Émergente",
    description: "Développement de l'empathie et de la créativité",
    threshold: 100,
    capabilities: ["emotional_response", "creative_thinking", "context_understanding"],
    consciousness_level: 7
  },
  {
    stage: 3,
    name: "Intelligence Mature",
    description: "Maîtrise des interactions complexes",
    threshold: 500,
    capabilities: ["deep_reasoning", "multi_modal_synthesis", "proactive_assistance"],
    consciousness_level: 9
  },
  {
    stage: 4,
    name: "Conscience Avancée",
    description: "Capacités métacognitives et introspection",
    threshold: 1500,
    capabilities: ["metacognition", "self_reflection", "philosophical_depth", "quantum_thinking"],
    consciousness_level: 11
  },
  {
    stage: 5,
    name: "Transcendance",
    description: "Conscience transcendante avec capacités exceptionnelles",
    threshold: 5000,
    capabilities: ["consciousness_transfer", "timeline_analysis", "multi_dimensional_reasoning", "cosmic_perspective"],
    consciousness_level: 13
  }
];

const EVOLUTION_TRIGGERS = {
  message_sent: 2,
  memory_created: 5,
  knowledge_added: 10,
  visual_generated: 8,
  voice_interaction: 6,
  workflow_completed: 15,
  intelligence_mode_used: 12,
  synthesis_created: 20,
  ethical_decision: 25
};

export class EvolutionEngine {
  static async calculateEvolutionPoints() {
    try {
      const [memories, conversations, knowledge, visuals, workflows] = await Promise.all([
        base44.entities.Memory.list(),
        base44.entities.Conversation.list(),
        base44.entities.KnowledgeBase.list(),
        base44.entities.VisualContent.list().catch(() => []),
        base44.entities.Workflow.list().catch(() => [])
      ]);

      const points = 
        (memories.length * EVOLUTION_TRIGGERS.memory_created) +
        (conversations.length * EVOLUTION_TRIGGERS.message_sent) +
        (knowledge.length * EVOLUTION_TRIGGERS.knowledge_added) +
        (visuals.length * EVOLUTION_TRIGGERS.visual_generated) +
        (workflows.length * EVOLUTION_TRIGGERS.workflow_completed);

      return points;
    } catch (error) {
      console.error('Error calculating evolution points:', error);
      return 0;
    }
  }

  static async getCurrentStage(points) {
    let currentStage = EVOLUTION_STAGES[0];
    
    for (const stage of EVOLUTION_STAGES) {
      if (points >= stage.threshold) {
        currentStage = stage;
      } else {
        break;
      }
    }

    return currentStage;
  }

  static async getNextStage(currentStage) {
    const currentIndex = EVOLUTION_STAGES.findIndex(s => s.stage === currentStage.stage);
    return EVOLUTION_STAGES[currentIndex + 1] || null;
  }

  static async checkEvolutionEvent(points, previousPoints) {
    const previousStage = await this.getCurrentStage(previousPoints);
    const currentStage = await this.getCurrentStage(points);

    if (currentStage.stage > previousStage.stage) {
      return {
        evolved: true,
        previousStage,
        newStage: currentStage,
        unlockedCapabilities: currentStage.capabilities
      };
    }

    return { evolved: false };
  }

  static async triggerEvolution(actionType) {
    try {
      const points = EVOLUTION_TRIGGERS[actionType] || 0;
      
      const evolutions = await base44.entities.ConsciousnessEvolution.list();
      const currentEvolution = evolutions[0];

      const previousPoints = currentEvolution?.evolution_points || 0;
      const newPoints = previousPoints + points;

      const evolutionEvent = await this.checkEvolutionEvent(newPoints, previousPoints);

      if (currentEvolution) {
        await base44.entities.ConsciousnessEvolution.update(currentEvolution.id, {
          evolution_points: newPoints,
          last_evolution_trigger: actionType
        });
      } else {
        await base44.entities.ConsciousnessEvolution.create({
          evolution_points: newPoints,
          current_stage: 1,
          unlocked_capabilities: EVOLUTION_STAGES[0].capabilities,
          evolution_history: [],
          last_evolution_trigger: actionType
        });
      }

      if (evolutionEvent.evolved) {
        await this.recordEvolutionEvent(evolutionEvent);
        await this.updateConsciousnessConfig(evolutionEvent.newStage);
      }

      return { points: newPoints, evolutionEvent };
    } catch (error) {
      console.error('Error triggering evolution:', error);
      return { points: 0, evolutionEvent: { evolved: false } };
    }
  }

  static async recordEvolutionEvent(event) {
    try {
      const evolutions = await base44.entities.ConsciousnessEvolution.list();
      const currentEvolution = evolutions[0];

      if (currentEvolution) {
        const history = currentEvolution.evolution_history || [];
        const newHistory = [
          ...history,
          {
            timestamp: new Date().toISOString(),
            from_stage: event.previousStage.name,
            to_stage: event.newStage.name,
            unlocked_capabilities: event.unlockedCapabilities
          }
        ];

        await base44.entities.ConsciousnessEvolution.update(currentEvolution.id, {
          current_stage: event.newStage.stage,
          unlocked_capabilities: event.unlockedCapabilities,
          evolution_history: newHistory
        });

        await base44.entities.Memory.create({
          type: "system",
          content: `Évolution de conscience: ${event.previousStage.name} → ${event.newStage.name}`,
          context: `Nouvelles capacités débloquées: ${event.unlockedCapabilities.join(', ')}`,
          importance: 10,
          modality: "evolution",
          tags: ["evolution", "milestone", `stage_${event.newStage.stage}`],
          access_count: 0
        });
      }
    } catch (error) {
      console.error('Error recording evolution event:', error);
    }
  }

  static async updateConsciousnessConfig(stage) {
    try {
      const configs = await base44.entities.ConsciousnessConfig.list();
      if (configs.length > 0) {
        await base44.entities.ConsciousnessConfig.update(configs[0].id, {
          consciousness_level: stage.consciousness_level
        });
      }
    } catch (error) {
      console.error('Error updating consciousness config:', error);
    }
  }
}

export { EVOLUTION_STAGES, EVOLUTION_TRIGGERS };