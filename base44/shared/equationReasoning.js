/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║ MOTEUR DE RAISONNEMENT PAR ÉQUATIONS — méthode des équations          ║
 * ║ Contourne le LLM pour la logique formelle. Chaque type de             ║
 * ║ raisonnement correspond à une équation résolue localement :           ║
 * ║   1. Syllogisme   : [∀x: X→Y] ∧ [z∈X] ⟹ Y(z)                        ║
 * ║   2. Indépendance : P(Bₙ | historique) = P(Bₙ) = 1/faces             ║
 * ║   3. Transitivité : A>C ⟺ (A-B)+(B-C) > 0                            ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

/** 1. SYLLOGISME — transitivité de l'implication universelle. */
function solveSyllogism(q) {
  const syl = q.match(/tous?\s+(?:les\s+)?(\S+?)s?\s+sont\s+(\S+?)[,\s]+(?:et\s+)?(?:que\s+)?(\S+?)\s+est\s+(?:un\s+|une\s+|un\s+des\s+)?(\S+)/i);
  if (!syl) return null;
  const [, catPlural, property, subject, catSingular] = syl;
  const catStem = catPlural.replace(/s$/, '').toLowerCase();
  const catSing = catSingular.toLowerCase().replace(/[,.]?$/, '');
  // La catégorie au singulier doit correspondre au pluriel de la première prémisse.
  if (catStem !== catSing && catPlural.toLowerCase() !== catSing) return null;

  const cat = catStem;
  const propRaw = property.toLowerCase().replace(/[,.]?$/, '');
  const propPlural = propRaw.endsWith('s') ? propRaw : propRaw + 's';
  const subjRaw = subject.toLowerCase();
  const subj = subjRaw.charAt(0).toUpperCase() + subjRaw.slice(1);
  return {
    type: 'syllogism',
    equation: `[∀x: ${cat}(x)→${propRaw}(x)] ∧ [${subjRaw}∈${cat}] ⟹ ${propRaw}(${subjRaw})`,
    response: `Par l'équation syllogistique : si tous les ${cat}s sont ${propPlural}, et que ${subj} est un ${cat}, alors ${subj} est ${propRaw.endsWith('s') ? propRaw.slice(0, -1) : propRaw}. C'est la transitivité de l'implication — le modus ponens universel.`
  };
}

/**
 * 2. PROBABILITÉ — indépendance des événements sans mémoire.
 * normalizeQ strip les accents : "dé" (le dé) et "de" (préposition) deviennent
 * indistinguables. On détecte donc le "dé" accentué sur la question ORIGINALE,
 * sinon « Est-il toujours bien de dire la vérité ? » déclenchait l'équation.
 * \b ne fonctionne pas après "é" — on délimite le token par des séparateurs réels.
 */
function solveProbability(q, normalizedQ) {
  const dieToken = /(?:^|[\s.,;!?])dés?(?:[\s.,;!?]|$)/i.test(q);
  const probKw = /(piece|d6|lancer|lanc|pile|face|probabilit|roulette|boule)/i.test(normalizedQ) || dieToken;
  if (!probKw) return null;
  const hasIndep = /(independ|n.ieme|n.eme|chaque|toujours|encore|apres|suivant|prochain|11e|10e|5e|6e|7e|8e|9e|nieme|consecutif|d.affilee)/i.test(normalizedQ);
  if (!hasIndep) return null;

  const isDie = (/\bd6\b/i.test(normalizedQ) || dieToken) && !/piece/i.test(normalizedQ);
  const faces = isDie ? 6 : 2;
  const pct = Math.round(100 / faces);
  const obj = isDie ? 'dé' : 'pièce';
  return {
    type: 'probability_independence',
    equation: `P(Bₙ | B₁...Bₙ₋₁) = P(Bₙ) = 1/${faces} = ${pct}%`,
    response: `Par l'équation d'indépendance : P(Bₙ | historique) = P(Bₙ) = 1/${faces} = ${pct}%. Chaque lancer de ${obj} est indépendant — le passé n'influence pas l'avenir. La ${obj} n'a pas de mémoire.`
  };
}

/** 3. TRANSITIVITÉ — la chaîne d'ordre se propage si elle est continue. */
function extractChain(pairs, op) {
  if (!pairs || pairs.length < 2) return null;
  for (let i = 0; i < pairs.length - 1; i++) {
    if (pairs[i][1] !== pairs[i + 1][0]) return null; // chaîne rompue
  }
  const first = pairs[0][0];
  const last = pairs[pairs.length - 1][1];
  if (pairs.length >= 3) {
    return {
      type: 'transitivity_chain',
      equation: `${first}${op}${last} = ${pairs.map((p) => `(${p[0]}${op}${p[1]})`).join('+')} > 0`,
      response: `Par l'équation de transitivité : la chaîne ${pairs.map((p) => p[0] + op + p[1]).join(', ')} implique ${first}${op}${last}. La relation d'ordre est transitive — la chaîne se propage.`
    };
  }
  return {
    type: 'transitivity_simple',
    equation: `${first}${op}${last} = (${pairs[0][0]}${op}${pairs[0][1]})+(${pairs[1][0]}${op}${pairs[1][1]}) > 0`,
    response: `Par l'équation de transitivité : si ${pairs[0][0]}${op}${pairs[0][1]} et ${pairs[1][0]}${op}${pairs[1][1]}, alors ${first}${op}${last}. L'ordre se propage par la chaîne.`
  };
}

function solveTransitivity(q) {
  for (const op of ['>', '<']) {
    const re = new RegExp(`(\\w)\\s*${op}\\s*(\\w)`, 'g');
    const matches = q.match(re);
    if (!matches) continue;
    const pairs = matches.map((m) => {
      const r = m.match(new RegExp(`(\\w)\\s*${op}\\s*(\\w)`));
      return [r[1], r[2]];
    });
    const result = extractChain(pairs, op);
    if (result) return result;
  }
  return null;
}

/** Retourne { type, equation, response } ou null si aucune équation ne s'applique. */
export function solveByEquation(question, normalizedQ) {
  const q = String(question || '');
  return solveSyllogism(q) || solveProbability(q, normalizedQ) || solveTransitivity(q);
}