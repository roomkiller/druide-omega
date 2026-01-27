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
      const prompt = `Tu es un agent de recherche web. 
      
Fais une recherche internet pour: "${query}"

Retourne un JSON avec 3-5 findings importants trouvés sur internet.
Format STRICT:
{
  "query": "${query}",
  "summary": "Résumé court des résultats",
  "findings": [
    {"title": "Titre du résultat", "content": "Description courte", "source": "Source URL ou nom"}
  ]
}`;

      const result = await invokeLLM({
        prompt,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            query: { type: "string" },
            summary: { type: "string" },
            findings: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  content: { type: "string" },
                  source: { type: "string" }
                }
              }
            }
          }
        }
      });

      // Robuste: accepter réponse directe ou wrapped
      const findings = result?.findings || result?.data?.findings || [];
      const summary = result?.summary || result?.data?.summary || "";
      
      console.log('[SearchWeb] Query:', query, 'Findings:', findings.length, 'Data:', result);
      
      return {
        source: "web_search",
        query,
        summary: summary,
        findings: Array.isArray(findings) ? findings : [],
        timestamp: new Date().toISOString()
      };
    } catch (e) {
      console.error('[SearchWeb] Erreur:', e);
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
        enrichedContext += `- **${finding.title}**: ${finding.content} (source: ${finding.source || 'Web'})\n`;
      });
      if (searchResults.summary) {
        enrichedContext += `\nRésumé Web: ${searchResults.summary}\n`;
      }
    }

    if (searchResults?.source === "knowledge_base" && searchResults.results?.length > 0) {
      enrichedContext += `\n\n**Sources de la base de connaissances:**\n`;
      searchResults.results.forEach(result => {
        enrichedContext += `- **${result.title}**: ${result.excerpt} (score: ${result.relevance || 100})\n`;
      });
    }

    return enrichedContext;
  }

  /**
   * Orchestrateur: détermine, cherche, et intègre
   */
  static async enhanceWithKnowledge(base44, userMessage, currentContext, consciousnessConfig) {
    try {
      // 1. Vérifications rapides (pas d'appel LLM)
      if (currentContext.length > 500) {
        return { contextEnhanced: false, searches: [], reason: "Contexte suffisant" };
      }

      const specializedTerms = /consciousness|conscience|philosophie|existence|émotion|emotion|meaning|sens|recherche|web|internet|actualités|news|latest|current|récent/i.test(userMessage);
      if (!specializedTerms) {
        return { contextEnhanced: false, searches: [], reason: "Pas de keywords spécialisés" };
      }

      // 2. Extraire query
      const queryMatch = userMessage.match(/(?:sur|about|recherche|search|tell|parle)\s+(.{10,100})/i);
      const searchQuery = queryMatch ? queryMatch[1] : userMessage.slice(0, 50);

      // 3. KB search + Web search EN SÉQUENCE (évite rate limit)
      const kbResults = await this.searchKnowledgeBase(base44, searchQuery);

      // Web search avec délai pour éviter surcharge
      let webResults = null;
      if (kbResults.count === 0) {
        // Seulement si KB vide
        await new Promise(r => setTimeout(r, 300)); // Délai de 300ms
        webResults = await this.searchWeb(searchQuery);
      }

      const hasResults = (kbResults.count > 0 || webResults?.findings?.length > 0);
      const results = [];
      if (kbResults.count > 0) results.push(kbResults);
      if (webResults?.findings?.length > 0) results.push(webResults);

      return {
        contextEnhanced: hasResults,
        searchQuery: searchQuery,
        reason: hasResults ? (webResults ? "KB + Web" : "KB only") : "Pas de résultats",
        searches: results,
        enrichedContext: hasResults ? this.buildEnrichedContext(
          userMessage,
          results[0],
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