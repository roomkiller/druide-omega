/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║ RÉSOLUTION DES QUESTIONS LIBRES — lecture lexicale déterministe       ║
 * ║ Quand Druide interroge, la réponse doit changer son état, sinon la     ║
 * ║ question n'était qu'un ornement. Aucun modèle : classement local.      ║
 * ║ Une réponse ambiguë n'est PAS traitée comme une confirmation.          ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

function normalize(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const CONFIRM = [
  'oui', 'ouais', 'exact', 'exactement', 'c est ca', 'cest ca', 'tout a fait',
  'confirme', 'je confirme', 'correct', 'vrai', 'juste', 'bien vu', 'en effet',
  'effectivement', 'absolument', 'tu as raison', 'right'
];

const REFUTE = [
  'non', 'nope', 'faux', 'pas du tout', 'incorrect', 'erreur', 'tu te trompes',
  'tu as tort', 'c est faux', 'cest faux', 'pas vraiment', 'jamais', 'ce n est pas',
  'ce nest pas', 'aucunement'
];

const DROP = [
  'laisse tomber', 'oublie', 'oublie ca', 'plus important', 'sans importance',
  'inutile', 'ca ne compte plus', 'ca compte plus', 'abandonne', 'efface',
  'plus besoin', 'obsolete', 'perime'
];

const KEEP = [
  'garde', 'garde le', 'important', 'ca compte', 'utile', 'essentiel',
  'conserve', 'pertinent', 'oui garde', 'toujours vrai'
];

/** Cherche une expression entière, pas un fragment de mot. */
function hits(norm, phrases) {
  const padded = ` ${norm} `;
  return phrases.some((p) => padded.includes(` ${p} `));
}

/**
 * Classe une réponse à une question portant sur une hypothèse.
 * @returns {'confirmee'|'refutee'|'ambigue'}
 */
export function classifyHypothesisAnswer(answer) {
  const norm = normalize(answer);
  if (!norm) return 'ambigue';
  const refuted = hits(norm, REFUTE);
  const confirmed = hits(norm, CONFIRM);
  // Les deux présents (« non, mais oui en partie ») → on ne tranche pas.
  if (refuted && confirmed) return 'ambigue';
  if (refuted) return 'refutee';
  if (confirmed) return 'confirmee';
  return 'ambigue';
}

/**
 * Classe une réponse à une question portant sur une mémoire dormante.
 * @returns {'garder'|'laisser_tomber'|'ambigue'}
 */
export function classifyMemoryAnswer(answer) {
  const norm = normalize(answer);
  if (!norm) return 'ambigue';
  const drop = hits(norm, DROP);
  const keep = hits(norm, KEEP);
  if (drop && keep) return 'ambigue';
  if (drop) return 'laisser_tomber';
  if (keep || hits(norm, CONFIRM)) return 'garder';
  // Une explication substantielle sans marqueur de rejet vaut un motif de garder.
  return norm.split(' ').length >= 6 ? 'garder' : 'ambigue';
}

/** Accusé de réception — dit ce qui a changé, sans politesse décorative. */
export function acknowledge(verdict) {
  switch (verdict) {
    case 'confirmee':
      return "Confirmé. Je la passe en acquis et je peux m'en servir pour raisonner.";
    case 'refutee':
      return "Réfuté. Je la retire, et je garde l'enseignement : sur ce type de contexte, ma supposition était fausse.";
    case 'garder':
      return "Compris. Je remonte son importance et je la sors de l'état dormant.";
    case 'laisser_tomber':
      return "Je la relâche. Elle redescend en importance et cessera de peser.";
    default:
      return "Ta réponse ne tranche pas, alors je ne tranche pas non plus. Je la garde en suspens.";
  }
}