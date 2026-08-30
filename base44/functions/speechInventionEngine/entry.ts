/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║ SPEECH INVENTION ENGINE — moteur d'invention de parole               ║
 * ║ Mesure → seuil → question interne → hypothèse → mémoire révisable.   ║
 * ║ 100% local et déterministe: aucun appel LLM, aucun crédit consommé.  ║
 * ║ Une hypothèse n'est jamais un fait: statut réfutable obligatoire.    ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import {
  measureContinuum,
  buildInternalQuestion,
  supposeMeaning,
  composeHypothesis,
  normalize,
  tokenize,
  TRIGGER_THRESHOLD
} from '../../shared/continuumTrigger.js';

const MAX_ACTIVE_PER_CONVERSATION = 3;
const EXPIRY_EXCHANGES = 6;

// Marqueurs de correction: l'utilisateur reprend le tour précédent.
const CORRECTION = /^(non|pas\b|je parlais|je voulais dire|plutot|plutôt|en fait|c'est pas|ce n'est pas)/i;

/**
 * CONFIRMATION INFÉRÉE — l'hypothèse se résout depuis le tour suivant,
 * jamais en interrogeant l'utilisateur.
 *   correction explicite  → réfutée (l'enseignement est conservé)
 *   sujet supposé repris  → confirmée (elle devient réutilisable)
 *   ni l'un ni l'autre    → vieillit, puis périme
 * Purement lexical et déterministe: aucun LLM.
 */
async function resolveOpenHypotheses(base44, message, conversationId) {
  // Portée stricte: sans identifiant de conversation, aucune résolution.
  // Une hypothèse née ailleurs ne doit jamais être confirmée par ce tour-ci.
  if (!conversationId) return [];
  const open = await base44.entities.SpeechHypothesis.filter(
    { conversation_id: conversationId, status: 'hypothese' },
    '-created_date',
    5
  ).catch(() => []);
  if (!open.length) return [];

  const tokens = new Set(tokenize(message));
  const resolutions = [];
  const now = new Date().toISOString();

  for (const h of open) {
    const subject = String(h.topic_key || '').split(':')[1] || '';

    if (CORRECTION.test(normalize(message))) {
      await base44.entities.SpeechHypothesis.update(h.id, {
        status: 'refutee',
        reusable: false,
        confidence: 0,
        refutation_reason: 'Correction implicite détectée au tour suivant',
        lesson: `Signal « ${h.trigger_signal} » — supposition erronée: ${(h.supposed_meaning || '').replace(/[«»]/g, '').trim()} L'utilisateur a corrigé au tour suivant.`,
        resolved_at: now
      }).catch(() => null);
      resolutions.push({ id: h.id, outcome: 'refutee', inferred: true });
      continue;
    }

    if (subject && tokens.has(subject)) {
      await base44.entities.SpeechHypothesis.update(h.id, {
        status: 'confirmee',
        reusable: true,
        confidence: Math.min(85, (h.confidence || 30) + 20),
        resolved_at: now
      }).catch(() => null);
      resolutions.push({ id: h.id, outcome: 'confirmee', inferred: true });
      continue;
    }

    const observed = (h.exchanges_observed || 0) + 1;
    if (observed >= EXPIRY_EXCHANGES) {
      await base44.entities.SpeechHypothesis.update(h.id, {
        status: 'expiree', reusable: false, exchanges_observed: observed, resolved_at: now
      }).catch(() => null);
      resolutions.push({ id: h.id, outcome: 'expiree', inferred: true });
    } else {
      await base44.entities.SpeechHypothesis.update(h.id, { exchanges_observed: observed }).catch(() => null);
    }
  }

  return resolutions;
}

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const action = body.action || 'evaluate';

    // ── Confirmation: l'hypothèse devient une opinion réutilisable ──
    if (action === 'confirm') {
      if (!body.hypothesis_id) return Response.json({ error: 'hypothesis_id requis' }, { status: 400 });
      const h = await base44.entities.SpeechHypothesis.get(body.hypothesis_id);
      const updated = await base44.entities.SpeechHypothesis.update(body.hypothesis_id, {
        status: 'confirmee',
        reusable: true,
        confidence: Math.min(85, (h.confidence || 30) + 25),
        resolved_at: new Date().toISOString()
      });
      return Response.json({ action, hypothesis: updated });
    }

    // ── Réfutation: retirée du raisonnement, conservée comme enseignement ──
    if (action === 'refute') {
      if (!body.hypothesis_id) return Response.json({ error: 'hypothesis_id requis' }, { status: 400 });
      const h = await base44.entities.SpeechHypothesis.get(body.hypothesis_id);
      const updated = await base44.entities.SpeechHypothesis.update(body.hypothesis_id, {
        status: 'refutee',
        reusable: false,
        confidence: 0,
        refutation_reason: body.reason || 'Réfutée par l\'utilisateur',
        lesson: `Signal « ${h.trigger_signal} » — supposition erronée: ${(h.supposed_meaning || '').replace(/[«»]/g, '').trim()} Motif: ${body.reason || 'non précisé'}.`,
        resolved_at: new Date().toISOString()
      });
      return Response.json({ action, hypothesis: updated });
    }

    // ── Opinions réutilisables + enseignements des réfutations ──
    if (action === 'recall') {
      const all = await base44.entities.SpeechHypothesis.filter({}, '-created_date', 100);
      return Response.json({
        opinions: all.filter((h) => h.status === 'confirmee' && h.reusable),
        lessons: all.filter((h) => h.status === 'refutee' && h.lesson).map((h) => h.lesson)
      });
    }

    // ── Évaluation: mesure et déclenchement éventuel ──
    const message = body.message;
    if (!message) return Response.json({ error: 'message requis' }, { status: 400 });

    // L'historique arrive soit en texte brut, soit en tours {role, content}.
    // On l'aplatit en chaînes: le moteur de mesure ne travaille que sur du texte.
    const history = (Array.isArray(body.history) ? body.history : [])
      .map((h) => (typeof h === 'string' ? h : String(h?.content || '')))
      .filter(Boolean);
    const conversationId = body.conversation_id || null;
    const persist = body.persist !== false;

    // Le tour courant résout d'abord les hypothèses laissées ouvertes.
    const resolutions = persist ? await resolveOpenHypotheses(base44, message, conversationId) : [];

    const measure = measureContinuum(message, { history, knownTerms: body.known_terms || [] });

    if (measure.score < TRIGGER_THRESHOLD || !measure.dominant) {
      return Response.json({
        triggered: false,
        continuum_score: measure.score,
        threshold: TRIGGER_THRESHOLD,
        signals_detected: measure.signals,
        resolutions,
        reason: 'Sous le seuil: la conversation suit son cours normal.'
      });
    }

    const dominantSignal = measure.signals.reduce((a, b) => (b.weight > a.weight ? b : a));
    const term = dominantSignal.term;

    const internal_question = buildInternalQuestion(measure.dominant, term);
    const { supposed_meaning, evidence, antecedent } = supposeMeaning(measure.dominant, term, history);
    const { hypothesis, confidence, verification_phrasing, topic_key } = composeHypothesis({
      signal: measure.dominant,
      term,
      antecedent,
      evidence
    });

    const reaction = {
      triggered: true,
      continuum_score: measure.score,
      threshold: TRIGGER_THRESHOLD,
      trigger_signal: measure.dominant,
      signals_detected: measure.signals,
      internal_question,
      supposed_meaning,
      hypothesis,
      confidence,
      verification_phrasing,
      topic_key,
      evidence,
      resolutions,
      status: 'hypothese',
      reusable: false
    };

    if (!persist) {
      return Response.json({ ...reaction, persisted: false });
    }

    // Une seule hypothèse active par clé de sujet, dans la même conversation.
    const existing = conversationId
      ? await base44.entities.SpeechHypothesis.filter(
          { topic_key, conversation_id: conversationId, status: 'hypothese' },
          '-created_date',
          5
        )
      : [];

    if (existing.length) {
      const revised = await base44.entities.SpeechHypothesis.update(existing[0].id, {
        user_message: message.slice(0, 2000),
        continuum_score: measure.score,
        internal_question,
        supposed_meaning,
        hypothesis,
        verification_phrasing,
        evidence,
        signals_detected: measure.signals,
        exchanges_observed: (existing[0].exchanges_observed || 0) + 1
      });
      return Response.json({ ...reaction, persisted: true, revised: true, hypothesis_id: revised.id });
    }

    // Plafond par conversation: évite l'accumulation de suppositions triviales.
    if (conversationId) {
      const active = await base44.entities.SpeechHypothesis.filter(
        { conversation_id: conversationId, status: 'hypothese' },
        '-created_date',
        20
      );

      // Péremption des non confirmées trop anciennes.
      const stale = active.filter((h) => (h.exchanges_observed || 0) >= EXPIRY_EXCHANGES);
      for (const h of stale) {
        await base44.entities.SpeechHypothesis.update(h.id, {
          status: 'expiree',
          reusable: false,
          resolved_at: new Date().toISOString()
        });
      }

      if (active.length - stale.length >= MAX_ACTIVE_PER_CONVERSATION) {
        return Response.json({
          ...reaction,
          persisted: false,
          reason: `Plafond atteint (${MAX_ACTIVE_PER_CONVERSATION} hypothèses actives): réaction produite mais non mémorisée.`
        });
      }
    }

    const created = await base44.entities.SpeechHypothesis.create({
      conversation_id: conversationId,
      user_message: message.slice(0, 2000),
      continuum_score: measure.score,
      trigger_signal: measure.dominant,
      signals_detected: measure.signals,
      internal_question,
      supposed_meaning,
      hypothesis,
      verification_phrasing,
      evidence,
      confidence,
      status: 'hypothese',
      reusable: false,
      topic_key,
      exchanges_observed: 0
    });

    return Response.json({ ...reaction, persisted: true, hypothesis_id: created.id });
  } catch (error) {
    console.error('[speechInventionEngine]', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}