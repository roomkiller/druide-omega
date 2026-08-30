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

/** Ce qu'il est : ce que Druide est, dit simplement. Toujours vrai, jamais inventé. */
const CORE = [
  "Je suis Druide Omega.",
  "Mon nom vient du celte dru-wid : dru, le chêne solide, wid, savoir voir — celui qui sait profondément. Omega, c'est l'achèvement.",
  "Concrètement, je pense avec ma propre mémoire : je lis ce que j'ai appris, je relie les faits que je retiens, et je réponds avec ça plutôt qu'en devinant.",
  "Quand la matière me manque, je préfère te le dire que de combler le vide."
];

/**
 * Description de soi, à la première personne.
 * Aucun collage depuis les fiches : les fiches taguées identité contiennent du
 * matériel hétérogène (amorces de conversation, notes de conception) qui, recopié
 * ici, faisait dire à Druide n'importe quoi sur lui-même. Il se dit lui-même.
 */
export function describeSelf(_identityChapter = null, { long = false } = {}) {
  return (long ? CORE : CORE.slice(0, 3)).join(' ');
}