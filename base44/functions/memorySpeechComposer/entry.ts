/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Memory Speech Composer                                     ║
 * ║ Le module qui parle avec sa mémoire, pas avec un LLM.                     ║
 * ║                                                                            ║
 * ║ Pipeline :                                                                 ║
 * ║   question → rituel social ? → équation ? → mots-clés                      ║
 * ║           → KB + mémoires pertinentes → squelette de parole                ║
 * ║           → assemblage structuré → formatage → réponse                     ║
 * ║                                                                            ║
 * ║ Aucun appel LLM : quand la mémoire manque de matière, le module le dit     ║
 * ║ honnêtement et laisse l'appelant décider.                                  ║
 * ║                                                                            ║
 * ║ Les outils vivent dans base44/shared/ — ce fichier orchestre.              ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import { stripMetadata, formatResponse, lowerFirst, clipAtBoundary } from '../../shared/speechFormatter.js';
import { readKbCorpus } from '../../shared/kbCorpus.js';
import {
  keywordsOf, relevanceScore,
  selectKbFacts, selectMemories, isHumanCentric, selectPsychologicalFacts
} from '../../shared/speechRetrieval.js';
import { composeResponse, isRelevantSkeletonSegment } from '../../shared/speechComposition.js';
import { enunciate } from '../../shared/selfEnunciation.js';
import { logReflection } from '../../shared/reflectionLog.js';
import { solveByEquation } from '../../shared/equationReasoning.js';
import { describeSelf } from '../../shared/selfDescription.js';
import {
  detectRitual, simpleRitualResponse, conversationalPhrase,
  PROACTIVE_STARTERS, CONVERSATIONAL_TAGS, EMPTY_META, pick
} from '../../shared/socialRituals.js';

// Marque une fiche KB comme consultée (non-bloquant).
const touchKb = (base44, items) => {
  items.forEach((f) => {
    if (f.kb_id) {
      base44.asServiceRole.entities.KnowledgeBase
        .update(f.kb_id, { access_count: 1, last_accessed: new Date().toISOString() })
        .catch(() => null);
    }
  });
};

// Tisse un repère psychologique en fin de réponse.
const weavePsychInsight = (response, psychFacts) => {
  if (psychFacts.length === 0) return response;
  const insight = String(psychFacts[0].fact).trim().replace(/\.$/, '');
  return response.replace(/\.$/, '') + '. Sur le plan humain, ' + lowerFirst(insight) + '.';
};

/**
 * Une amorce ou un complément issu d'une fiche ne doit jamais sortir au format
 * brut de la base (« Q: … A: … », question stockée, préfixe de métadonnée).
 */
const speakableFact = (raw) => {
  const t = stripMetadata(String(raw || '')).trim();
  if (!t || t.length < 20) return null;
  if (/\?\s*$/.test(t)) return null;
  if (/(^|\s)[QA]\s*:/.test(t) || /\bR[ée]ponse\s*:/i.test(t)) return null;
  const clipped = clipAtBoundary(t, 220);
  return clipped.replace(/\.?$/, '.');
};

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const body = await req.json();
  const {
    question,
    questionType = null,
    complexity = null,
    emotionalWeight = null,
    domains = [],
    dominantTension = null,
    consciousnessLevel = null,
    minConfidence = 0.45,
    action = null,
    conversationContext = null,
    // Corpus syntonisé : fourni par l'appelant pour éviter une relecture.
    sharedKb = null,
    sharedMemories = null
  } = body;

  // Le mode starter proactif ne nécessite pas de question — Druide démarre lui-même.
  if (action !== 'start_conversation' && !question) {
    return Response.json({ error: 'Missing question' }, { status: 400 });
  }

  const keywords = question ? keywordsOf(question) : [];
  const normalizedQ = String(question || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // ═══════════════════════════════════════════════════════════════════════════
  // 0a. Rituels sociaux — salutation, clôture, demande d'avis.
  // Ce ne sont pas des questions de connaissances : exiger des faits KB les
  // ferait tomber sur le message générique « pas assez de matière ».
  // ═══════════════════════════════════════════════════════════════════════════
  const ritual = question ? detectRitual(normalizedQ, keywords.length) : null;
  const simpleRitual = ritual ? simpleRitualResponse(ritual) : null;
  if (simpleRitual) return Response.json(simpleRitual);

  // ═══════════════════════════════════════════════════════════════════════════
  // 0b. Mode starter proactif — Druide démarre la conversation lui-même.
  // ═══════════════════════════════════════════════════════════════════════════
  if (action === 'start_conversation') {
    const [starterKb, recentThoughts] = await Promise.all([
      readKbCorpus(base44).catch(() => []),
      base44.asServiceRole.entities.ConsciousThought
        .list('-created_date', 3).catch(() => [])
    ]);

    const starterEntries = (starterKb || []).filter((kb) =>
      (kb.tags || []).some((t) => t.includes('starter') || t.includes('proactif'))
    );

    const starters = [...PROACTIVE_STARTERS];
    // Une pensée autonome récente devient l'amorce la plus vivante.
    const thought = String(recentThoughts?.[0]?.thought || '').slice(0, 200).trim();
    if (thought) starters.unshift(`J'ai pensé à cela récemment : « ${thought} ». Qu'en penses-tu ?`);

    const starterFact = speakableFact(starterEntries[0]?.extracted_facts?.[0]);
    const response = pick(starters);

    return Response.json({
      composed: true,
      response: starterFact ? `${response} ${starterFact}` : response,
      source: 'proactive_starter',
      confidence: 0.9,
      needs_llm: false,
      metadata: {
        ...EMPTY_META,
        kb_facts_used: starterFact ? 1 : 0,
        sources: starterEntries.length > 0 ? [starterEntries[0].title] : [],
        autonomous_thought_used: !!thought
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 0c. Rituels conversationnels — accusés, relances, transitions.
  // Ces messages courts ne produisent pas de mots-clés KB, mais les fiches
  // taguées « conversation » peuvent enrichir la formule.
  // ═══════════════════════════════════════════════════════════════════════════
  const isConversationalRitual = ritual === 'acknowledgment' || ritual === 'followup' || ritual === 'transition';
  if (isConversationalRitual) {
    const convKb = await readKbCorpus(base44).catch(() => []);

    const relevantConv = (convKb || [])
      .filter((kb) => (kb.tags || []).some((t) => t.includes('conversation')))
      .filter((kb) => (kb.tags || []).some((t) => CONVERSATIONAL_TAGS[ritual].some((tag) => t.includes(tag))));

    let response = conversationalPhrase(ritual);
    if (conversationContext?.lastTopic) {
      response = `Sur ${conversationContext.lastTopic} — ${response}`;
    }

    const convFact = speakableFact(relevantConv[0]?.extracted_facts?.[0]);
    if (convFact) response = `${response} ${convFact}`;

    return Response.json({
      composed: true,
      response,
      source: 'conversational_' + ritual,
      confidence: 0.85,
      needs_llm: false,
      metadata: {
        ...EMPTY_META,
        kb_facts_used: convFact ? 1 : 0,
        sources: convFact ? [relevantConv[0].title] : [],
        conversational_type: ritual,
        context_topic: conversationContext?.lastTopic || null
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 0d. Moteur de raisonnement par équations — logique formelle résolue
  // localement (syllogismes, probabilités, transitivité). Pas d'appel externe.
  // ═══════════════════════════════════════════════════════════════════════════
  const equationResult = solveByEquation(question, normalizedQ);
  if (equationResult) {
    return Response.json({
      composed: true,
      response: equationResult.response,
      source: 'equation_reasoning',
      confidence: 0.92,
      needs_llm: false,
      metadata: {
        ...EMPTY_META,
        equation: equationResult.equation,
        reasoning_type: equationResult.type
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 1. Question identitaire — peu de mots-clés (des stop words), mais doit
  // récupérer le chapitre d'identité forgée (tag druide_identity).
  // Motifs ancrés sur l'identité SEULE : « comment t » était bien trop large,
  // il capturait « comment traiter », « comment trouver », et détournait ces
  // questions vers le récit identitaire avec une confiance de 95%.
  // ═══════════════════════════════════════════════════════════════════════════
  const isIdentityQuestion = /qui es.tu|tu es qui|ton nom|t.appelles|comment tu te nommes|presente.toi|parle.moi de toi|ton identite|qu.est.ce que tu es|tu es quoi|dis.moi qui/.test(normalizedQ);

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. Récupérer bases de connaissances et mémoires
  // Balayage large : se limiter aux fiches récentes rendait invisible la
  // majorité de la base. La sélection lexicale fait ensuite le tri.
  // ═══════════════════════════════════════════════════════════════════════════
  // SYNTONISATION — quand l'appelant a déjà lu ce corpus (druideCore le lit dans
  // sa vague parallèle), il nous le transmet et on ne relit rien. Même matière,
  // une seule lecture par tour. Sans corpus fourni, on lit nous-mêmes.
  const [kbEntries, memories] = sharedKb
    ? [sharedKb, sharedMemories || []]
    : await Promise.all([
        readKbCorpus(base44).catch(() => []),
        base44.asServiceRole.entities.Memory.list('-importance', 25).catch(() => [])
      ]);

  const activeKb = (kbEntries || []).filter((kb) => kb.active !== false);

  // Une question d'identité se répond en se présentant, pas en récitant la
  // fiche : on sort directement une description dite à la première personne.
  if (isIdentityQuestion) {
    const wantsLong = /presente.toi|parle.moi de toi|dis.moi qui/.test(normalizedQ);
    return Response.json({
      composed: true,
      response: describeSelf(null, { long: wantsLong }),
      source: 'self_description',
      confidence: 0.95,
      needs_llm: false,
      metadata: { ...EMPTY_META }
    });
  }
  const identityFacts = [];

  const facts = identityFacts.length > 0 ? identityFacts : selectKbFacts(activeKb, keywords);
  const relevantMemories = selectMemories(memories || [], keywords);

  // Lentille psychologique : active quand la question touche l'humain
  // (relation, émotion, communication, corps, comportement…).
  const psychFacts = isHumanCentric(questionType, keywords)
    ? selectPsychologicalFacts(activeKb, keywords, 1)
    : [];

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. Récupérer le squelette de parole le plus pertinent
  // ═══════════════════════════════════════════════════════════════════════════
  let skeleton = null;
  let skeletonMeta = null;
  try {
    const skelRes = await base44.functions.invoke('speechPatternEngine', {
      action: 'retrieve',
      question, questionType, complexity, emotionalWeight,
      domains, dominantTension, consciousnessLevel, threshold: 0.4
    });
    const skelData = skelRes?.data || skelRes;
    if (skelData?.matched) {
      skeleton = skelData.metadata;
      skeletonMeta = { pattern_id: skelData.pattern_id, match_score: skelData.match_score };
    }
  } catch (e) {
    console.log('[MemorySpeechComposer] Skeleton retrieve failed:', e.message);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. Évaluer la confiance — a-t-on assez de matière pour parler ?
  // ═══════════════════════════════════════════════════════════════════════════
  const avgRelevance = (items, getText) => items.length > 0
    ? Math.min(1, items.reduce((sum, i) => sum + relevanceScore(keywords, getText(i)), 0) / items.length)
    : 0;

  const kbCoverage = avgRelevance(facts, (f) => f.fact);
  const memoryCoverage = avgRelevance(relevantMemories, (m) => m.content);
  const skeletonConfidence = skeletonMeta ? Math.min(1, skeletonMeta.match_score) : 0.2;

  // Pondération : la KB est la source la plus fiable.
  let confidence = (kbCoverage * 0.5) + (memoryCoverage * 0.25) + (skeletonConfidence * 0.25);
  if (facts.length === 0 && relevantMemories.length === 0) confidence = 0;
  if (skeleton && (facts.length > 0 || relevantMemories.length > 0)) confidence += 0.1;
  if (isIdentityQuestion && identityFacts.length > 0) confidence = 0.95;
  confidence = Math.min(1, confidence);

  const coverageMeta = {
    psych_facts_used: psychFacts.length,
    skeleton: skeletonMeta,
    kb_coverage: Math.round(kbCoverage * 100),
    memory_coverage: Math.round(memoryCoverage * 100),
    psych_sources: psychFacts.map((f) => f.source).filter(Boolean)
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. Confiance suffisante — composer selon le squelette
  // ═══════════════════════════════════════════════════════════════════════════
  if (confidence >= minConfidence && facts.length > 0) {
    let response = composeResponse(skeleton, facts, relevantMemories, question, {
      confidence: Math.round(confidence * 100)
    });
    response = weavePsychInsight(response, psychFacts);
    response = formatResponse(response);

    touchKb(base44, facts);
    touchKb(base44, psychFacts);
    logReflection(base44, {
      question,
      factCount: facts.length,
      memoryCount: relevantMemories.length,
      confidence: Math.round(confidence * 100),
      speechPath: 'memory_kb_skeleton',
      response
    });

    return Response.json({
      composed: true,
      response,
      source: 'memory_kb_skeleton',
      confidence,
      needs_llm: false,
      metadata: {
        ...coverageMeta,
        kb_facts_used: facts.length,
        memories_used: relevantMemories.length,
        sources: facts.map((f) => f.source).filter(Boolean)
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. Chemin squelette seul — match fort mais KB/mémoire vides.
  // Le squelette porte une réponse-type : c'est la voix de Druide forgée par
  // ses interactions passées, restituée telle quelle.
  // ═══════════════════════════════════════════════════════════════════════════
  if (skeletonMeta && skeletonMeta.match_score >= 0.6 && skeleton?.architecture) {
    let skeletonResponse = null;
    try {
      const skelRes = await base44.functions.invoke('speechPatternEngine', {
        action: 'retrieve',
        question, questionType, complexity, emotionalWeight,
        domains, dominantTension, consciousnessLevel, threshold: 0.6
      });
      const skelData = skelRes?.data || skelRes;
      if (skelData?.matched && skelData?.response) skeletonResponse = skelData.response;
    } catch (_) { /* fallback silencieux */ }

    if (skeletonResponse) {
      // Énonciation : même une réponse-type issue d'un squelette est dite par
      // Druide, précédée de sa lecture de l'entrée.
      const spoken = enunciate(weavePsychInsight(skeletonResponse, psychFacts), {
        question,
        factCount: 0,
        memoryCount: 0,
        confidence: Math.round((skeletonMeta.match_score / 2) * 100)
      });
      const finalResponse = formatResponse(spoken);
      if (psychFacts.length > 0) touchKb(base44, psychFacts);
      logReflection(base44, {
        question,
        factCount: 0,
        memoryCount: 0,
        confidence: Math.round((skeletonMeta.match_score / 2) * 100),
        speechPath: 'skeleton_only',
        response: finalResponse
      });
      return Response.json({
        composed: true,
        response: finalResponse,
        source: 'skeleton_only',
        confidence: skeletonMeta.match_score / 2, // confiance modérée (pas de KB)
        needs_llm: false,
        metadata: {
          ...coverageMeta,
          kb_facts_used: 0,
          memories_used: 0,
          kb_coverage: 0,
          memory_coverage: 0,
          sources: []
        }
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 7. Confiance insuffisante mais matière présente — synthèse autonome.
  // Druide parle avec ce qu'il sait, même imparfaitement, plutôt que de se
  // taire. Les mémoires brutes sont exclues (souvent des questions ou du
  // bruit) : on ne garde que la matière vérifiée, les faits KB.
  // ═══════════════════════════════════════════════════════════════════════════
  if (facts.length > 0) {
    // Une ouverture doit être une affirmation, pas une question stockée.
    const cleanOpening = (text) => {
      const t = stripMetadata(String(text || '').trim());
      if (!t || /^[Qq][:\?]/.test(t) || /\?$/.test(t) || t.length < 15) return null;
      return t.replace(/\.$/, '') + '.';
    };

    const parts = [];
    let opened = false;
    if (skeleton?.architecture?.opening) {
      const o = cleanOpening(skeleton.architecture.opening);
      if (o && isRelevantSkeletonSegment(o, keywords)) { parts.push(o); opened = true; }
    }
    if (!opened) {
      const o = cleanOpening(facts[0].fact);
      if (o) { parts.push(o); opened = true; }
    }

    // Corps : faits KB restants.
    const startIdx = opened ? 1 : 0;
    facts.slice(startIdx, startIdx + 5).forEach((f) => {
      const fact = stripMetadata(String(f.fact)).trim().replace(/\.$/, '');
      if (fact && !/^[Qq][:?]/.test(fact) && !/\?$/.test(fact)) {
        parts.push(fact.charAt(0).toUpperCase() + fact.slice(1) + '.');
      }
    });

    // Fermeture : insight psychologique, ou fermeture du squelette.
    if (psychFacts.length > 0) {
      const insight = String(psychFacts[0].fact).trim().replace(/\.$/, '');
      parts.push('Sur le plan humain, ' + lowerFirst(insight) + '.');
    } else if (skeleton?.architecture?.closing) {
      const c = cleanOpening(skeleton.architecture.closing);
      if (c) parts.push(c);
    }

    let response = parts
      .map((p) => {
        const t = String(p).trim();
        return /[!?]$/.test(t) ? t : t.replace(/\.$/, '') + '.';
      })
      .join(' ')
      .replace(/\.\./g, '.')
      .replace(/\s+/g, ' ')
      .trim();

    // Sécurité : synthèse trop mince, on retombe sur la première mémoire.
    if (response.length < 40 && relevantMemories.length > 0) {
      response = clipAtBoundary(stripMetadata(relevantMemories[0].content), 300);
    }

    response = formatResponse(enunciate(response, {
      question,
      factCount: facts.length,
      memoryCount: relevantMemories.length,
      confidence: Math.round(confidence * 100)
    }));

    touchKb(base44, facts);
    touchKb(base44, psychFacts);
    logReflection(base44, {
      question,
      factCount: facts.length,
      memoryCount: relevantMemories.length,
      confidence: Math.round(confidence * 100),
      speechPath: 'synthesis_bypass',
      response
    });

    // ── Pas d'écriture en base ──
    // Cette synthèse est un collage fait sous le seuil de confiance : ce n'est
    // pas du savoir vérifié. L'enregistrer en fiche « ready » la faisait
    // ressortir plus tard comme un fait établi, et Druide finissait par citer
    // ses propres suppositions — la source même des hallucinations. Seules les
    // sources vérifiées entrent dans la base ; celle-ci reste dite, pas apprise.
    console.log('[MemorySpeechComposer] Synthèse non enregistrée (confiance ' + confidence.toFixed(2) + ') — pas de savoir auto-généré');

    return Response.json({
      composed: true,
      response,
      source: 'synthesis_bypass',
      confidence,
      needs_llm: false,
      metadata: {
        ...coverageMeta,
        kb_facts_used: facts.length,
        memories_used: relevantMemories.length,
        sources: facts.map((f) => f.source).filter(Boolean),
        note: 'Contournement LLM — synthèse autonome depuis la mémoire'
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 8. Aucune matière — réponse gracieuse honnête, pas de délégation.
  // ═══════════════════════════════════════════════════════════════════════════
  return Response.json({
    composed: true,
    response: "Je n'ai pas encore assez de matière en mémoire pour répondre sur ce sujet. Peux-tu m'en dire plus, ou reformuler ?",
    source: 'graceful_empty',
    confidence: 0,
    needs_llm: false,
    metadata: { ...EMPTY_META, skeleton: skeletonMeta }
  });
});