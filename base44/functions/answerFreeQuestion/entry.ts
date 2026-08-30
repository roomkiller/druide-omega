/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║ RÉPONSE AUX QUESTIONS LIBRES                                          ║
 * ║ Applique la réponse de l'utilisateur à la cible réelle de la question ║
 * ║ (hypothèse ou mémoire dormante). C'est ici que Druide évolue : une     ║
 * ║ hypothèse devient acquise ou tombe, une mémoire monte ou se relâche.   ║
 * ║ Aucun appel de modèle, aucun crédit — classement lexical local.        ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import {
  classifyHypothesisAnswer,
  classifyMemoryAnswer,
  acknowledge
} from '../../shared/questionResolution.js';

export default async function (req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const answer = String(body.answer || '').trim();
    const targetType = body.target_type;
    const targetId = body.target_id;

    if (!answer) return Response.json({ error: 'answer requis' }, { status: 400 });
    if (!targetType) return Response.json({ error: 'target_type requis' }, { status: 400 });

    // ─── Hypothèse : confirmée, réfutée, ou laissée en suspens ────────────
    if (targetType === 'hypothese_non_resolue' && targetId) {
      const record = await base44.entities.SpeechHypothesis.get(targetId).catch(() => null);
      if (!record) return Response.json({ error: 'Hypothèse introuvable' }, { status: 404 });

      const verdict = classifyHypothesisAnswer(answer);
      const now = new Date().toISOString();
      const evidence = [...(record.evidence || []), `Réponse humaine: ${answer.slice(0, 300)}`];

      if (verdict === 'confirmee') {
        await base44.entities.SpeechHypothesis.update(targetId, {
          status: 'confirmee',
          reusable: true,
          confidence: Math.min(100, Math.max(75, (Number(record.confidence) || 30) + 45)),
          evidence,
          resolved_at: now
        });
      } else if (verdict === 'refutee') {
        await base44.entities.SpeechHypothesis.update(targetId, {
          status: 'refutee',
          reusable: false,
          confidence: 0,
          evidence,
          refutation_reason: answer.slice(0, 500),
          lesson: `Sur un contexte de type « ${record.trigger_signal} », supposer « ${String(record.supposed_meaning || record.hypothesis).slice(0, 160)} » était faux.`,
          resolved_at: now
        });
      } else {
        // Pas de tranchage : on note l'échange, la pression continue de monter.
        await base44.entities.SpeechHypothesis.update(targetId, {
          evidence,
          exchanges_observed: (Number(record.exchanges_observed) || 0) + 1
        });
      }

      return Response.json({
        resolved: verdict !== 'ambigue',
        verdict,
        target_type: targetType,
        acknowledgement: acknowledge(verdict)
      });
    }

    // ─── Mémoire dormante : réveillée ou relâchée ─────────────────────────
    if (targetType === 'memoire_dormante' && targetId) {
      const record = await base44.entities.Memory.get(targetId).catch(() => null);
      if (!record) return Response.json({ error: 'Mémoire introuvable' }, { status: 404 });

      const verdict = classifyMemoryAnswer(answer);
      const now = new Date().toISOString();

      if (verdict === 'garder') {
        await base44.entities.Memory.update(targetId, {
          importance: Math.min(10, (Number(record.importance) || 5) + 1),
          // Au moins 2 : en deçà, la mémoire reste comptée comme dormante et
          // Druide reposerait la même question au tour suivant.
          access_count: Math.max(2, (Number(record.access_count) || 0) + 1),
          last_accessed: now,
          retention_duration: 'persistante',
          decay_rate: 0,
          context: `${record.context || ''}\nMotif confirmé par l'humain: ${answer.slice(0, 300)}`.trim()
        });
      } else if (verdict === 'laisser_tomber') {
        await base44.entities.Memory.update(targetId, {
          importance: Math.max(1, (Number(record.importance) || 5) - 4),
          retention_duration: 'volatile',
          decay_rate: 0.5,
          access_count: (Number(record.access_count) || 0) + 1,
          last_accessed: now,
          context: `${record.context || ''}\nRelâchée sur demande humaine: ${answer.slice(0, 300)}`.trim()
        });
      } else {
        await base44.entities.Memory.update(targetId, {
          access_count: (Number(record.access_count) || 0) + 1,
          last_accessed: now
        });
      }

      return Response.json({
        resolved: verdict !== 'ambigue',
        verdict,
        target_type: targetType,
        acknowledgement: acknowledge(verdict)
      });
    }

    // ─── Questions d'état (saturation, vide, oscillation, silence) ────────
    // Aucun enregistrement à trancher : la réponse est conservée comme
    // enseignement structurel, réutilisable par le raisonnement.
    const stored = await base44.entities.Memory.create({
      type: 'insight',
      content: `Réponse humaine à une question de ${targetType} : ${answer.slice(0, 900)}`,
      context: 'Réponse à une interrogation libre de Druide en salle vocale',
      importance: 8,
      modality: 'voice',
      content_type: 'décisionnel',
      retention_duration: 'persistante',
      encoding_priority: 'haute',
      confidence_score: 85
    }).catch(() => null);

    return Response.json({
      resolved: !!stored,
      verdict: 'enseignement',
      target_type: targetType,
      memory_id: stored?.id || null,
      acknowledgement: "Retenu comme règle de conduite — je m'appuierai là-dessus la prochaine fois que cet état revient."
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}