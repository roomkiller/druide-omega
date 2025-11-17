/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Semantic Search Engine                                     ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { base44 } from "@/api/base44Client";

export class SemanticSearchEngine {
  static async search(query, options = {}) {
    const {
      includeMemories = true,
      includeKnowledgeBases = true,
      includeConversations = true,
      includeWorkflows = true,
      maxResults = 20
    } = options;

    try {
      // Récupérer toutes les données pertinentes
      const [memories, knowledgeBases, conversations, workflows] = await Promise.all([
        includeMemories ? base44.entities.Memory.list('-importance', 100) : [],
        includeKnowledgeBases ? base44.entities.KnowledgeBase.list() : [],
        includeConversations ? base44.entities.Conversation.list('-created_date', 50) : [],
        includeWorkflows ? base44.entities.Workflow?.list() || [] : []
      ]);

      // Analyse sémantique avec l'IA
      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: `Recherche sémantique avancée:

REQUÊTE UTILISATEUR: "${query}"

DONNÉES DISPONIBLES:
===================

MÉMOIRES (${memories.length}):
${memories.slice(0, 30).map((m, i) => `${i}. [Importance: ${m.importance}/10] ${m.content?.slice(0, 150)} [Tags: ${m.tags?.join(', ') || 'N/A'}]`).join('\n')}

BASES DE CONNAISSANCES (${knowledgeBases.length}):
${knowledgeBases.slice(0, 20).map((kb, i) => `${i}. ${kb.name}: ${kb.description?.slice(0, 150)} [Tags: ${kb.tags?.join(', ') || 'N/A'}]`).join('\n')}

CONVERSATIONS (${conversations.length}):
${conversations.slice(0, 20).map((c, i) => `${i}. ${c.title || 'Sans titre'} - Msgs: ${c.message_count || 0} [${new Date(c.created_date).toLocaleDateString()}]`).join('\n')}

WORKFLOWS (${workflows.length}):
${workflows.slice(0, 20).map((w, i) => `${i}. ${w.name}: ${w.description?.slice(0, 100)} [Actions: ${w.actions?.length || 0}]`).join('\n')}

TÂCHE:
Analyse la requête pour comprendre:
1. L'intention de l'utilisateur (recherche d'info, question, analyse, etc.)
2. Les concepts clés et leur contexte
3. Les relations sémantiques avec les données

Pour chaque type de données, identifie les éléments les PLUS PERTINENTS selon:
- Similarité sémantique (pas juste mots-clés)
- Pertinence contextuelle
- Relations conceptuelles
- Intention de la requête

Retourne les indices des éléments pertinents avec scores 0-100 et explications.`,
        response_json_schema: {
          type: "object",
          properties: {
            query_understanding: {
              type: "object",
              properties: {
                intent: { type: "string" },
                key_concepts: { type: "array", items: { type: "string" } },
                context: { type: "string" }
              }
            },
            memory_results: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  index: { type: "number" },
                  relevance_score: { type: "number" },
                  explanation: { type: "string" },
                  matching_concepts: { type: "array", items: { type: "string" } }
                }
              }
            },
            kb_results: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  index: { type: "number" },
                  relevance_score: { type: "number" },
                  explanation: { type: "string" },
                  matching_concepts: { type: "array", items: { type: "string" } }
                }
              }
            },
            conversation_results: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  index: { type: "number" },
                  relevance_score: { type: "number" },
                  explanation: { type: "string" }
                }
              }
            },
            workflow_results: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  index: { type: "number" },
                  relevance_score: { type: "number" },
                  explanation: { type: "string" }
                }
              }
            },
            synthesis: { type: "string" }
          }
        }
      });

      // Construire les résultats enrichis
      const results = {
        query_understanding: analysis.query_understanding,
        memories: analysis.memory_results
          .map(r => ({
            ...memories[r.index],
            relevance_score: r.relevance_score,
            explanation: r.explanation,
            matching_concepts: r.matching_concepts,
            type: 'memory'
          }))
          .sort((a, b) => b.relevance_score - a.relevance_score)
          .slice(0, maxResults),
        
        knowledgeBases: analysis.kb_results
          .map(r => ({
            ...knowledgeBases[r.index],
            relevance_score: r.relevance_score,
            explanation: r.explanation,
            matching_concepts: r.matching_concepts,
            type: 'knowledge_base'
          }))
          .sort((a, b) => b.relevance_score - a.relevance_score)
          .slice(0, maxResults),
        
        conversations: analysis.conversation_results
          .map(r => ({
            ...conversations[r.index],
            relevance_score: r.relevance_score,
            explanation: r.explanation,
            type: 'conversation'
          }))
          .sort((a, b) => b.relevance_score - a.relevance_score)
          .slice(0, maxResults),
        
        workflows: analysis.workflow_results
          .map(r => ({
            ...workflows[r.index],
            relevance_score: r.relevance_score,
            explanation: r.explanation,
            type: 'workflow'
          }))
          .sort((a, b) => b.relevance_score - a.relevance_score)
          .slice(0, maxResults),
        
        synthesis: analysis.synthesis,
        total_results: analysis.memory_results.length + 
                       analysis.kb_results.length + 
                       analysis.conversation_results.length + 
                       analysis.workflow_results.length
      };

      return results;
    } catch (error) {
      console.error("Erreur recherche sémantique:", error);
      throw error;
    }
  }

  static async askQuestion(question) {
    // Recherche + génération de réponse
    const searchResults = await this.search(question);
    
    const answer = await base44.integrations.Core.InvokeLLM({
      prompt: `Question utilisateur: "${question}"

Résultats de recherche sémantique:

Intention: ${searchResults.query_understanding.intent}
Concepts: ${searchResults.query_understanding.key_concepts.join(', ')}

MÉMOIRES PERTINENTES:
${searchResults.memories.map(m => `- [${m.relevance_score}%] ${m.content?.slice(0, 200)}`).join('\n')}

CONNAISSANCES:
${searchResults.knowledgeBases.map(kb => `- [${kb.relevance_score}%] ${kb.name}: ${kb.description?.slice(0, 150)}`).join('\n')}

Génère une réponse complète et précise à la question en t'appuyant sur les données trouvées.
Si les données sont insuffisantes, indique-le clairement.`,
    });

    return {
      question,
      answer,
      sources: {
        memories: searchResults.memories,
        knowledgeBases: searchResults.knowledgeBases,
        conversations: searchResults.conversations,
        workflows: searchResults.workflows
      },
      understanding: searchResults.query_understanding
    };
  }
}