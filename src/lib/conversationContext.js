/**
 * conversationContext.js — Mémoire inter-tours partagée pour les chats.
 *
 * Construit l'historique envoyé à druideCore en injectant le contexte accumulé
 * (résumé courant + historique inter-sessions) devant les messages récents,
 * afin que les tours successifs conservent la continuité thématique au-delà
 * de la fenêtre brute des 10 derniers messages.
 */

import { AdaptiveSummaryEngine } from "@/components/memory/AdaptiveSummaryEngine";

/**
 * Construit l'historique contextualisé pour druideCore.
 *
 * @param {Array} messages — tous les messages de la conversation courante
 * @param {Object} opts
 * @param {Object|null} opts.summary — résumé adaptatif courant (sortie AdaptiveSummaryEngine)
 * @param {Array} opts.previousHistory — historique inter-sessions (tableau d'objets Memory)
 * @param {number} opts.maxRecent — fenêtre de messages récents bruts à conserver
 * @returns {Array<{role:string,content:string}>} historique à passer à druideCore
 */
export function buildContextedHistory(messages, { summary = null, previousHistory = [], maxRecent = 10 } = {}) {
  const recent = messages.slice(-maxRecent).map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const contextPrompt = AdaptiveSummaryEngine.buildContextualPrompt(summary, previousHistory, recent);

  if (!contextPrompt) return recent;

  return [
    {
      role: "assistant",
      content: `[Contexte accumulé de la conversation — utilise-le pour ta continuité]\n${contextPrompt}`,
    },
    ...recent,
  ];
}