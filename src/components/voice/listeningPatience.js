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
export function computeListeningPatience(text, emotion) {
  const t = (text || '').toLowerCase();
  const words = t.split(/\s+/).filter(Boolean).length;

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

  // Tempérament émotionnel : l'émotion agit comme actionneur d'écoute profonde.
  const intensity = emotion?.emotional_intensity || 0;
  if (intensity >= 7) {
    delayMs += 2000;
    reason += ' + écoute profonde (émotion intense)';
  } else if (intensity >= 5) {
    delayMs += 1000;
    reason += ' + écoute attentive';
  }

  return { delayMs, tier, reason };
}