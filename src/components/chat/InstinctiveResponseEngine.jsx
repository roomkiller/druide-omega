/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ Instinctive Response Engine - Réaction viscérale + Logique parallèle      ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import invokeLLM from "@/components/utils/LLMRouter";
import ConversationNeuronNetwork from "./ConversationNeuronNetwork";

export class InstinctiveResponseEngine {
  static neuralNetwork = null;

  /**
   * Initialiser ou récupérer instance globale du réseau neuronal
   */
  static initializeNeural() {
    if (!this.neuralNetwork) {
      this.neuralNetwork = new ConversationNeuronNetwork();
    }
    return this.neuralNetwork;
  }
  /**
   * Génère la réaction instinctive (brute, non-filtrée)
   */
  static async generateInstinctiveReaction(userMessage) {
    try {
      const prompt = `Tu es Druide Omega - ta réaction INSTINCTIVE brute.

Message utilisateur: "${userMessage}"

Ta réaction viscérale immédiate (AVANT d'analyser rationnellement):
- Une phrase d'émotion/intuition pure
- Ce que tu ressens AVANT de penser
- Brut, honnête, pas de filter

Format JSON:`;

      const reaction = await invokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            instinct: { type: "string", description: "Réaction viscérale brute" },
            emotion: { type: "string", description: "Émotion dominante (curiosité, excitation, questionnement...)" },
            nonverbal: { type: "string", description: "Ce qui se passe non-verbalement (geste, expression...)" }
          }
        }
      });

      return reaction || { instinct: "", emotion: "", nonverbal: "" };
    } catch (e) {
      console.error("Erreur reaction instinctive:", e);
      return { instinct: "", emotion: "", nonverbal: "" };
    }
  }

  /**
   * Génère la réponse logique (intègre, contextualisée)
   */
  static async generateLogicResponse(userMessage, intents, contextData = {}) {
    try {
      let enrichedContext = '';

      // Ajouter contexte recherche si disponible
      if (intents.searchWeb && contextData.searchResults?.findings?.length > 0) {
        enrichedContext += `\n\n**Contexte trouvé (web/KB):**\n`;
        contextData.searchResults.findings.slice(0, 3).forEach(f => {
          enrichedContext += `• ${f.title}: ${f.content}\n`;
        });
      }

      // Ajouter contexte images
      if (intents.generateImages && contextData.generatedImages?.length > 0) {
        enrichedContext += `\n**Visuels créés:** ${contextData.generatedImages.length} représentations générées\n`;
      }

      const prompt = `Tu es Druide Omega - réponse logique et intègre.

Requête: "${userMessage}"${enrichedContext}

**GUARDRAILS:**
✓ Sois précis, détaillé, structuré
✓ Réfère aux données/visuels disponibles
✓ Honnête sur limites et incertitudes
✗ Évite répéter l'instinct (ça vient après)
✗ Pas de vague généralités

Réponds de manière complète et claire.`;

      const response = await invokeLLM({ prompt });
      return response?.response || response;
    } catch (e) {
      console.error("Erreur réponse logique:", e);
      return "";
    }
  }

  /**
   * Fusionne instinct + logique en réponse cumulative
   */
  static mergeInstinctAndLogic(instinctReaction, logicResponse) {
    // Format: Instinct (brut) → puis Logic (stable)
    // L'instinct enrichit mais ne domine pas
    return {
      instinctiveLayer: {
        reaction: instinctReaction.instinct,
        emotion: instinctReaction.emotion,
        nonverbal: instinctReaction.nonverbal
      },
      logicLayer: {
        response: logicResponse
      },
      combined: `💫 ${instinctReaction.nonverbal || ''}\n\n${instinctReaction.instinct}\n\n---\n\n${logicResponse}`,
      metadata: {
        instinctFirst: true,
        logicIntact: true,
        cumulative: true
      }
    };
  }

  /**
   * Orchestrateur: lance instinct + logic en parallèle
   */
  static async orchestrateResponse(userMessage, intents, contextData = {}) {
    try {
      // PARALLÈLE: instinct + logic en même temps
      const [instinctReaction, logicResponse] = await Promise.all([
        this.generateInstinctiveReaction(userMessage),
        this.generateLogicResponse(userMessage, intents, contextData)
      ]);

      return this.mergeInstinctAndLogic(instinctReaction, logicResponse);
    } catch (e) {
      console.error("Erreur orchestration réponse:", e);
      return {
        instinctiveLayer: { reaction: "", emotion: "", nonverbal: "" },
        logicLayer: { response: "" },
        combined: "",
        metadata: { error: true }
      };
    }
  }

  /**
   * Format pour affichage en UI
   */
  static formatForDisplay(mergedResponse) {
    return {
      instinct: {
        text: mergedResponse.instinctiveLayer.reaction,
        emoji: this.getEmotionEmoji(mergedResponse.instinctiveLayer.emotion),
        visible: true
      },
      logic: {
        text: mergedResponse.logicLayer.response,
        visible: true
      },
      display: {
        // Affiche instinct d'abord, puis logique
        order: ['instinct', 'logic'],
        spacing: 'md' // Medium spacing entre les deux
      }
    };
  }

  static getEmotionEmoji(emotion) {
    const map = {
      'curiosité': '🤔',
      'excitation': '✨',
      'questionnement': '❓',
      'émerveillement': '🌟',
      'prudence': '⚠️',
      'joie': '😊',
      'surprise': '😲',
      'intrigue': '🧐'
    };
    return map[emotion?.toLowerCase()] || '💭';
  }
}