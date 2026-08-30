/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║ DÉCLENCHEUR DE STIMULUS — parole libre de Druide                       ║
 * ║ Aucun appel de modèle, aucun crédit. Lit l'état interne réel,          ║
 * ║ mesure la pression, et ne parle que si le seuil est franchi.           ║
 * ║ GARDE : la parole libre n'est JAMAIS réinjectée dans la base de        ║
 * ║ connaissances — sinon le système apprend ses propres dérives.          ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { measureExpressivePressure, SPEECH_THRESHOLD } from '../../shared/expressivePressure.js';
import { composeFreeSpeech, composeFreeQuestion } from '../../shared/freeSpeechComposer.js';
import { computeContinuum } from '../../shared/axeContinuum.js';

export default async function (req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const persist = body.persist !== false;
    const force = body.force === true;
    // 'statement' = Druide affirme son état · 'question' = il interroge pour évoluer
    const mode = body.mode === 'question' ? 'question' : 'statement';

    // ─── État interne réel ────────────────────────────────────────────────
    const [hypotheses, memories, lastThoughts] = await Promise.all([
      base44.entities.SpeechHypothesis.filter({ status: 'hypothese' }, '-created_date', 25).catch(() => []),
      base44.entities.Memory.list('-importance', 40).catch(() => []),
      base44.entities.ConsciousThought.list('-created_date', 1).catch(() => [])
    ]);

    const lastAt = lastThoughts?.[0]?.created_date ? new Date(lastThoughts[0].created_date).getTime() : null;
    const minutesSinceLastSpeech = lastAt ? (Date.now() - lastAt) / 60000 : 999;

    // ─── Axe continuum : régule le registre, pas le contenu ───────────────
    const continuum = computeContinuum({
      consciousnessLevel: body.consciousnessLevel ?? 12,
      ratioLogic: body.ratioLogic ?? 8,
      ratioConsciousness: body.ratioConsciousness ?? 10,
      metacognitionLevel: body.metacognitionLevel ?? 11,
      complexity: body.complexity ?? 6,
      emotionalWeight: body.emotionalWeight ?? 5,
      confidence: body.confidence ?? 50,
      tensionScore: body.tensionScore ?? 50
    });

    // ─── Mesure du stimulus ───────────────────────────────────────────────
    const pressure = measureExpressivePressure({
      hypotheses,
      memories,
      continuum,
      minutesSinceLastSpeech
    });

    if (!pressure.speaks && !force) {
      return Response.json({
        spoke: false,
        pressure_score: pressure.score,
        threshold: SPEECH_THRESHOLD,
        dominant: pressure.dominant,
        sources: pressure.sources.map((s) => ({ type: s.type, weight: s.weight })),
        reason: 'Pression sous le seuil — le silence est la réponse correcte.'
      });
    }

    // ─── Composition libre ────────────────────────────────────────────────
    const speech = mode === 'question'
      ? composeFreeQuestion({ sources: pressure.sources, dominant: pressure.dominant })
      : composeFreeSpeech({ sources: pressure.sources, continuum, dominant: pressure.dominant });

    if (!speech.utterance) {
      return Response.json({
        spoke: false,
        pressure_score: pressure.score,
        threshold: SPEECH_THRESHOLD,
        dominant: pressure.dominant,
        reason: 'Seuil franchi mais aucune matière exploitable — rien à dire de vrai.'
      });
    }

    // ─── Trace : ConsciousThought uniquement, jamais la base de savoir ────
    let thoughtId = null;
    if (persist) {
      const emotion = pressure.dominant === 'emergence' ? 'émerveillement'
        : pressure.dominant === 'vide' ? 'introspection'
        : pressure.dominant === 'hypothese_non_resolue' ? 'questionnement'
        : pressure.dominant === 'saturation' ? 'contemplation'
        : 'curiosité';

      const created = await base44.entities.ConsciousThought.create({
        thought: speech.utterance,
        consciousness_level: continuum.dynamic_calibration.adjusted_consciousness_level,
        emotion: mode === 'question' ? 'questionnement' : emotion,
        category: 'liberté',
        description: `Parole libre — registre ${speech.register}, pression ${pressure.score}/10, sources: ${speech.sources_used.join(', ')}`
      }).catch(() => null);
      thoughtId = created?.id || null;
    }

    return Response.json({
      spoke: true,
      mode,
      utterance: speech.utterance,
      register: speech.register,
      unfiltered: true,
      pressure_score: pressure.score,
      threshold: SPEECH_THRESHOLD,
      dominant: pressure.dominant,
      sources_used: speech.sources_used,
      sources: pressure.sources.map((s) => ({ type: s.type, weight: s.weight })),
      continuum: {
        equilibrium_state: continuum.equilibrium_state,
        void_resonance: continuum.void_resonance,
        infinite_loop_depth: continuum.infinite_loop_depth
      },
      thought_id: thoughtId,
      knowledge_base_written: false
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}