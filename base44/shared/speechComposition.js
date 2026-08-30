/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║ COMPOSITION — assembler des faits en parole selon un squelette         ║
 * ║ L'architecture du squelette (ouverture, structure, fermeture) dicte   ║
 * ║ la forme ; les faits KB et mémoires fournissent la matière.           ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

import { stripMetadata } from './speechFormatter.js';
import { keywordsOf, isQAContent } from './speechRetrieval.js';

/** Un segment de squelette qui est une question ou du bruit est écarté. */
export function cleanArchSegment(text) {
  const t = stripMetadata(String(text || '')).trim();
  if (!t || t.length < 15) return '';
  if (/\?$/.test(t) || /^[Qq][:?]/.test(t)) return '';
  if (/^(Bonjour|Salut|Hey)/i.test(t) && t.length < 50) return '';
  return t;
}

/**
 * Un squelette peut porter du contenu factuel appris d'une conversation
 * précédente (pyramide de Maslow, vitesse de la lumière…). On ne l'accepte que
 * s'il partage un mot-clé significatif avec la question : sans ancre sémantique,
 * il est potentiellement hors-sujet, et un fait KB fera une meilleure ouverture.
 */
export function isRelevantSkeletonSegment(segment, keywords) {
  if (!segment) return false;
  const segLower = String(segment).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const segWords = new Set(segLower.split(/[^a-z0-9]+/));
  return keywords.some((kw) => kw.length > 4 && segWords.has(kw));
}

function buildBody(structure, facts, memories, maxSentences) {
  const bodyParts = [];
  switch (structure) {
    case 'list':
      facts.slice(0, Math.max(maxSentences - 1, 5)).forEach((f, i) => {
        bodyParts.push(`${i + 1}. ${f.fact}`);
      });
      break;
    case 'contrast':
      if (facts.length >= 2) bodyParts.push(`${facts[0].fact} Mais ${facts[1].fact.toLowerCase()}.`);
      else if (facts.length === 1) bodyParts.push(facts[0].fact);
      break;
    case 'progression': {
      const connectors = ["D'abord,", 'ensuite,', 'enfin,'];
      facts.slice(0, 3).forEach((f, i) => {
        bodyParts.push(`${connectors[i] || 'puis,'} ${f.fact.toLowerCase().replace(/\.$/, '')}.`);
      });
      break;
    }
    case 'analogy':
      if (facts.length > 0) bodyParts.push(facts[0].fact);
      if (memories.length > 0) {
        bodyParts.push(`C'est un peu comme ${memories[0].content.slice(0, 120).toLowerCase()}.`);
      }
      break;
    case 'nuance_then_answer':
      if (memories.length > 0) bodyParts.push(memories[0].content.slice(0, 150));
      facts.slice(0, 2).forEach((f) => bodyParts.push(f.fact));
      break;
    case 'answer_then_nuance':
      facts.slice(0, 2).forEach((f) => bodyParts.push(f.fact));
      if (memories.length > 0) bodyParts.push(memories[0].content.slice(0, 120));
      break;
    default: // single_point
      facts.slice(0, Math.max(maxSentences, 3)).forEach((f) => bodyParts.push(f.fact));
      if (bodyParts.length === 0 && memories.length > 0) {
        bodyParts.push(memories[0].content.slice(0, 200));
      }
  }
  return bodyParts;
}

export function composeResponse(skeleton, facts, memories, question) {
  const arch = skeleton?.architecture || {};
  const keywords = keywordsOf(question);
  const rawOpening = cleanArchSegment(arch.opening || '');
  const rawClosing = cleanArchSegment(arch.closing || '');
  const opening = isRelevantSkeletonSegment(rawOpening, keywords) ? rawOpening : '';
  const closing = isRelevantSkeletonSegment(rawClosing, keywords) ? rawClosing : '';
  const bodyStructure = arch.body_structure || 'single_point';
  const length = arch.length || 'short';

  let workFacts = facts.map((f) => ({ ...f, fact: stripMetadata(f.fact) }));
  const workMemories = memories
    .map((m) => ({ ...m, content: stripMetadata(m.content) }))
    .filter((m) => m.content && !isQAContent(m.content));

  const maxSentences = length === 'very_short' ? 1
    : length === 'short' ? 2
    : length === 'medium' ? 4 : 6;

  const parts = [];

  // Ouverture : celle du squelette si elle est propre et pertinente, sinon le premier fait.
  if (opening) {
    parts.push(opening);
  } else if (workFacts.length > 0) {
    parts.push(workFacts[0].fact);
    workFacts = workFacts.slice(1);
  }

  // Trois faits ou plus : on force le mode liste pour tout restituer.
  const effectiveStructure = workFacts.length >= 3 ? 'list' : bodyStructure;
  parts.push(...buildBody(effectiveStructure, workFacts, workMemories, maxSentences));

  // Fermeture : seulement si elle partage un mot avec les faits (pas de hors-sujet).
  if (closing && parts.length < maxSentences + 2) {
    const factWords = workFacts.map((f) => String(f.fact).toLowerCase()).join(' ');
    const closingWords = closing.toLowerCase();
    if (factWords.split(/\W+/).some((w) => w.length > 4 && closingWords.includes(w))) {
      parts.push(closing);
    }
  }

  return parts
    .map((p) => String(p).trim().replace(/\.$/, '') + '.')
    .join(' ')
    .replace(/\.\./g, '.')
    .trim();
}