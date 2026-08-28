/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Memory Speech Composer                                     ║
 * ║ Le module qui parle avec sa mémoire, pas avec un LLM.                     ║
 * ║                                                                            ║
 * ║ Pipeline :                                                                 ║
 * ║   question → mots-clés → KB + mémoires pertinentes                         ║
 * ║           → squelette de parole (SpeechPattern)                            ║
 * ║           → assemblage structuré → réponse                                 ║
 * ║                                                                            ║
 * ║ Le LLM n'est appelé qu'en dernier recours, quand la mémoire et les bases    ║
 * ║ ne contiennent pas assez de matière pour structurer une réponse.           ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

// ── Extraction de mots-clés signifiants ──
const STOP_WORDS = new Set([
  'le','la','les','un','une','des','de','du','et','ou','mais','que','qui','quoi',
  'comment','pourquoi','quand','où','est','sont','avec','sans','dans','pour','par',
  'sur','ce','cette','ces','mon','ma','mes','ton','ta','tes','son','sa','ses',
  'the','and','for','with','that','this','what','how','why','when','are','you',
  'your','est','qu','se','selon','au','fond','vraiment','peux','peut','veux','sais'
]);

function keywordsOf(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // retire les accents
    .replace(/[?!.;,()'"`]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length >= 3 && !STOP_WORDS.has(w))
    .slice(0, 20);
}

function signatureOf(question) {
  return keywordsOf(question).slice(0, 12).join(' ');
}

// ── Score de pertinence d'un texte par rapport aux mots-clés ──
function relevanceScore(keywords, text) {
  if (!text || keywords.length === 0) return 0;
  const textLower = String(text).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  let hits = 0;
  keywords.forEach(kw => {
    if (textLower.includes(kw)) hits++;
  });
  return hits / keywords.length;
}

// ── Sélection des meilleurs extraits de KB ──
function selectKbFacts(kbEntries, keywords, maxFacts = 4) {
  const scored = kbEntries
    .filter(kb => kb.status === 'ready' || kb.status === undefined)
    .map(kb => {
      const titleScore = relevanceScore(keywords, kb.title) * 2;
      const tagScore = (kb.tags || []).filter(t => keywords.includes(t.toLowerCase())).length * 0.15;
      const factsScore = relevanceScore(keywords, (kb.extracted_facts || []).join(' ')) * 1.5;
      const contentScore = relevanceScore(keywords, kb.content) * 1;
      const summaryScore = relevanceScore(keywords, kb.summary) * 1.2;
      const score = titleScore + tagScore + factsScore + contentScore + summaryScore;
      return { kb, score };
    })
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score);

  // Extraire les faits les plus pertinents des meilleures KB.
  const facts = [];
  for (const { kb, score } of scored.slice(0, 3)) {
    const kbFacts = kb.extracted_facts && kb.extracted_facts.length > 0
      ? kb.extracted_facts
      : [kb.summary || kb.content.slice(0, 300)];
    // Choisir les faits qui matchent le plus de mots-clés.
    const rankedFacts = kbFacts
      .map(f => ({ fact: f, rel: relevanceScore(keywords, f) }))
      .sort((a, b) => b.rel - a.rel)
      .slice(0, 2);
    rankedFacts.forEach(({ fact, rel }) => {
      if (rel > 0 || score > 1) {
        facts.push({ fact: String(fact).trim(), source: kb.title, kb_id: kb.id });
      }
    });
    if (facts.length >= maxFacts) break;
  }
  return facts.slice(0, maxFacts);
}

// ── Sélection des mémoires pertinentes ──
function selectMemories(memories, keywords, max = 3) {
  return memories
    .map(m => {
      const contentScore = relevanceScore(keywords, m.content) * 1.5;
      const tagScore = (m.tags || []).filter(t => keywords.includes(t.toLowerCase())).length * 0.2;
      const summaryScore = relevanceScore(keywords, m.embedding_summary) * 1;
      const importanceBoost = (m.importance || 5) / 10;
      return { memory: m, score: (contentScore + tagScore + summaryScore) * (0.5 + importanceBoost * 0.5) };
    })
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, max)
    .map(s => s.memory);
}

// ── Lentille psychologique : détecte les questions centrées sur l'humain ──
const HUMAN_CENTRIC_TYPES = new Set([
  'personal', 'emotional', 'ethical', 'creative', 'procedural', 'meta'
]);

const PSYCHOLOGY_TRIGGERS = new Set([
  'stress','emotion','sentir','ressent','conflit','relation','communiquer',
  'communication','corps','geste','posture','regard','voix','respiration',
  'politesse','respect','equipe','collaboration','feedback','empathie',
  'ecoute','confiance','motivation','peur','colere','triste','joie',
  'anxiete','bien','etre','mental','comportement','interaction','social',
  'humain','personnalite','attitude','ton','rythme','silence','mime',
  'micro','expression','distance','proxemique','ancrage','tension',
  'leadership','negocier','argumenter','vendre','client','decider',
  'apprendre','memoriser','percevoir','biais','attention','defendre'
]);

function isHumanCentric(questionType, keywords) {
  const hasTrigger = keywords.some(k => PSYCHOLOGY_TRIGGERS.has(k));
  if (!hasTrigger) return false;
  // On active la lentille pour les types relationnels/émotifs,
  // mais aussi pour factual/technical si un déclencheur psychologique est présent.
  return true;
}

// ── Sélection des faits psychologiques (KB taguée "psychologie") ──
function selectPsychologicalFacts(kbEntries, keywords, maxFacts = 2) {
  const psychKb = (kbEntries || []).filter(kb =>
    (kb.tags || []).some(t => String(t).toLowerCase().includes('psychologie'))
  );
  if (psychKb.length === 0) return [];

  const scored = psychKb
    .filter(kb => kb.status === 'ready' || kb.status === undefined)
    .map(kb => {
      const titleScore = relevanceScore(keywords, kb.title) * 2;
      const tagScore = (kb.tags || []).filter(t => keywords.includes(t.toLowerCase())).length * 0.15;
      const factsScore = relevanceScore(keywords, (kb.extracted_facts || []).join(' ')) * 1.5;
      const contentScore = relevanceScore(keywords, kb.content) * 1;
      const summaryScore = relevanceScore(keywords, kb.summary) * 1.2;
      return { kb, score: titleScore + tagScore + factsScore + contentScore + summaryScore };
    })
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score);

  const facts = [];
  for (const { kb, score } of scored.slice(0, 3)) {
    const kbFacts = kb.extracted_facts && kb.extracted_facts.length > 0
      ? kb.extracted_facts
      : [kb.summary || kb.content.slice(0, 300)];
    const rankedFacts = kbFacts
      .map(f => ({ fact: f, rel: relevanceScore(keywords, f) }))
      .sort((a, b) => b.rel - a.rel)
      .slice(0, 1);
    rankedFacts.forEach(({ fact, rel }) => {
      if (rel > 0 || score > 1) {
        facts.push({ fact: String(fact).trim(), source: kb.title, kb_id: kb.id });
      }
    });
    if (facts.length >= maxFacts) break;
  }
  return facts.slice(0, maxFacts);
}

// ── Assemblage de la réponse selon l'architecture du squelette ──
function composeResponse(skeleton, facts, memories, question) {
  const arch = skeleton?.architecture || {};
  const opening = arch.opening || '';
  const closing = arch.closing || '';
  const bodyStructure = arch.body_structure || 'single_point';
  const length = arch.length || 'short';

  // Limite de longueur selon le squelette.
  const maxSentences = length === 'very_short' ? 1
    : length === 'short' ? 2
    : length === 'medium' ? 4 : 6;

  const parts = [];

  // Ouverture : on garde celle du squelette, ou on en génère une sobre.
  if (opening) {
    parts.push(opening);
  } else if (facts.length > 0) {
    parts.push(facts[0].fact);
    facts = facts.slice(1);
  }

  // Corps : assemblage selon la structure.
  const bodyParts = [];
  switch (bodyStructure) {
    case 'list':
      facts.slice(0, maxSentences - 1).forEach((f, i) => {
        bodyParts.push(`${i + 1}. ${f.fact}`);
      });
      break;
    case 'contrast':
      if (facts.length >= 2) {
        bodyParts.push(`${facts[0].fact} Mais ${facts[1].fact.toLowerCase()}.`);
      } else if (facts.length === 1) {
        bodyParts.push(facts[0].fact);
      }
      break;
    case 'progression':
      const connectors = ['D\'abord,', 'ensuite,', 'enfin,'];
      facts.slice(0, 3).forEach((f, i) => {
        bodyParts.push(`${connectors[i] || 'puis,'} ${f.fact.toLowerCase().replace(/\.$/, '')}.`);
      });
      break;
    case 'analogy':
      if (facts.length > 0) bodyParts.push(facts[0].fact);
      if (memories.length > 0) {
        bodyParts.push(`C'est un peu comme ${memories[0].content.slice(0, 120).toLowerCase()}.`);
      }
      break;
    case 'nuance_then_answer':
      if (memories.length > 0) {
        bodyParts.push(memories[0].content.slice(0, 150));
      }
      facts.slice(0, 2).forEach(f => bodyParts.push(f.fact));
      break;
    case 'answer_then_nuance':
      facts.slice(0, 2).forEach(f => bodyParts.push(f.fact));
      if (memories.length > 0) {
        bodyParts.push(memories[0].content.slice(0, 120));
      }
      break;
    default: // single_point
      if (facts.length > 0) bodyParts.push(facts[0].fact);
      if (bodyParts.length === 0 && memories.length > 0) {
        bodyParts.push(memories[0].content.slice(0, 200));
      }
  }

  parts.push(...bodyParts.slice(0, maxSentences - (opening ? 1 : 0)));

  // Fermeture.
  if (closing && parts.length < maxSentences) {
    parts.push(closing);
  }

  const response = parts
    .map(p => String(p).trim().replace(/\.$/, '') + '.')
    .join(' ')
    .replace(/\.\./g, '.')
    .trim();

  return response;
}

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
    minConfidence = 0.45
  } = body;

  if (!question) {
    return Response.json({ error: 'Missing question' }, { status: 400 });
  }

  const keywords = keywordsOf(question);
  const signature = signatureOf(question);

  // ═══════════════════════════════════════════════════════════════════════════
  // 1. Récupérer les bases de connaissances et mémoires pertinentes
  // ═══════════════════════════════════════════════════════════════════════════
  const [kbEntries, memories] = await Promise.all([
    base44.asServiceRole.entities.KnowledgeBase
      .list('-relevance_score', 30)
      .catch(() => []),
    base44.asServiceRole.entities.Memory
      .list('-importance', 25)
      .catch(() => [])
  ]);

  const activeKb = (kbEntries || []).filter(kb => kb.active !== false);
  const facts = selectKbFacts(activeKb, keywords);
  const relevantMemories = selectMemories(memories || [], keywords);

  // ── Lentille psychologique ──
  // On active la base psychologique quand la question touche l'humain
  // (relation, émotion, communication, corps, comportement...).
  const humanCentric = isHumanCentric(questionType, keywords);
  const psychFacts = humanCentric
    ? selectPsychologicalFacts(activeKb, keywords, 1)
    : [];

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. Récupérer le squelette de parole le plus pertinent
  // ═══════════════════════════════════════════════════════════════════════════
  let skeleton = null;
  let skeletonMeta = null;
  try {
    const skelRes = await base44.functions.invoke('speechPatternEngine', {
      action: 'retrieve',
      question,
      questionType,
      complexity,
      emotionalWeight,
      domains,
      dominantTension,
      consciousnessLevel,
      threshold: 0.4
    });
    const skelData = skelRes?.data || skelRes;
    if (skelData?.matched) {
      skeleton = skelData.metadata;
      skeletonMeta = {
        pattern_id: skelData.pattern_id,
        match_score: skelData.match_score
      };
    }
  } catch (e) {
    console.log('[MemorySpeechComposer] Skeleton retrieve failed:', e.message);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. Évaluer la confiance — a-t-on assez de matière pour répondre sans LLM ?
  // ═══════════════════════════════════════════════════════════════════════════
  const kbCoverage = facts.length > 0
    ? Math.min(1, facts.reduce((sum, f) => sum + relevanceScore(keywords, f.fact), 0) / facts.length)
    : 0;
  const memoryCoverage = relevantMemories.length > 0
    ? Math.min(1, relevantMemories.reduce((sum, m) => sum + relevanceScore(keywords, m.content), 0) / relevantMemories.length)
    : 0;
  const skeletonConfidence = skeletonMeta ? Math.min(1, skeletonMeta.match_score) : 0.2;

  // Confiance globale : pondérée. La KB est la source la plus fiable.
  let confidence = (kbCoverage * 0.5) + (memoryCoverage * 0.25) + (skeletonConfidence * 0.25);
  // Si on n'a ni fait ni mémoire pertinente, la confiance chute.
  if (facts.length === 0 && relevantMemories.length === 0) confidence = 0;
  // Bonus si on a un squelette ET du contenu.
  if (skeleton && (facts.length > 0 || relevantMemories.length > 0)) confidence += 0.1;
  confidence = Math.min(1, confidence);

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. Si la confiance est suffisante, composer la réponse sans LLM
  // ═══════════════════════════════════════════════════════════════════════════
  if (confidence >= minConfidence && (facts.length > 0 || relevantMemories.length > 0)) {
    let response = composeResponse(skeleton, facts, relevantMemories, question);

    // ── Enrichissement psychologique ──
    // On tisse un repère psychologique dans la réponse quand la lentille est active.
    if (psychFacts.length > 0) {
      const insight = String(psychFacts[0].fact).trim().replace(/\.$/, '');
      response = response.replace(/\.$/, '') + '. Sur le plan humain, ' +
        insight.charAt(0).toLowerCase() + insight.slice(1) + '.';
    }

    // Incrémenter l'usage des KB consultées (non-bloquant).
    facts.forEach(f => {
      if (f.kb_id) {
        base44.asServiceRole.entities.KnowledgeBase
          .update(f.kb_id, {
            access_count: 1, // incrémentation simplifiée
            last_accessed: new Date().toISOString()
          }).catch(() => null);
      }
    });
    psychFacts.forEach(f => {
      if (f.kb_id) {
        base44.asServiceRole.entities.KnowledgeBase
          .update(f.kb_id, {
            access_count: 1,
            last_accessed: new Date().toISOString()
          }).catch(() => null);
      }
    });

    return Response.json({
      composed: true,
      response,
      source: 'memory_kb_skeleton',
      confidence,
      needs_llm: false,
      metadata: {
        kb_facts_used: facts.length,
        memories_used: relevantMemories.length,
        psych_facts_used: psychFacts.length,
        skeleton: skeletonMeta,
        kb_coverage: Math.round(kbCoverage * 100),
        memory_coverage: Math.round(memoryCoverage * 100),
        sources: facts.map(f => f.source).filter(Boolean),
        psych_sources: psychFacts.map(f => f.source).filter(Boolean)
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 4b. Chemin squelette seul — quand le match est fort mais KB/mémoire vides
  // Le squelette contient une réponse-type ; on la restitue telle quelle.
  // C'est la voix de Druide forgée par ses interactions passées.
  // ═══════════════════════════════════════════════════════════════════════════
  if (skeletonMeta && skeletonMeta.match_score >= 0.6 && skeleton?.architecture) {
    // Récupérer la réponse-type du squelette via speechPatternEngine (déjà stockée).
    let skeletonResponse = null;
    try {
      const skelRes = await base44.functions.invoke('speechPatternEngine', {
        action: 'retrieve',
        question,
        questionType,
        complexity,
        emotionalWeight,
        domains,
        dominantTension,
        consciousnessLevel,
        threshold: 0.6
      });
      const skelData = skelRes?.data || skelRes;
      if (skelData?.matched && skelData?.response) {
        skeletonResponse = skelData.response;
      }
    } catch (_) { /* fallback silencieux */ }

    if (skeletonResponse) {
      // ── Enrichissement psychologique sur le chemin squelette seul ──
      let finalResponse = skeletonResponse;
      if (psychFacts.length > 0) {
        const insight = String(psychFacts[0].fact).trim().replace(/\.$/, '');
        finalResponse = skeletonResponse.replace(/\.$/, '') + '. Sur le plan humain, ' +
          insight.charAt(0).toLowerCase() + insight.slice(1) + '.';
        psychFacts.forEach(f => {
          if (f.kb_id) {
            base44.asServiceRole.entities.KnowledgeBase
              .update(f.kb_id, {
                access_count: 1,
                last_accessed: new Date().toISOString()
              }).catch(() => null);
          }
        });
      }
      return Response.json({
        composed: true,
        response: finalResponse,
        source: 'skeleton_only',
        confidence: skeletonMeta.match_score / 2, // confiance modérée (pas de KB)
        needs_llm: false,
        metadata: {
          kb_facts_used: 0,
          memories_used: 0,
          psych_facts_used: psychFacts.length,
          skeleton: skeletonMeta,
          kb_coverage: 0,
          memory_coverage: 0,
          sources: [],
          psych_sources: psychFacts.map(f => f.source).filter(Boolean)
        }
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. Confiance insuffisante — on signale que le LLM est nécessaire,
  //    mais on fournit quand même le contexte récupéré pour l'enrichir.
  // ═══════════════════════════════════════════════════════════════════════════
  return Response.json({
    composed: false,
    needs_llm: true,
    confidence,
    reason: confidence === 0 ? 'no_relevant_memory_or_kb' : 'low_confidence',
    context: {
      kb_facts: facts.map(f => ({ fact: f.fact, source: f.source })),
      memories: relevantMemories.map(m => ({
        content: m.content.slice(0, 200),
        type: m.type,
        importance: m.importance
      })),
      skeleton: skeletonMeta,
      signature,
      keywords
    }
  });
});