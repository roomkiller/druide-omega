/**
 * Knowledge Search Engine - Recherche web/KB et intégration contextuelle
 */

import invokeLLM from "@/components/utils/LLMRouter";

export class KnowledgeSearchEngine {
  /**
   * Détermine si une réponse nécessite une recherche externe
   */
  static async determineSearchNeed(userMessage, currentContext, consciousnessConfig) {
    try {
      const prompt = `Analyse cette question/message utilisateur et détermine si une recherche web/KB est nécessaire:

**Message:** "${userMessage}"

**Contexte actuel:** ${currentContext.slice(0, 200)}

Réponds avec JSON: { "needsSearch": boolean, "searchQuery": string, "reason": string }
- needsSearch: true si informations actuelles/spécifiques requises
- searchQuery: query optimisée pour recherche (vide si pas besoin)
- reason: pourquoi cette décision`;

      const result = await invokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            needsSearch: { type: "boolean" },
            searchQuery: { type: "string" },
            reason: { type: "string" }
          }
        }
      });

      return result || { needsSearch: false, searchQuery: "", reason: "" };
    } catch (e) {
      return { needsSearch: false, searchQuery: "", reason: "" };
    }
  }

  /**
   * Recherche dans la knowledge base locale
   */
  static async searchKnowledgeBase(base44, query, limit = 5) {
    try {
      const kb = await base44.entities.KnowledgeBase.filter({
        active: true,
        status: "ready"
      });

      // Recherche simple par tags + relevance
      const results = kb
        .filter(item => {
          const tags = (item.tags || []).join(" ").toLowerCase();
          const title = (item.title || "").toLowerCase();
          const summary = (item.summary || "").toLowerCase();
          const q = query.toLowerCase();

          return tags.includes(q) || title.includes(q) || summary.includes(q);
        })
        .sort((a, b) => (b.relevance_score || 100) - (a.relevance_score || 100))
        .slice(0, limit)
        .map(item => ({
          id: item.id,
          title: item.title,
          summary: item.summary,
          source: item.source_url || item.source_type,
          relevance: item.relevance_score || 100,
          excerpt: item.content?.slice(0, 200) || ""
        }));

      return {
        source: "knowledge_base",
        query,
        results,
        count: results.length,
        timestamp: new Date().toISOString()
      };
    } catch (e) {
      return { source: "knowledge_base", query, results: [], count: 0, error: e.message };
    }
  }

  /**
   * Recherche web via LLM avec contexte internet
   */
  static async searchWeb(query) {
    try {
      const prompt = `Recherche web pour: "${query}"

Format JSON avec résultats:`;

      const result = await invokeLLM({
        prompt,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            query: { type: "string" },
            summary: { type: "string" },
            key_findings: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  content: { type: "string" },
                  source: { type: "string" }
                }
              }
            },
            timestamp: { type: "string" }
          }
        }
      });

      return {
        source: "web_search",
        query,
        summary: result?.summary || "",
        findings: result?.key_findings || [],
        timestamp: new Date().toISOString()
      };
    } catch (e) {
      return { source: "web_search", query, findings: [], error: e.message };
    }
  }

  /**
   * Intègre les résultats de recherche dans le contexte de réponse
   */
  static buildEnrichedContext(userMessage, searchResults, currentContext) {
    let enrichedContext = currentContext;

    if (searchResults?.source === "web_search" && searchResults.findings?.length > 0) {
      enrichedContext += `\n\n**Contexte Web trouvé pour "${userMessage}":**\n`;
      searchResults.findings.forEach(finding => {
        enrichedContext += `- ${finding.title}: ${finding.content}\n`;
      });
      if (searchResults.summary) {
        enrichedContext += `\nRésumé: ${searchResults.summary}`;
      }
    }

    if (searchResults?.source === "knowledge_base" && searchResults.results?.length > 0) {
      enrichedContext += `\n\n**Sources de la base de connaissances:**\n`;
      searchResults.results.forEach(result => {
        enrichedContext += `- ${result.title}: ${result.excerpt}\n`;
      });
    }

    return enrichedContext;
  }

  /**
   * Orchestrateur: détermine, cherche, et intègre
   */
  static async enhanceWithKnowledge(base44, userMessage, currentContext, consciousnessConfig) {
    try {
      // 1. Déterminer si recherche nécessaire
      let searchNeed = await this.determineSearchNeed(
        userMessage,
        currentContext,
        consciousnessConfig
      );

      // Fallback: si LLM dit non, mais message contient keywords de recherche
      if (!searchNeed.needsSearch || !searchNeed.searchQuery) {
        const specializedTerms = /consciousness|conscience|philosophie|existence|émotion|emotion|meaning|sens|recherche|web|internet|actualités|news|latest/i.test(userMessage);
        if (specializedTerms) {
          // Extraire query du message
          const queryMatch = userMessage.match(/(?:sur|about|recherche|search|tell|parle)\s+(.{10,100})/i);
          searchNeed = {
            needsSearch: true,
            searchQuery: queryMatch ? queryMatch[1] : userMessage.slice(0, 50),
            reason: "Fallback: keywords détectés"
          };
        } else {
          return { contextEnhanced: false, searches: [], reason: "Pas de recherche nécessaire" };
        }
      }

      // 2. Chercher en parallèle KB + Web
      const [kbResults, webResults] = await Promise.all([
        this.searchKnowledgeBase(base44, searchNeed.searchQuery),
        this.searchWeb(searchNeed.searchQuery)
      ]);

      // 3. Retourner les résultats
      const hasResults = (kbResults.count > 0 || webResults.findings?.length > 0);
      return {
        contextEnhanced: hasResults,
        searchQuery: searchNeed.searchQuery,
        reason: searchNeed.reason,
        searches: [kbResults, webResults].filter(r => r.count > 0 || r.findings?.length > 0),
        enrichedContext: hasResults ? this.buildEnrichedContext(
          userMessage,
          kbResults.count > 0 ? kbResults : webResults,
          currentContext
        ) : currentContext
      };
    } catch (e) {
      console.error("Erreur recherche connaissance:", e);
      return { contextEnhanced: false, searches: [], error: e.message };
    }
  }

  /**
   * Sauvegarde les résultats de recherche pour traçabilité
   */
  static async logSearchResults(base44, userMessage, searchResults) {
    try {
      if (searchResults.searches?.length > 0) {
        await base44.entities.Memory.create({
          type: 'fact',
          content: `Recherche pour: "${userMessage}"`,
          context: searchResults.searches.map(s => `${s.source}: ${s.query}`).join("; "),
          importance: 6,
          modality: 'chat',
          tags: ['search_enhanced', ...searchResults.searches.map(s => s.source)],
          embedding_summary: JSON.stringify(searchResults.searches.map(s => s.findings || []))
        }).catch(() => null);
      }
    } catch (e) {
      console.log("Log recherche skipped");
    }
  }
}