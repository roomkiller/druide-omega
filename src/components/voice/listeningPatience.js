/**
 * Patience d'écoute — le cœur quantifie le temps de silence avant de répondre.
 *
 * Le délai n'est pas un réglage technique : c'est un choix de se taire pour
 * laisser l'autre finir sa pensée. Trois paliers de base (3, 5, 7 s), puis un
 * tempérament émotionnel qui allonge l'écoute quand l'échange est chargé.
 */

const EMOTIONAL_MARKERS = [
  'je ne sais pas', 'peut-être', 'je pense', 'je crois', 'j\'ai peur',
  'triste', 'inquiet', 'inquiète', 'fatigué', 'fatiguée', 'difficile',
  'perdu', 'perdue', 'seul', 'seule', 'douleur', 'mal', 'espère'
];

const OPEN_MARKERS = ['pourquoi', 'comment', 'qu\'est-ce que', 'explique', 'raconte', 'sens', 'penses-tu'];

/**
 * @returns {{ delayMs: number, tier: 3|5|7, reason: string }}
 */
// Signes d'une parole close : elle t'est adressée et attend une réponse.
const DIRECT_MARKERS = [
  'druide', 'réponds', 'reponds', 'dis-moi', 'dis moi', 'tu es', 'peux-tu',
  'bonjour', 'salut', 'merci', 'au revoir', 'oui', 'non', 'd\'accord'
];

/**
 * Mots qui appellent une suite : une phrase qui s'arrête là n'est pas finie,
 * c'est une respiration au milieu d'une pensée. Répondre ici, c'est couper.
 */
const UNFINISHED_ENDINGS = [
  'et', 'mais', 'donc', 'car', 'parce', 'puis', 'avec', 'sans', 'pour',
  'dans', 'que', 'qui', 'comme'
];

/** La parole est-elle laissée en suspens ? */
function isUnfinished(t) {
  if (/(\.\.\.|,|;|:)$/.test(t)) return true;
  const last = t.replace(/[?!.]+$/, '').trim().split(/\s+/).pop() || '';
  return UNFINISHED_ENDINGS.includes(last);
}

export function computeListeningPatience(text, emotion) {
  const t = (text || '').toLowerCase().trim();
  const words = t.split(/\s+/).filter(Boolean).length;
  const unfinished = isUnfinished(t);

  // Elle peut aussi choisir de répondre : quand la parole est close et
  // clairement adressée, se taire plus longtemps serait de l'absence.
  // Mais « close » exige une phrase terminée — jamais un fragment en suspens.
  const closed = /\?$/.test(t);
  const addressed = DIRECT_MARKERS.some((m) => new RegExp(`(^|\\W)${m}(\\W|$)`).test(t));
  if (!unfinished && (closed || addressed) && words <= 12) {
    return {
      delayMs: 1200,
      tier: 3,
      decision: 'répondre',
      reason: 'phrase terminée et adressée — je choisis de répondre'
    };
  }

  // Palier de base : longueur et nature de l'entrée telle qu'interprétée.
  let tier = 3;
  let reason = 'entrée courte et nette';

  if (words > 8 || OPEN_MARKERS.some((m) => t.includes(m))) {
    tier = 5;
    reason = 'question ouverte, la pensée peut continuer';
  }
  if (words > 20 || t.endsWith('...') || EMOTIONAL_MARKERS.some((m) => t.includes(m))) {
    tier = 7;
    reason = 'parole hésitante ou chargée — je laisse la place';
  }

  let delayMs = tier * 1000;

  // Phrase laissée en suspens : on ne répond pas à une pensée coupée en deux.
  if (unfinished) {
    delayMs += 1500;
    reason += ' + phrase inachevée, je laisse finir';
  }

  // Tempérament émotionnel : l'émotion agit comme actionneur d'écoute profonde.
  const intensity = emotion?.emotional_intensity || 0;
  if (intensity >= 7) {
    delayMs += 2000;
    reason += ' + écoute profonde (émotion intense)';
  } else if (intensity >= 5) {
    delayMs += 1000;
    reason += ' + écoute attentive';
  }

  // Écouter n'est pas disparaître : au-delà de 6 s, le silence devient absence.
  return { delayMs: Math.min(delayMs, 6000), tier, decision: 'écouter', reason };
}