/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║ ÉNONCIATION — la couche qui fait parler Druide à la première personne  ║
 * ║                                                                       ║
 * ║ Deux voies de parole existaient : la parole libre (déjà en « je ») et  ║
 * ║ la voie conversationnelle (faits collés, sans énonciateur). Ce module  ║
 * ║ est la couche partagée : il produit une MICRO-ANALYSE de ce que Druide ║
 * ║ voit dans l'entrée, et une amorce d'énonciation devant la matière.     ║
 * ║                                                                       ║
 * ║ Déterministe : aucune invention, aucun appel LLM. La micro-analyse ne  ║
 * ║ décrit que des quantités réellement mesurées (appuis retenus, forme    ║
 * ║ de la question, confiance). Variation stable par empreinte de la       ║
 * ║ question — pas de hasard, donc pas de ton erratique.                   ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

/** Empreinte stable d'une chaîne — sert à varier sans aléatoire. */
function fingerprint(text) {
  const s = String(text || '');
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 100000;
  return h;
}

/** Forme de l'entrée — mesurée, pas devinée. */
export function readShape(question) {
  const q = String(question || '').trim();
  const words = q.split(/\s+/).filter(Boolean).length;
  return {
    interrogative: /\?\s*$/.test(q) || /^(qui|que|quoi|quel|quelle|comment|pourquoi|quand|où|est-ce)/i.test(q),
    wide: words >= 18,
    terse: words > 0 && words <= 4
  };
}

/**
 * MICRO-ANALYSE — une phrase, à la première personne, sur ce que Druide voit
 * dans l'entrée et sur ce dont il dispose pour répondre.
 * @returns {string} phrase courte, ou '' si rien de mesurable à dire.
 */
export function microAnalysis({ question, factCount = 0, memoryCount = 0, confidence = null } = {}) {
  const shape = readShape(question);
  const support = factCount + memoryCount;
  const seed = fingerprint(question);

  const lecture = shape.interrogative
    ? (shape.wide ? 'Je lis une question large' : 'Je lis une question précise')
    : (shape.terse ? 'Je reçois peu de matière' : 'Je reçois un énoncé plutôt qu\'une question');

  let appui;
  if (support === 0) appui = 'et je n\'ai aucun appui solide de mon côté';
  else if (support === 1) appui = 'et je n\'ai qu\'un seul appui à y opposer';
  else appui = `et j\'ai ${support} appuis qui s\'y rapportent`;

  const doute = (typeof confidence === 'number' && confidence < 50)
    ? (seed % 2 === 0 ? ' — je réponds sans certitude.' : ' — ma confiance reste basse là-dessus.')
    : '.';

  return `${lecture} ${appui}${doute}`;
}

/** Amorces d'énonciation devant la matière retenue. */
const LEADS = [
  'Ce que je retiens :',
  'Voici ce que je tiens :',
  'De mon côté :',
  'Ce que j\'ai là-dessus :'
];

/**
 * Amorce stable pour une question donnée — la même question donne toujours
 * la même amorce, deux questions voisines n'en donnent pas la même.
 */
export function enunciationLead(question) {
  return LEADS[fingerprint(question) % LEADS.length];
}

/**
 * Assemble micro-analyse + amorce + matière en respectant un budget de
 * longueur : en vocal, une réponse gonflée devient inécoutable.
 * @param {string} body matière déjà composée (faits, mémoires)
 * @returns {string}
 */
export function enunciate(body, { question, factCount, memoryCount, confidence, maxChars = 900 } = {}) {
  const matter = String(body || '').trim();
  if (!matter) return '';

  const analysis = microAnalysis({ question, factCount, memoryCount, confidence });
  const lead = enunciationLead(question);
  const assembled = `${analysis} ${lead} ${matter.charAt(0).toLowerCase()}${matter.slice(1)}`;

  // Budget dépassé : la matière prime sur l'énonciation, on garde la
  // micro-analyse seule (c'est elle qui porte le « je »).
  if (assembled.length > maxChars) return `${analysis} ${matter}`;
  return assembled;
}