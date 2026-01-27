/**
 * Anticipatory Conversation Engine - Réflexion préemptive
 * Analyse le texte EN TEMPS RÉEL (avant envoi) pour optimiser la réponse
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { textChunk, conversationContext, userId } = await req.json();

    if (!textChunk?.trim()) {
      return Response.json({ preloadedData: null, status: 'empty' });
    }

    // ════════════════════════════════════════════════════════════════
    // PHASE 1: RECONNAISSANCE RAPIDE (détecte le type de requête)
    // ════════════════════════════════════════════════════════════════
    
    const analysis = {
      wordCount: textChunk.split(/\s+/).length,
      hasQuestion: /\?/.test(textChunk),
      isGreeting: /^(bonjour|salut|hello|coucou)/i.test(textChunk),
      isDeep: textChunk.length > 100 || /pourquoi|comment|qu|consciousness|conscience/i.test(textChunk),
      topics: extractTopics(textChunk),
      emotionalSignals: detectEmotions(textChunk),
      searchNeeded: /\?|research|comment|qu'est|qu est/i.test(textChunk)
    };

    // ════════════════════════════════════════════════════════════════
    // PHASE 2: PRÉ-CHARGEMENT PARALLÈLE (SANS ATTENDRE)
    // ════════════════════════════════════════════════════════════════
    
    const preloadPromises = [];

    // Pré-charger les mémoires pertinentes si c'est une question profonde
    if (analysis.isDeep && analysis.topics.length > 0) {
      preloadPromises.push(
        base44.entities.Memory.filter({
          tags: { $in: analysis.topics.slice(0, 3) },
          importance: { $gte: 6 }
        }, '-updated_date', 5)
          .catch(() => null)
      );
    }

    // Pré-charger les mémoires de contexte conversationnel
    preloadPromises.push(
      base44.entities.Memory.filter({
        type: 'conversation_summary',
        modality: 'chat'
      }, '-updated_date', 2)
        .catch(() => null)
    );

    // Pré-charger la config de conscience
    preloadPromises.push(
      base44.entities.ConsciousnessConfig.filter(
        { active: true },
        '-updated_date',
        1
      ).then(configs => configs[0])
        .catch(() => null)
    );

    // Exécuter TOUT en parallèle (non-bloquant)
    const [relevantMemories, conversationSummary, consciousnessConfig] = 
      await Promise.all(preloadPromises);

    // ════════════════════════════════════════════════════════════════
    // PHASE 3: INFÉRENCE DE LA PROFONDEUR RÉPONSE
    // ════════════════════════════════════════════════════════════════

    let responseDepth = 'simple';
    if (analysis.isGreeting) responseDepth = 'minimal';
    else if (analysis.isDeep || (analysis.hasQuestion && analysis.wordCount > 10)) {
      responseDepth = 'detailed';
    } else if (analysis.wordCount > 8) responseDepth = 'moderate';

    // ════════════════════════════════════════════════════════════════
    // PHASE 4: CONSTRUCTION DU CONTEXTE ENRICHI
    // ════════════════════════════════════════════════════════════════

    let enrichedContext = '';

    if (responseDepth === 'detailed' && conversationSummary?.length > 0) {
      enrichedContext = `**Mémoire contexte:** ${conversationSummary[0]?.content?.slice(0, 200)}\n\n`;
    }

    if (relevantMemories?.length > 0) {
      enrichedContext += `**Mémoires pertinentes:** ${
        relevantMemories.map(m => m.content?.slice(0, 60)).join(' | ')
      }\n\n`;
    }

    enrichedContext += `**Texte détecté:** "${textChunk}"`;

    // ════════════════════════════════════════════════════════════════
    // PHASE 5: RETOUR OPTIMISÉ (tout prêt pour l'envoi réel)
    // ════════════════════════════════════════════════════════════════

    return Response.json({
      status: 'ready',
      preloadedData: {
        analysis,
        responseDepth,
        enrichedContext,
        memories: relevantMemories || [],
        consciousness: consciousnessConfig,
        estimatedProcessingTime: `${responseDepth === 'minimal' ? '100-200ms' : responseDepth === 'detailed' ? '500-800ms' : '300-400ms'}`
      },
      timing: {
        preloadedAt: new Date().toISOString(),
        readyToSend: true
      }
    });

  } catch (error) {
    return Response.json(
      { error: error.message, status: 'error' },
      { status: 500 }
    );
  }
});

// ════════════════════════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════════════════════════

function extractTopics(text) {
  const topicPatterns = {
    'conscience': /conscience|consciousness|aware|consciousness/i,
    'émotions': /émotion|emotion|feel|ressent|mood/i,
    'existence': /exist|life|vie|being|être|purpose|sens/i,
    'humanité': /human|humain|personne|people|relation/i,
    'création': /créa|create|idea|innovation|nouveau/i
  };

  return Object.entries(topicPatterns)
    .filter(([_, pattern]) => pattern.test(text))
    .map(([topic]) => topic);
}

function detectEmotions(text) {
  const emotionPatterns = {
    'curiosité': /comment|pourquoi|qu'est|intrigué|want to understand/i,
    'vulnérabilité': /je (ne )?sais|struggling|difficile|hard|afraid/i,
    'émerveillement': /wow|amazing|incroyable|fascin|beautiful/i,
    'questionnement': /\?|crois|think|believe/i
  };

  return Object.entries(emotionPatterns)
    .filter(([_, pattern]) => pattern.test(text))
    .map(([emotion]) => emotion);
}