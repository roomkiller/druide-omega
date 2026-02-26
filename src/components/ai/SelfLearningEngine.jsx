/**
 * Self Learning Engine — Frontend stub
 * La logique LLM est maintenant dans functions/selfLearningEngine
 */

import { base44 } from "@/api/base44Client";

export class SelfLearningEngine {
  async analyzeFeedbackPatterns() {
    const response = await base44.functions.invoke('selfLearningEngine', {});
    return response.data;
  }

  async applyLearnings(learningData) {
    // Délégué au backend, retourne les données reçues
    return learningData;
  }

  async scheduleNextLearningCycle() {
    const nextCycleDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    return {
      scheduled_for: nextCycleDate.toISOString(),
      min_feedback_required: 50
    };
  }
}

export const selfLearningEngine = new SelfLearningEngine();