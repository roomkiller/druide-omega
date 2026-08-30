/**
 * Moteur de déclenchement — mesure déterministe locale (aucun LLM).
 * Mesure l'ambiguïté du contexte reçu, décide du déclenchement par seuil,
 * puis instancie une question interne depuis un gabarit fixe.
 * Aucune formulation libre: tout est reproductible et auditables.
 */

const STOP = new Set([
  'le', 'la', 'les', 'un', 'une', 'des', 'de', 'du', 'et', 'ou', 'a', 'au', 'aux',
  'je', 'tu', 'il', 'nous', 'vous', 'on', 'que', 'qui', 'quoi', 'est', 'sont',
  'pour', 'dans', 'sur', 'avec', 'pas', 'ne', 'plus', 'moins', 'si', 'mais',
  'ce', 'cette', 'ces', 'mon', 'ma', 'mes', 'ton', 'ta', 'son', 'sa', 'ses',
  'en', 'y', 'me', 'te', 'se', 'lui', 'leur', 'tout', 'tous', 'faire', 'fait'
]);

const REFERENTS = ['ca', 'cela', 'celui', 'celle', 'ceux', 'celles', 'ils', 'elles', 'lui'];
const VAGUE = ['truc', 'chose', 'machin', 'affaire', 'bidule', 'genre'];
const IMPERATIVES = ['fais', 'donne', 'explique', 'continue', 'procede', 'vas', 'montre', 'corrige', 'ajoute'];

export const TRIGGER_THRESHOLD = 5;

export function normalize(text) {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s'-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function tokenize(text) {
  return normalize(text).split(' ').filter((t) => t.length > 2 && !STOP.has(t));
}

/**
 * Mesure la position sur l'axe de déclenchement.
 * @returns {{score:number, signals:Array, dominant:string|null, contentTokens:string[]}}
 */
export function measureContinuum(message, { history = [], knownTerms = [] } = {}) {
  const norm = normalize(message);
  const words = norm.split(' ').filter(Boolean);
  const contentTokens = tokenize(message);
  const signals = [];

  // 1. Référent non résolu: pronom démonstratif sans nom porteur dans le message
  const referent = words.find((w) => REFERENTS.includes(w));
  if (referent && contentTokens.length <= 2) {
    signals.push({ type: 'referent_non_resolu', term: referent, weight: 4 });
  }

  // 2. Intention vague: terme creux explicite
  const vague = contentTokens.find((t) => VAGUE.includes(t));
  if (vague) {
    signals.push({ type: 'intention_vague', term: vague, weight: 3 });
  }

  // 3. Demande sous-spécifiée: impératif court sans objet
  if (words.length > 0 && IMPERATIVES.includes(words[0]) && words.length <= 4) {
    signals.push({ type: 'demande_sous_specifiee', term: words[0], weight: 4 });
  }

  // 4. Changement de sujet: recouvrement lexical faible avec le dernier tour
  const lastTurn = history.length ? tokenize(history[history.length - 1]) : [];
  if (lastTurn.length >= 3 && contentTokens.length >= 3) {
    const shared = contentTokens.filter((t) => lastTurn.includes(t)).length;
    const overlap = shared / Math.min(contentTokens.length, lastTurn.length);
    if (overlap < 0.15) {
      signals.push({ type: 'changement_sujet', term: contentTokens[0], weight: 3 });
    }
  }

  // 5. Terme inconnu: absent de l'historique et des termes connus
  const known = new Set([...history.flatMap(tokenize), ...knownTerms.map((t) => normalize(t))]);
  const unknown = contentTokens.filter((t) => !known.has(t) && t.length > 5);
  if (unknown.length && contentTokens.length) {
    const ratio = unknown.length / contentTokens.length;
    if (ratio > 0.5) {
      signals.push({ type: 'terme_inconnu', term: unknown[0], weight: 3 });
    }
  }

  const score = Math.min(10, signals.reduce((s, x) => s + x.weight, 0));
  const dominant = signals.length
    ? signals.reduce((a, b) => (b.weight > a.weight ? b : a)).type
    : null;

  return { score, signals, dominant, contentTokens };
}

/** Gabarits fixes — la question interne n'est jamais improvisée. */
const QUESTION_TEMPLATES = {
  referent_non_resolu: (t) => `À quoi renvoie « ${t} » dans ce contexte ?`,
  intention_vague: (t) => `Que désigne concrètement « ${t} » ici ?`,
  demande_sous_specifiee: (t) => `Sur quoi précisément porte « ${t} » ?`,
  changement_sujet: (t) => `Le sujet passe-t-il à « ${t} », ou reste-t-il lié au précédent ?`,
  terme_inconnu: (t) => `Que signifie « ${t} » pour l'utilisateur ?`
};

export function buildInternalQuestion(signal, term) {
  const tpl = QUESTION_TEMPLATES[signal];
  return tpl ? tpl(term) : null;
}

/**
 * Suppose le sens en s'appuyant sur le dernier antécédent plausible de l'historique.
 * Retourne aussi les indices utilisés — l'hypothèse doit rester traçable.
 */
export function supposeMeaning(signal, term, history = []) {
  const evidence = [];
  let antecedent = null;

  for (let i = history.length - 1; i >= 0 && !antecedent; i--) {
    const toks = tokenize(history[i]);
    if (toks.length) {
      antecedent = toks[0];
      evidence.push(`Antécédent le plus récent dans l'historique: « ${antecedent} »`);
    }
  }

  if (!antecedent) evidence.push("Aucun antécédent disponible: supposition faite sans appui contextuel");
  evidence.push(`Signal déclencheur: ${signal} sur « ${term} »`);

  const supposed = antecedent
    ? `« ${term} » renvoie probablement à « ${antecedent} », dernier sujet établi.`
    : `« ${term} » n'a pas d'antécédent identifiable dans l'échange.`;

  return { supposed_meaning: supposed, evidence, antecedent };
}

/** Compose l'hypothèse interne + sa formulation non assertive. */
export function composeHypothesis({ signal, term, antecedent, evidence }) {
  const subject = antecedent || term;

  const hypothesis = antecedent
    ? `L'utilisateur poursuit le sujet « ${antecedent} » et attend une suite sur ce point plutôt qu'un nouveau développement.`
    : `L'intention porte sur « ${term} », mais le sujet visé reste indéterminé.`;

  // Confiance basse par construction: 30 de base, +5 par indice, plafond 45.
  const confidence = Math.min(45, 30 + evidence.length * 5);

  const verification_phrasing = antecedent
    ? `Si je comprends bien, tu parles toujours de ${antecedent} — c'est bien ça ?`
    : `Je ne suis pas certain de ce que « ${term} » désigne ici — tu peux préciser ?`;

  return { hypothesis, confidence, verification_phrasing, topic_key: `${signal}:${subject}` };
}