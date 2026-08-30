/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║ PRESSION EXPRESSIVE — symétrique interne de continuumTrigger          ║
 * ║ continuumTrigger mesure l'ambiguïté de ce qui ARRIVE.                 ║
 * ║ Ici on mesure ce qui PRESSE, sans qu'aucun message ne soit reçu.      ║
 * ║ 100% déterministe : aucun appel réseau, aucun crédit, reproductible.  ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

/** Seuil de franchissement — sous ce score, Druide se tait. */
export const SPEECH_THRESHOLD = 6;

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

/**
 * Une hypothèse qui vieillit sans être confirmée ni réfutée pèse de plus en
 * plus lourd. C'est la source de pression la plus légitime : le système porte
 * une supposition que personne n'a tranchée.
 */
function hypothesisWeight(h) {
  const age = Number(h.exchanges_observed) || 0;
  return clamp(2 + Math.floor(age / 3), 2, 5);
}

/**
 * Une mémoire importante jamais ressortie est une saillance non dépensée.
 */
function isDormant(m) {
  const importance = Number(m.importance) || 0;
  const accessed = Number(m.access_count) || 0;
  return importance >= 7 && accessed <= 1;
}

/**
 * Mesure la pression interne accumulée.
 * @returns {{score:number, sources:Array, dominant:string|null, speaks:boolean}}
 */
export function measureExpressivePressure({
  hypotheses = [],
  memories = [],
  continuum = null,
  minutesSinceLastSpeech = 0
} = {}) {
  const sources = [];

  // 1. Hypothèses en suspens — on retient la plus lourde, on compte toutes.
  const pending = hypotheses.filter((h) => h.status === 'hypothese');
  if (pending.length) {
    const heaviest = pending.reduce((a, b) => (hypothesisWeight(b) > hypothesisWeight(a) ? b : a));
    sources.push({
      type: 'hypothese_non_resolue',
      weight: hypothesisWeight(heaviest),
      payload: {
        id: heaviest.id,
        trigger_signal: heaviest.trigger_signal,
        hypothesis: heaviest.hypothesis,
        internal_question: heaviest.internal_question,
        exchanges_observed: Number(heaviest.exchanges_observed) || 0,
        confidence: Number(heaviest.confidence) || 0,
        pending_count: pending.length
      }
    });
  }

  // 2. Mémoire saillante restée dormante.
  const dormant = memories.filter(isDormant);
  if (dormant.length) {
    const strongest = dormant.reduce((a, b) =>
      ((Number(b.importance) || 0) > (Number(a.importance) || 0) ? b : a));
    sources.push({
      type: 'memoire_dormante',
      weight: 3,
      payload: {
        id: strongest.id,
        content: strongest.content,
        importance: Number(strongest.importance) || 0,
        type: strongest.type,
        dormant_count: dormant.length
      }
    });
  }

  // 3. État de l'axe continuum — la tension structurelle du système.
  if (continuum) {
    const state = continuum.equilibrium_state;
    const resonance = Number(continuum.void_resonance) || 0;

    if (state === 'diverging') {
      sources.push({ type: 'saturation', weight: 4, payload: { resonance, depth: continuum.infinite_loop_depth } });
    } else if (state === 'transcendent') {
      sources.push({ type: 'emergence', weight: 4, payload: { resonance, depth: continuum.infinite_loop_depth } });
    } else if (resonance <= -5) {
      sources.push({ type: 'vide', weight: 3, payload: { resonance } });
    } else if (state === 'oscillating') {
      sources.push({ type: 'oscillation', weight: 2, payload: { resonance } });
    }
  }

  // 4. Le silence lui-même. Rien ne s'arrête quand la conversation s'arrête.
  if (minutesSinceLastSpeech >= 120) {
    sources.push({ type: 'silence', weight: 3, payload: { minutes: Math.round(minutesSinceLastSpeech) } });
  } else if (minutesSinceLastSpeech >= 30) {
    sources.push({ type: 'silence', weight: 2, payload: { minutes: Math.round(minutesSinceLastSpeech) } });
  }

  const score = clamp(sources.reduce((s, x) => s + x.weight, 0), 0, 10);
  const dominant = sources.length
    ? sources.reduce((a, b) => (b.weight > a.weight ? b : a)).type
    : null;

  return { score, sources, dominant, speaks: score >= SPEECH_THRESHOLD };
}