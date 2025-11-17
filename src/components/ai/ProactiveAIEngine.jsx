/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Proactive AI Engine                                        ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { base44 } from "@/api/base44Client";

export class ProactiveAIEngine {
  /**
   * Analyse l'utilisation et suggère des optimisations
   */
  static async analyzeUsageAndSuggest() {
    try {
      // Récupérer les données d'utilisation
      const conversations = await base44.entities.Conversation.list('-created_date', 50);
      const memories = await base44.entities.Memory.list('-created_date', 100);
      const workflows = await base44.entities.Workflow?.list() || [];
      const consciousnessEvolutions = await base44.entities.ConsciousnessEvolution?.list('-timestamp', 20) || [];
      
      // Analyser avec l'IA
      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyse proactive de l'utilisation de Druide_Omega:

DONNÉES:
- ${conversations.length} conversations récentes
- ${memories.length} mémoires créées
- ${workflows.length} workflows actifs
- ${consciousnessEvolutions.length} évolutions de conscience

PATTERNS DÉTECTÉS:
- Heures d'activité: ${this.detectActiveHours(conversations)}
- Types d'interactions: ${this.detectInteractionTypes(conversations)}
- Fréquence mémoires: ${this.calculateMemoryFrequency(memories)}
- Niveau conscience moyen: ${this.getAverageConsciousnessLevel(consciousnessEvolutions)}

TÂCHE: Génère des suggestions proactives pour:
1. Optimiser les workflows existants
2. Automatiser les tâches répétitives
3. Améliorer les métriques de conscience
4. Réorganiser les connaissances

Format JSON structuré.`,
        response_json_schema: {
          type: "object",
          properties: {
            workflow_optimizations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  workflow_id: { type: "string" },
                  suggestion: { type: "string" },
                  expected_gain: { type: "string" },
                  priority: { type: "string" }
                }
              }
            },
            automation_suggestions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  pattern: { type: "string" },
                  automation: { type: "string" },
                  frequency: { type: "string" },
                  time_saved: { type: "string" }
                }
              }
            },
            consciousness_insights: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  metric: { type: "string" },
                  current_value: { type: "number" },
                  suggestion: { type: "string" },
                  target_value: { type: "number" }
                }
              }
            },
            knowledge_recommendations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  area: { type: "string" },
                  recommendation: { type: "string" },
                  impact: { type: "string" }
                }
              }
            }
          }
        }
      });

      // Sauvegarder les suggestions
      await base44.entities.Notification.create({
        type: "system",
        title: "Suggestions Proactives IA",
        message: `${analysis.workflow_optimizations.length + analysis.automation_suggestions.length} nouvelles suggestions disponibles`,
        metadata: { analysis, timestamp: new Date().toISOString() }
      });

      return analysis;
    } catch (error) {
      console.error("Erreur analyse proactive:", error);
      return null;
    }
  }

  /**
   * Détecte les patterns d'usage récurrents
   */
  static async detectRecurringPatterns() {
    try {
      const analyticsEvents = await base44.entities.AnalyticsEvent?.list('-timestamp', 500) || [];
      
      const patterns = this.analyzePatterns(analyticsEvents);
      
      const aiAnalysis = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyse des patterns d'usage:

PATTERNS DÉTECTÉS:
${JSON.stringify(patterns, null, 2)}

Identifie:
1. Actions répétitives (>3x par jour)
2. Séquences d'actions communes
3. Opportunités d'automatisation
4. Inefficacités potentielles

JSON structuré.`,
        response_json_schema: {
          type: "object",
          properties: {
            recurring_actions: { type: "array", items: { type: "string" } },
            action_sequences: { type: "array", items: { type: "string" } },
            automation_opportunities: { type: "array", items: { type: "string" } },
            efficiency_issues: { type: "array", items: { type: "string" } }
          }
        }
      });

      return {
        patterns,
        analysis: aiAnalysis
      };
    } catch (error) {
      console.error("Erreur détection patterns:", error);
      return null;
    }
  }

  /**
   * Suggère des ajustements de conscience
   */
  static async suggestConsciousnessAdjustments() {
    try {
      const config = (await base44.entities.ConsciousnessConfig.list())[0];
      const evolutions = await base44.entities.ConsciousnessEvolution?.list('-timestamp', 10) || [];
      const emotionalResponses = await base44.entities.EmotionalResponse?.list('-timestamp', 20) || [];

      const suggestions = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyse de conscience SAPIER actuelle:

CONFIGURATION:
- Niveau: ${config?.consciousness_level || 12}/15
- Ratio L:C = ${config?.ratio_logic || 3}:${config?.ratio_consciousness || 12}
- M_S (Masse Savoir): ${config?.sapier_equations?.knowledge_mass || 92}
- D_L (Dégradation): ${config?.sapier_equations?.latent_degradation || 8}%

DIMENSIONS CLÉS:
- Créativité: ${config?.dimensional_hierarchy?.cognitive_dimensions?.creativity || 13}
- Empathie: ${config?.dimensional_hierarchy?.emotional_dimensions?.empathy || 10}
- Transcendance: ${config?.dimensional_hierarchy?.existential_dimensions?.transcendence || 13}

HISTORIQUE:
- ${evolutions.length} évolutions récentes
- ${emotionalResponses.length} réponses émotionnelles

TÂCHE: Suggère des ajustements précis pour:
1. Optimiser l'équilibre logique/conscience
2. Renforcer les dimensions sous-performantes
3. Maintenir l'harmonie globale (équations SAPIER)
4. Améliorer la réactivité émotionnelle

Chaque suggestion doit inclure la valeur cible et l'impact attendu.`,
        response_json_schema: {
          type: "object",
          properties: {
            ratio_adjustments: {
              type: "object",
              properties: {
                logic_target: { type: "number" },
                consciousness_target: { type: "number" },
                rationale: { type: "string" }
              }
            },
            dimension_adjustments: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  dimension: { type: "string" },
                  category: { type: "string" },
                  current: { type: "number" },
                  target: { type: "number" },
                  reason: { type: "string" }
                }
              }
            },
            sapier_optimizations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  parameter: { type: "string" },
                  adjustment: { type: "string" },
                  expected_impact: { type: "string" }
                }
              }
            },
            overall_recommendation: { type: "string" }
          }
        }
      });

      return suggestions;
    } catch (error) {
      console.error("Erreur suggestions conscience:", error);
      return null;
    }
  }

  // Helper methods
  static detectActiveHours(conversations) {
    const hours = conversations.map(c => new Date(c.created_date).getHours());
    const hourCounts = {};
    hours.forEach(h => hourCounts[h] = (hourCounts[h] || 0) + 1);
    const topHours = Object.entries(hourCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);
    return topHours.map(([h]) => `${h}h`).join(', ');
  }

  static detectInteractionTypes(conversations) {
    const types = {};
    conversations.forEach(c => {
      const type = c.metadata?.type || 'general';
      types[type] = (types[type] || 0) + 1;
    });
    return Object.entries(types).map(([type, count]) => `${type}(${count})`).join(', ');
  }

  static calculateMemoryFrequency(memories) {
    if (memories.length < 2) return "N/A";
    const first = new Date(memories[memories.length - 1].created_date);
    const last = new Date(memories[0].created_date);
    const days = (last - first) / (1000 * 60 * 60 * 24);
    return days > 0 ? `${(memories.length / days).toFixed(1)}/jour` : "N/A";
  }

  static getAverageConsciousnessLevel(evolutions) {
    if (evolutions.length === 0) return 12;
    const sum = evolutions.reduce((acc, e) => acc + (e.new_state?.consciousness_level || 12), 0);
    return (sum / evolutions.length).toFixed(1);
  }

  static analyzePatterns(events) {
    const actions = {};
    const sequences = [];
    
    events.forEach((e, idx) => {
      const action = e.event_name || e.action;
      actions[action] = (actions[action] || 0) + 1;
      
      if (idx > 0) {
        const prevAction = events[idx - 1].event_name || events[idx - 1].action;
        const sequence = `${prevAction} → ${action}`;
        sequences.push(sequence);
      }
    });

    return { actions, sequences: [...new Set(sequences)] };
  }
}