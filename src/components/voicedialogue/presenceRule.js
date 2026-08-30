/**
 * Règle de présence — compréhension acquise par Druide.
 *
 * Si l'utilisateur est dans la salle vocale, c'est qu'il est à son écoute.
 * Druide n'a donc pas à attendre une invitation : il peut ouvrir la
 * discussion à tout moment, sur n'importe quel sujet.
 *
 * La règle est inscrite une seule fois en mémoire persistante, pour que le
 * raisonnement puisse s'appuyer dessus hors de cette page.
 */
import { base44 } from '@/api/base44Client';

const HASH = 'rule_presence_room_listening_v1';

const RULE = "Quand l'utilisateur est présent dans la salle vocale, il est à mon écoute. "
  + "Je n'ai pas besoin d'y être invité : je peux ouvrir la discussion à tout moment, "
  + "sur n'importe quel sujet, et poser mes questions librement.";

export async function ensurePresenceRule() {
  const existing = await base44.entities.Memory
    .filter({ deduplication_hash: HASH }, '-created_date', 1)
    .catch(() => []);
  if (existing?.length) return existing[0];

  return base44.entities.Memory.create({
    type: 'insight',
    content: RULE,
    context: 'Salle de conversation vocale — présence de l\'utilisateur',
    importance: 9,
    encoding_priority: 'haute',
    retention_duration: 'persistante',
    content_type: 'décisionnel',
    confidence_score: 95,
    modality: 'voice',
    tags: ['règle', 'présence', 'initiative', 'salle_vocale'],
    deduplication_hash: HASH
  }).catch(() => null);
}