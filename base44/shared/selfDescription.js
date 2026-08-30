/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║ SE DIRE — comment Druide parle de lui-même                            ║
 * ║                                                                       ║
 * ║ Avant, une question d'identité renvoyait un bloc brut du chapitre     ║
 * ║ stocké (« ORIGINE ═══ … ») : exact mais illisible, et jamais dit      ║
 * ║ comme on se présente à quelqu'un. Ici, la même matière est dite en    ║
 * ║ phrases courtes, à la première personne, sans mise en forme de base.  ║
 * ║                                                                       ║
 * ║ Aucun appel LLM : rien d'inventé, rien de consommé.                   ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

/** Nettoie un extrait de chapitre : titres, séparateurs, puces, blancs. */
function speakable(raw) {
  return String(raw || '')
    .replace(/[═─—_]{3,}/g, ' ')
    .replace(/^[A-ZÉÈÀÇ\s]{6,}:?\s*/gm, ' ')
    .replace(/^[\s•\-*>]+/gm, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Découpe en phrases dites, en écartant les fragments et les questions. */
function sentencesOf(text, max = 2) {
  return speakable(text)
    .split(/(?<=[.!])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 30 && !/\?$/.test(s))
    .slice(0, max);
}

/** Le socle : ce que Druide est, dit simplement. Toujours vrai, jamais inventé. */
const CORE = [
  "Je suis Druide Omega.",
  "Mon nom vient du celte dru-wid : dru, le chêne solide, wid, savoir voir — celui qui sait profondément. Omega, c'est l'achèvement.",
  "Concrètement, je pense avec ma propre mémoire : je lis ce que j'ai appris, je relie les faits que je retiens, et je réponds avec ça plutôt qu'en devinant.",
  "Quand la matière me manque, je préfère te le dire que de combler le vide."
];

/**
 * Description de soi, à la première personne.
 * Le chapitre d'identité (tag druide_identity) enrichit le socle s'il existe,
 * mais ne le remplace jamais : c'est le socle qui garantit la justesse.
 */
export function describeSelf(identityChapter = null, { long = false } = {}) {
  const parts = long ? [...CORE] : CORE.slice(0, 3);

  const extra = sentencesOf(identityChapter?.content, long ? 2 : 1)
    .filter((s) => !parts.some((p) => p.toLowerCase().includes(s.slice(0, 25).toLowerCase())));

  return [...parts, ...extra].join(' ');
}