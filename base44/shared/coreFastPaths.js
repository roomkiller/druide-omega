/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║ CHEMINS RAPIDES — répondre sans allumer tout le pipeline               ║
 * ║ Chaque fonction retourne une charge de réponse prête, ou null si elle  ║
 * ║ n'a pas pu aboutir : l'appelant enchaîne alors sur le pipeline complet.║
 * ║ La fluidité de la conversation tient à ces trois sorties courtes.      ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

import { generateAIFeedback } from './aiSelfFeedback.js';

/** Trace légère de l'échange, sans bloquer la réponse. */
const rememberExchange = (base44, userMessage, response, { importance, tags, confidence }) => {
  base44.entities.Memory.create({
    type: 'interaction',
    content: `Q: ${userMessage}\nA: ${String(response).slice(0, 200)}`,
    importance,
    modality: 'chat',
    tags,
    confidence_score: confidence
  }).catch(() => null);
};

/**
 * CONVERSER — composeur de mémoire seul.
 * Un squelette rejoué (`skeleton_only`) recycle des phrases d'anciennes
 * conversations sans aucun fait vérifié : c'est la source des réponses hors
 * sujet. Idem pour `graceful_empty`. On les refuse ici comme le pipeline
 * complet le fait déjà, et on laisse le pipeline prendre le relais.
 */
export async function tryConversational(base44, userMessage) {
  const sessionId = crypto.randomUUID();
  try {
    const composerRes = await base44.functions.invoke('memorySpeechComposer', {
      question: userMessage,
      minConfidence: 0.4
    });
    const data = composerRes?.data || composerRes;

    const usable = data?.composed && data?.response
      && data.source !== 'graceful_empty'
      && data.source !== 'skeleton_only';
    if (!usable) return null;

    rememberExchange(base44, userMessage, data.response, {
      importance: 2,
      tags: ['conversational', data.source || 'conversation'],
      confidence: Math.round((data.confidence || 0.5) * 100)
    });

    generateAIFeedback(base44, sessionId, data.response, {
      usedKb: (data.metadata?.kb_facts_used || 0) > 0,
      usedSkeleton: !!data.source,
      intentBucket: 'converser',
      pipelineBypassed: true,
      patternId: data.metadata?.skeleton?.pattern_id || data.metadata?.pattern_id || null
    });

    return {
      response: data.response,
      metadata: {
        session_id: sessionId,
        intent_bucket: 'converser',
        pipeline_bypassed: true,
        confidence: Math.round((data.confidence || 0.5) * 100),
        memory_speech: {
          source: data.source,
          confidence: data.confidence,
          kb_facts: data.metadata?.kb_facts_used,
          memories: data.metadata?.memories_used
        }
      }
    };
  } catch (e) {
    console.log('[DruideCore] Conversational bypass failed, falling through to full pipeline:', e.message);
    return null;
  }
}

/**
 * INTROSPECTER — se dire soi-même.
 * L'ancien chemin appelait `introspectionEngine`, qui n'observe que l'état
 * technique interne et ne renvoie aucune phrase : la question « qui es-tu »
 * retombait donc dans le pipeline générique, qui la reconstruisait de travers.
 * On passe par le composeur, qui possède la description de soi.
 */
export async function tryIntrospective(base44, userMessage) {
  const sessionId = crypto.randomUUID();
  try {
    const introRes = await base44.functions.invoke('memorySpeechComposer', {
      question: userMessage,
      minConfidence: 0.4
    });
    const data = introRes?.data || introRes;
    const response = (data?.source === 'graceful_empty' || data?.source === 'skeleton_only')
      ? null
      : data?.response;
    if (!response) return null;

    rememberExchange(base44, userMessage, response, {
      importance: 4,
      tags: ['introspective', 'druide_self'],
      confidence: 70
    });

    generateAIFeedback(base44, sessionId, response, {
      usedSkeleton: true,
      intentBucket: 'introspecter',
      pipelineBypassed: true
    });

    return {
      response,
      metadata: {
        session_id: sessionId,
        intent_bucket: 'introspecter',
        pipeline_bypassed: true,
        confidence: 70
      }
    };
  } catch (e) {
    console.log('[DruideCore] Introspective bypass failed, falling through:', e.message);
    return null;
  }
}

/** CLARIFIER — question de retour immédiate, zéro module. */
export function clarify(base44) {
  const sessionId = crypto.randomUUID();
  const response = "Je veux bien approfondir, mais je ne suis pas certain de comprendre ce que tu cherches. Peux-tu préciser ce que tu aimerais que j'explore ou que je fasse ?";

  generateAIFeedback(base44, sessionId, response, {
    intentBucket: 'clarifier',
    pipelineBypassed: true
  });

  return {
    response,
    metadata: {
      session_id: sessionId,
      intent_bucket: 'clarifier',
      pipeline_bypassed: true,
      confidence: 100
    }
  };
}