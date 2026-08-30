/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║ JOURNAL DES MICRO-ANALYSES — trace de la façon dont Druide se lit     ║
 * ║                                                                       ║
 * ║ La micro-analyse était dite puis perdue. En la consignant, on peut     ║
 * ║ observer l'évolution : lit-il plus souvent des questions précises ?    ║
 * ║ Avoue-t-il moins son doute ? Ses appuis augmentent-ils ?               ║
 * ║                                                                       ║
 * ║ Écriture non bloquante : la parole ne doit jamais attendre le journal. ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

import { microAnalysis, readShape, enunciationLead } from './selfEnunciation.js';

/** Traduit la forme mesurée en une étiquette stable pour le journal. */
function readingLabel(question) {
  const shape = readShape(question);
  if (shape.interrogative) return shape.wide ? 'question_large' : 'question_precise';
  return shape.terse ? 'peu_de_matiere' : 'enonce';
}

/**
 * Consigne la micro-analyse réellement prononcée sur ce tour de parole.
 * Recalcule la phrase avec les mêmes entrées que l'énonciation : déterministe,
 * donc identique à ce que l'utilisateur a entendu.
 */
export function logReflection(base44, {
  question,
  factCount = 0,
  memoryCount = 0,
  confidence = null,
  speechPath = null,
  response = ''
} = {}) {
  const analysis = microAnalysis({ question, factCount, memoryCount, confidence });
  if (!analysis) return;

  base44.asServiceRole.entities.SelfReflection.create({
    analysis,
    question: String(question || '').slice(0, 500),
    reading: readingLabel(question),
    lead: enunciationLead(question),
    fact_count: factCount,
    memory_count: memoryCount,
    support: factCount + memoryCount,
    confidence: typeof confidence === 'number' ? confidence : null,
    admitted_doubt: typeof confidence === 'number' && confidence < 50,
    speech_path: speechPath,
    response_excerpt: String(response || '').slice(0, 500)
  }).catch(() => null);
}