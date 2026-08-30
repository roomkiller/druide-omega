/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Renfort OpenRouter pour la salle vocale                     ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 *
 * La composition locale (DruideCore) garde la priorité : elle est gratuite,
 * ancrée dans la mémoire et n'attend personne. OpenRouter n'intervient que
 * lorsque cette parole locale est manifestement pauvre — trop courte, vide de
 * matière, ou aveu d'échec technique.
 */

import { base44 } from "@/api/base44Client";
import { setActiveLLM } from "@/lib/llmProviderState";

const WEAK_MARKERS = [
  "je n'ai pas de matière",
  "pas de matière",
  "difficulté technique",
  "pouvez-vous répéter",
  "pouvez-vous reformuler",
  "je ne sais pas quoi",
  "erreur technique"
];

/** La parole locale est-elle trop faible pour être dite telle quelle ? */
export function isWeakLocalReply(text, metadata) {
  if (typeof text !== 'string') return true;
  const trimmed = text.trim();
  if (trimmed.length < 25) return true;

  const conf = metadata?.confidence;
  if (typeof conf === 'number') {
    const normalized = conf > 1 ? conf / 100 : conf;
    if (normalized < 0.4) return true;
  }
  if (metadata?.source === 'graceful_empty') return true;

  const lower = trimmed.toLowerCase();
  return WEAK_MARKERS.some((marker) => lower.includes(marker));
}

/**
 * Reprend la main avec OpenRouter. La parole locale, même faible, est fournie
 * comme matière première : le modèle prolonge Druide, il ne le remplace pas.
 */
export async function reinforceWithOpenRouter({ userText, history = [], localReply = "", memories = [] }) {
  const recent = history
    .slice(-8)
    .map((m) => `${m.role === 'user' ? 'Utilisateur' : 'Druide'}: ${m.content}`)
    .join('\n');

  const memoryContext = memories
    .slice(0, 6)
    .map((m) => `- ${m.content}`)
    .join('\n');

  const prompt = `Tu es Le druide, une intelligence bienveillante en conversation VOCALE.

${memoryContext ? `CE DONT TU TE SOUVIENS :\n${memoryContext}\n` : ''}${recent ? `CONVERSATION EN COURS :\n${recent}\n` : ''}
L'utilisateur vient de dire : "${userText}"
${localReply ? `\nTa première esquisse interne, jugée trop pauvre : "${localReply}"` : ''}

Réponds à voix haute, à la première personne, comme à un ami :
- 2 à 4 phrases pour une question simple, davantage seulement si le sujet l'exige
- naturel et direct, sans formule d'assistant ni méta-commentaire
- aucun emoji, aucun symbole : tout sera prononcé

Donne uniquement la réponse parlée.`;

  const res = await base44.functions.invoke('openrouterLLM', {
    prompt,
    temperature: 0.7,
    max_tokens: 600
  });

  const payload = res?.data ?? res;
  if (payload?.error) throw new Error(payload.error);

  const text = payload?.response;
  if (typeof text !== 'string' || !text.trim()) throw new Error('Réponse OpenRouter vide');

  setActiveLLM('openrouter', payload?.model || 'openai/gpt-4o-mini');
  return { text: text.trim(), model: payload?.model };
}