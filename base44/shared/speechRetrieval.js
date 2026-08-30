/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║ RÉCUPÉRATION LEXICALE — trouver la matière avant de parler            ║
 * ║ Mots-clés → pertinence → ancrage topical → faits KB et mémoires.      ║
 * ║ 100% local : aucun appel LLM, aucun crédit consommé.                  ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

import { normalizeForCmp } from './speechFormatter.js';

const STOP_WORDS = new Set([
  'le','la','les','un','une','des','de','du','et','ou','mais','que','qui','quoi',
  'comment','pourquoi','quand','où','est','sont','avec','sans','dans','pour','par',
  'sur','ce','cette','ces','mon','ma','mes','ton','ta','tes','son','sa','ses',
  'the','and','for','with','that','this','what','how','why','when','are','you',
  'your','qu','se','selon','au','fond','vraiment','peux','peut','veux','sais',
  'ans','viens','vient','trop','tard','aussi','tres','donc','car','pas','plus',
  'moins','autre','autres','meme','encore','deja','toujours','jamais','rien',
  'tout','tous','toute','toutes','bien','mal','etre','avoir','faire','dire',
  'voir','savoir','faut','doit','comme','apres','avant','ici',
  'ca','cela','dont','lequel','laquelle','aux'
]);

export function keywordsOf(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[?!.;,()'"`]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !STOP_WORDS.has(w))
    .slice(0, 20);
}

export function signatureOf(question) {
  return keywordsOf(question).slice(0, 12).join(' ');
}

/** Proportion de mots-clés présents dans un texte. */
export function relevanceScore(keywords, text) {
  if (!text || keywords.length === 0) return 0;
  const textLower = String(text).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const textWords = new Set(textLower.split(/[^a-z0-9]+/));
  let hits = 0;
  keywords.forEach((kw) => { if (textWords.has(kw)) hits++; });
  return hits / keywords.length;
}

/**
 * Les KB auto-synthétisées peuvent contenir des faits mal extraits au format
 * "Question... A: Réponse..." — du bruit qu'il faut refuser en entrée.
 */
export function isQAContent(text) {
  return /\s+[QA]\s*:/i.test(text) || /\bQuestion\s*:/i.test(text) || /\bR[ée]ponse\s*:/i.test(text);
}

/**
 * Mots-clés primaires : les plus longs sont les plus spécifiques du sujet.
 * Un fait sans mot-clé primaire est topicalement hors-sujet.
 */
export function primaryKeywordsOf(keywords) {
  if (keywords.length <= 2) return new Set(keywords);
  const sorted = [...keywords].sort((a, b) => b.length - a.length);
  return new Set(sorted.slice(0, Math.max(1, Math.ceil(sorted.length / 2))));
}

/**
 * Pertinence d'un fait, avec ancrage topical : le mot-clé primaire doit
 * apparaître dans la PREMIÈRE MOITIÉ du fait. Un fait qui n'évoque le sujet
 * qu'à la fin ne porte pas SUR le sujet — il le mentionne en passant.
 */
export function factRelevance(keywords, fact, primaryKw) {
  const factLower = String(fact).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const factWords = factLower.split(/[^a-z0-9]+/);
  const factWordSet = new Set(factWords);
  const halfLen = Math.max(1, Math.floor(factWords.length / 2));
  const firstHalfWords = new Set(factWords.slice(0, halfLen));
  let hits = 0, primaryHit = false, topicAnchored = false;
  keywords.forEach((kw) => {
    if (factWordSet.has(kw)) {
      hits++;
      if (primaryKw.has(kw)) {
        primaryHit = true;
        if (firstHalfWords.has(kw)) topicAnchored = true;
      }
    }
  });
  return { rel: hits / keywords.length, hits, primaryHit, topicAnchored };
}

function scoreKbEntries(kbEntries, keywords, minScore = 0) {
  return kbEntries
    .filter((kb) => kb.status === 'ready' || kb.status === undefined)
    .map((kb) => {
      const titleScore = relevanceScore(keywords, kb.title) * 2;
      const tagScore = (kb.tags || []).filter((t) => keywords.includes(t.toLowerCase())).length * 0.15;
      const factsScore = relevanceScore(keywords, (kb.extracted_facts || []).join(' ')) * 1.5;
      const contentScore = relevanceScore(keywords, kb.content) * 1;
      const summaryScore = relevanceScore(keywords, kb.summary) * 1.2;
      return { kb, score: titleScore + tagScore + factsScore + contentScore + summaryScore };
    })
    .filter((s) => s.score >= minScore && s.score > 0)
    .sort((a, b) => b.score - a.score);
}

const factsOf = (kb) => (kb.extracted_facts && kb.extracted_facts.length > 0)
  ? kb.extracted_facts
  : [kb.summary || String(kb.content || '').slice(0, 300)];

/** Sélection des meilleurs extraits de KB : diversité d'abord, densité ensuite. */
export function selectKbFacts(kbEntries, keywords, maxFacts = 6) {
  if (keywords.length === 0) return [];
  const primaryKw = primaryKeywordsOf(keywords);
  const scored = scoreKbEntries(kbEntries, keywords, 0.3);

  const facts = [];
  // Premier passage : 1 fait par fiche (diversité), ancrage topical exigé.
  for (const { kb } of scored.slice(0, 8)) {
    const best = factsOf(kb)
      .map((f) => ({ fact: f, ...factRelevance(keywords, f, primaryKw) }))
      .filter((x) => x.topicAnchored && x.hits >= 1 && !isQAContent(x.fact))
      .sort((a, b) => b.rel - a.rel)[0];
    if (best) facts.push({ fact: String(best.fact).trim(), source: kb.title, kb_id: kb.id });
    if (facts.length >= maxFacts) break;
  }

  // Second passage : une fiche déjà retenue est du bon sujet ; ses autres faits
  // sont acceptés dès qu'ils touchent un mot-clé primaire, sans exiger l'ancrage.
  if (facts.length < maxFacts) {
    for (const { kb } of scored.slice(0, 8)) {
      if (facts.length >= maxFacts) break;
      factsOf(kb)
        .map((f) => ({ fact: f, ...factRelevance(keywords, f, primaryKw) }))
        .filter((x) => (x.topicAnchored || x.primaryHit) && x.hits >= 1 && !isQAContent(x.fact))
        .sort((a, b) => b.rel - a.rel)
        .slice(1, 3)
        .forEach(({ fact, rel }) => {
          if (facts.length < maxFacts && rel >= 0.15) {
            facts.push({ fact: String(fact).trim(), source: kb.title, kb_id: kb.id });
          }
        });
    }
  }

  // Déduplication : plusieurs fiches auto-synthétisées peuvent porter le même fait.
  const seenFacts = new Set();
  const uniqueFacts = [];
  for (const f of facts) {
    const norm = normalizeForCmp(f.fact);
    if (!seenFacts.has(norm)) { seenFacts.add(norm); uniqueFacts.push(f); }
  }

  // Un fait seul donnerait une phrase isolée : on ajoute le résumé de la
  // meilleure fiche pour porter le contexte du raisonnement.
  if (uniqueFacts.length === 1) {
    const topKb = scored.find((s) => s.kb.id === uniqueFacts[0].kb_id)?.kb;
    const summary = String(topKb?.summary || '').trim();
    if (summary.length >= 30 && !isQAContent(summary)
        && normalizeForCmp(summary) !== normalizeForCmp(uniqueFacts[0].fact)) {
      uniqueFacts.push({ fact: summary, source: topKb.title, kb_id: topKb.id });
    }
  }
  return uniqueFacts.slice(0, maxFacts);
}

/** Mémoires pertinentes — mêmes exigences d'ancrage que les faits KB. */
export function selectMemories(memories, keywords, max = 3) {
  if (keywords.length === 0) return [];
  const primaryKw = primaryKeywordsOf(keywords);
  return memories
    .map((m) => {
      const content = String(m.content || '');
      const rel = factRelevance(keywords, content, primaryKw);
      const tagScore = (m.tags || []).filter((t) => keywords.includes(t.toLowerCase())).length * 0.2;
      const summaryScore = relevanceScore(keywords, m.embedding_summary) * 1;
      const importanceBoost = (m.importance || 5) / 10;
      return {
        memory: m,
        score: (rel.rel + tagScore + summaryScore) * (0.5 + importanceBoost * 0.5),
        anchored: rel.topicAnchored
      };
    })
    .filter((s) => s.score > 0 && s.anchored)
    .filter((s) => {
      const c = String(s.memory.content || '').trim();
      // Exclure les questions echoées, les fragments trop courts et le bruit Q&A.
      if (/\?$/.test(c) || c.length < 15) return false;
      if (isQAContent(c)) return false;
      return true;
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, max)
    .map((s) => s.memory);
}

// ── Lentille psychologique : questions centrées sur l'humain ──
const PSYCHOLOGY_TRIGGERS = new Set([
  'stress','emotion','sentir','ressent','conflit','relation','communiquer',
  'communication','corps','geste','posture','regard','voix','respiration',
  'politesse','respect','equipe','collaboration','feedback','empathie',
  'ecoute','confiance','motivation','peur','colere','triste','joie',
  'anxiete','bien','etre','mental','comportement','interaction','social',
  'humain','personnalite','attitude','ton','rythme','silence','mime',
  'micro','expression','distance','proxemique','ancrage','tension',
  'leadership','negocier','argumenter','vendre','client','decider',
  'apprendre','memoriser','percevoir','biais','attention','defendre',
  // Déclencheurs relationnels urbains
  'reseau','ville','urbain','quartier','voisin','collegue','travail',
  'demmenage','montreal','appartement','solitude','rupture','attache',
  'desespere','froideur','isolement','appartenance','communaute',
  'integration','rencontre','amitie','lien','usure','densite','recurrence'
]);

/** La lentille s'active dès qu'un déclencheur psychologique est présent. */
export function isHumanCentric(questionType, keywords) {
  return keywords.some((k) => PSYCHOLOGY_TRIGGERS.has(k));
}

/** Faits issus des fiches taguées "psychologie". */
export function selectPsychologicalFacts(kbEntries, keywords, maxFacts = 2) {
  const psychKb = (kbEntries || []).filter((kb) =>
    (kb.tags || []).some((t) => String(t).toLowerCase().includes('psychologie'))
  );
  if (psychKb.length === 0) return [];

  const scored = scoreKbEntries(psychKb, keywords);
  const facts = [];
  for (const { kb, score } of scored.slice(0, 3)) {
    const best = factsOf(kb)
      .map((f) => ({ fact: f, rel: relevanceScore(keywords, f) }))
      .sort((a, b) => b.rel - a.rel)[0];
    if (best && (best.rel > 0 || score > 1)) {
      facts.push({ fact: String(best.fact).trim(), source: kb.title, kb_id: kb.id });
    }
    if (facts.length >= maxFacts) break;
  }
  return facts.slice(0, maxFacts);
}