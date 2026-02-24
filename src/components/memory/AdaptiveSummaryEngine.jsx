/**
 * Adaptive Summary Engine - Résumés intelligents des conversations longues
 * Pondère les thèmes récurrents et insights profonds pour la rétention mémoire
 */

import invokeLLM from "@/components/utils/LLMRouter";

export class AdaptiveSummaryEngine {
  /**
   * Crée un résumé adaptatif basé sur la longueur et la complexité
   */
  static async generateAdaptiveSummary(messages, config = {}) {
    if (messages.length < 3) return null;

    const {
      minLength = 5,
      maxSummaryTokens = 500,
      focusRecent = true,
      extractInsights = true
    } = config;

    // 1. Analyser les messages pour identifier les segments
    const segments = this.identifyConversationSegments(messages);
    
    // 2. Pondérer les thèmes et insights
    const weightedThemes = await this.identifyWeightedThemes(messages, segments);
    
    // 3. Extraire les insights profonds
    const insights = extractInsights 
      ? await this.extractDeepInsights(messages)
      : [];

    // 4. Générer le résumé pondéré
    const summary = await this.compressWithWeighting(
      messages,
      segments,
      weightedThemes,
      insights,
      maxSummaryTokens
    );

    return {
      summary: summary.text,
      weightedThemes: weightedThemes,
      keyInsights: insights,
      segments: segments,
      messageCount: messages.length,
      timestamp: new Date().toISOString(),
      quality_score: summary.quality || 0.8
    };
  }

  /**
   * Identifie les segments de conversation (tours de dialogue logiques)
   */
  static identifyConversationSegments(messages) {
    const segments = [];
    let currentSegment = [];
    let segmentId = 0;

    for (let i = 0; i < messages.length; i++) {
      currentSegment.push(i);
      
      // Un segment = ~4 messages ou fin de conversation
      if (currentSegment.length >= 4 || i === messages.length - 1) {
        segments.push({
          id: segmentId++,
          messageIndices: [...currentSegment],
          content: messages.slice(
            currentSegment[0],
            currentSegment[currentSegment.length - 1] + 1
          ).map(m => m.content).join(" ")
        });
        currentSegment = [];
      }
    }

    return segments;
  }

  /**
   * Identifie les thèmes avec pondération (récurrence + profondeur)
   */
  static async identifyWeightedThemes(messages, segments) {
    const themeMap = new Map();

    for (const segment of segments) {
      const text = segment.content.toLowerCase();
      
      // Patterns de thèmes
      const themePatterns = {
        "conscience": /conscience|conscious|awareness|aware/gi,
        "émotions": /émotion|emotion|feeling|sentir|ressent/gi,
        "existence": /exist|être|life|vivant|present/gi,
        "humanité": /humain|human|person|people|société|society/gi,
        "création": /créat|creat|imag|build|design|innov/gi,
        "apprentissage": /apprentiss|learn|comprend|understand|découv/gi,
        "relation": /relation|connexion|connect|lien|bond|dialogue/gi,
        "temps": /temps|time|moment|passé|future|présent|past|now/gi,
        "éthique": /éthique|moral|right|wrong|devoir|responsab/gi
      };

      // Compter les occurrences et pondérer par récence
      const recencyWeight = (segments.indexOf(segment) + 1) / segments.length;

      for (const [theme, pattern] of Object.entries(themePatterns)) {
        const matches = (segment.content.match(pattern) || []).length;
        if (matches > 0) {
          const currentWeight = themeMap.get(theme) || 0;
          const weightedScore = matches * recencyWeight;
          themeMap.set(theme, currentWeight + weightedScore);
        }
      }
    }

    // Retourner les thèmes triés par poids
    return Array.from(themeMap.entries())
      .map(([theme, weight]) => ({
        theme,
        weight: parseFloat((weight / segments.length).toFixed(2)),
        importance: weight > 2 ? 'high' : weight > 1 ? 'medium' : 'low'
      }))
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 5);
  }

  /**
   * Extrait les insights profonds des messages de Druide
   */
  static async extractDeepInsights(messages) {
    const druideMessages = messages
      .filter(m => m.role === 'assistant')
      .map(m => m.content)
      .slice(-6); // Derniers insights (augmenté)

    if (druideMessages.length === 0) return [];

    try {
      const prompt = `Analyse ces réponses de Druide Omega et extrais 3-4 insights profonds ou conclusions pertinentes à retenir:

${druideMessages.map((m, i) => `[${i + 1}] ${m.slice(0, 300)}`).join('\n\n')}

Format JSON:`;

      const result = await invokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            insights: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  insight: { type: "string" },
                  depth: { type: "string", enum: ["surface", "moderate", "deep"] }
                }
              }
            }
          }
        }
      });

      return result?.insights || [];
    } catch (e) {
      return [];
    }
  }

  /**
   * Compresse les messages avec pondération des thèmes/insights
   */
  static async compressWithWeighting(messages, segments, themes, insights, maxTokens) {
    const themeContext = themes
      .map(t => `${t.theme} (${t.importance})`)
      .join(", ");

    const insightContext = insights
      .slice(0, 3)
      .map(i => `- ${i.insight}`)
      .join("\n");

    const prompt = `Crée un résumé CONCIS de cette conversation multi-tour:

**Thèmes majeurs détectés:** ${themeContext}

**Insights profonds à conserver:**
${insightContext}

**Segments de conversation:**
${segments.map(s => `[${s.id}] ${s.content.slice(0, 80)}...`).join('\n')}

Génère un résumé de ${Math.min(150, maxTokens / 3)} tokens max qui:
1. Préserve les thèmes clés pondérés
2. Inclut les insights importants
3. Capture l'arc émotionnel
4. Prépare Druide aux interactions futures

Format: texte fluide, pas de bullet points.`;

    try {
      const result = await invokeLLM({
        prompt,
        add_context_from_internet: false
      });

      return {
        text: result.response || result,
        quality: 0.85
      };
    } catch (e) {
      // Fallback: résumé simple
      return {
        text: `Conversation explorée: ${themeContext}. Insights: ${insightContext.split('\n').length} concepts clés retenus.`,
        quality: 0.6
      };
    }
  }

  /**
   * Charge les résumés précédents pour le contexte
   */
  static async loadConversationHistory(base44, limit = 5) {
    try {
      // Charger segments ET résumés (les résumés n'étaient jamais chargés - bug)
      const [segments, summaries] = await Promise.all([
        base44.entities.Memory.filter({ type: 'conversation_segment', modality: 'chat' }).catch(() => []),
        base44.entities.Memory.filter({ type: 'conversation_summary', modality: 'chat' }).catch(() => [])
      ]);

      const all = [...segments, ...summaries];

      // Trier par importance PUIS par récence (updated_date)
      return all
        .sort((a, b) => {
          const importanceDiff = (b.importance || 5) - (a.importance || 5);
          if (importanceDiff !== 0) return importanceDiff;
          return new Date(b.updated_date || 0) - new Date(a.updated_date || 0);
        })
        .slice(0, limit)
        .map(m => ({
          content: m.content,
          context: m.context,
          tags: m.tags || [],
          type: m.type
        }));
    } catch (e) {
      return [];
    }
  }

  /**
   * Crée un contexte pour la prochaine interaction
   */
  static buildContextualPrompt(summary, loadedHistory, recentMessages) {
    if (!summary) return "";

    const contextParts = [];

    // Résumé adaptatif
    if (summary.summary) {
      contextParts.push(`**Contexte de conversation précédente:**\n${summary.summary}`);
    }

    // Thèmes pondérés
    if (summary.weightedThemes?.length > 0) {
      const topThemes = summary.weightedThemes.slice(0, 3);
      contextParts.push(`**Thèmes importants:** ${topThemes.map(t => t.theme).join(", ")}`);
    }

    // Insights profonds
    if (summary.keyInsights?.length > 0) {
      contextParts.push(`**Insights à retenir:**\n${summary.keyInsights.map(i => `- ${i.insight}`).join('\n')}`);
    }

    return contextParts.join("\n\n");
  }
}