/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ Cascade Orchestrator - Parallélise generation/recherche/analyse           ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { base44 } from "@/api/base44Client";
import { KnowledgeSearchEngine } from "@/components/knowledge/KnowledgeSearchEngine";

export class CascadeOrchestrator {
  /**
   * Orchestre la cascade complète EN PARALLÈLE
   */
  static async executeCascade(userMessage, intents, consciousnessConfig) {
    const cascadeResults = {
      search: null,
      images: null,
      analysis: null,
      structure: null,
      startTime: Date.now()
    };

    try {
      // Construire les promesses parallèles selon les intents
      const promises = [];

      // 1. RECHERCHE WEB (si demandé)
      if (intents.searchWeb) {
        promises.push(
          this.executeSearch(userMessage, consciousnessConfig)
            .then(result => { cascadeResults.search = result; })
            .catch(e => console.error('Erreur cascade search:', e))
        );
      }

      // 2. GÉNÉRATION D'IMAGES (si demandé)
      if (intents.generateImages) {
        promises.push(
          this.generateImages(userMessage)
            .then(result => { cascadeResults.images = result; })
            .catch(e => console.error('Erreur cascade images:', e))
        );
      }

      // 3. GÉNÉRATION DE STRUCTURE (tableaux/diagrammes)
      if (intents.generateStructure) {
        promises.push(
          this.generateStructure(userMessage)
            .then(result => { cascadeResults.structure = result; })
            .catch(e => console.error('Erreur cascade structure:', e))
        );
      }

      // 4. ANALYSE PROFONDE
      if (intents.analyzeDeep) {
        promises.push(
          this.executeDeepAnalysis(userMessage, cascadeResults)
            .then(result => { cascadeResults.analysis = result; })
            .catch(e => console.error('Erreur cascade analysis:', e))
        );
      }

      // Attendre TOUTES les promesses en parallèle
      if (promises.length > 0) {
        await Promise.allSettled(promises);
      }

      cascadeResults.duration = Date.now() - cascadeResults.startTime;
      return cascadeResults;
    } catch (e) {
      console.error("Erreur orchestrateur cascade:", e);
      return cascadeResults;
    }
  }

  /**
   * Exécute la recherche web/KB
   */
  static async executeSearch(userMessage, consciousnessConfig) {
    try {
      const results = await KnowledgeSearchEngine.enhanceWithKnowledge(
        base44,
        userMessage,
        userMessage,
        consciousnessConfig
      );

      return {
        contextEnhanced: results.contextEnhanced,
        searches: results.searches,
        findings: results.searches?.flatMap(s => s.findings || s.results || []) || []
      };
    } catch (e) {
      console.error("Erreur search cascade:", e);
      return { contextEnhanced: false, searches: [], findings: [] };
    }
  }

  /**
   * Génère les images demandées
   */
  static async generateImages(userMessage) {
    try {
      // Extraire nombre d'images demandées (ex: "3 chars" → 3)
      const numberMatch = userMessage.match(/(\d+)\s+(?:images?|chars?|photos?|illustrations?)/i);
      const imageCount = numberMatch ? Math.min(parseInt(numberMatch[1]), 5) : 3; // Max 5

      // Prompt pour générer
      const prompt = `Génère ${imageCount} images distinctes pour: "${userMessage}"
      
Style: Professional, clear, beautiful, diverse perspectives.
Format: JSON avec descriptions et prompts utilisés.`;

      const generatedUrls = [];

      // Générer en série rapide (évite throttling)
      for (let i = 0; i < imageCount; i++) {
        try {
          const imagePrompt = `[${i + 1}/${imageCount}] ${userMessage}. Style professional, unique perspective.`;
          
          const imageResult = await base44.integrations.Core.GenerateImage({
            prompt: imagePrompt
          });

          if (imageResult?.url) {
            generatedUrls.push({
              url: imageResult.url,
              prompt: imagePrompt,
              index: i + 1
            });
          }

          // Petit délai entre générations
          if (i < imageCount - 1) {
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        } catch (e) {
          console.warn(`Image ${i + 1} failed:`, e);
        }
      }

      return {
        count: generatedUrls.length,
        images: generatedUrls,
        success: generatedUrls.length > 0
      };
    } catch (e) {
      console.error("Erreur generate images:", e);
      return { count: 0, images: [], success: false };
    }
  }

  /**
   * Génère tableaux/diagrammes structurés
   */
  static async generateStructure(userMessage) {
    try {
      // Détecter si tableau ou diagramme
      const isTable = /tableau|table|list|comparaison/i.test(userMessage);
      const isDiagram = /diagram|schema|structure|flow/i.test(userMessage);

      if (isTable) {
        return this.generateTableStructure(userMessage);
      } else if (isDiagram) {
        return this.generateDiagramStructure(userMessage);
      }

      return { type: 'unknown', data: null };
    } catch (e) {
      console.error("Erreur generate structure:", e);
      return { type: 'error', data: null };
    }
  }

  static async generateTableStructure(userMessage) {
    // Implémentation tableau
    return {
      type: 'table',
      data: `Tableau structuré pour: ${userMessage}`,
      generated: true
    };
  }

  static async generateDiagramStructure(userMessage) {
    // Implémentation diagramme
    return {
      type: 'diagram',
      data: `Diagramme pour: ${userMessage}`,
      generated: true
    };
  }

  /**
   * Analyse profonde (utilise résultats des autres cascades)
   */
  static async executeDeepAnalysis(userMessage, cascadeResults) {
    try {
      let analysisContext = '';

      if (cascadeResults.search?.findings?.length > 0) {
        analysisContext += `\nDonnées trouvées: ${cascadeResults.search.findings.length} résultats\n`;
      }

      if (cascadeResults.images?.images?.length > 0) {
        analysisContext += `Visuels: ${cascadeResults.images.images.length} images générées\n`;
      }

      return {
        context: analysisContext,
        deepAnalysisRequired: analysisContext.length > 0,
        data: analysisContext
      };
    } catch (e) {
      console.error("Erreur deep analysis:", e);
      return { context: '', deepAnalysisRequired: false, data: '' };
    }
  }

  /**
   * Récupère le contexte enrichi pour la réponse
   */
  static extractContextForResponse(cascadeResults) {
    return {
      searchResults: cascadeResults.search,
      generatedImages: cascadeResults.images?.images || [],
      structure: cascadeResults.structure,
      analysis: cascadeResults.analysis
    };
  }
}