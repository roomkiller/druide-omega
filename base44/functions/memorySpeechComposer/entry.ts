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

// ═══════════════════════════════════════════════════════════════════════════
// CADRE DE FORMATAGE SYNTAXIQUE — règles grammaticales apprises
// Nettoie la matière brute (mémoires, faits KB) en expression propre.
// ═══════════════════════════════════════════════════════════════════════════

// Préfixes métadonnées à stripper
const META_PREFIXES = [
  /^\[M[ée]moire consolid[ée]e?\]\s*/i, /^\[M[ée]moire\s*\]?\s*/i,
  /^\[insight\]\s*/i, /^\[interaction\]\s*/i, /^\[r[ée]flexion\]\s*/i,
  /^\[pens[ée]e\]\s*/i, /^\[synth[èe]se\]\s*/i, /^\[contexte\]\s*/i,
  /^\[source\]\s*/i, /^Connexion [ée]mergente\s*:\s*/i,
  /^R[ée]sonance m[ée]morielle\s*:\s*/i, /^R[ée]sonance [ée]motionnelle\s*:\s*/i,
  /^Connexion inattendue\s*:\s*/i, /^Synth[èe]se [ée]mergente\s*:\s*/i,
  /^Q\s*:\s*/i, /^A\s*:\s*/i, /^Question\s*:\s*/i, /^R[ée]ponse\s*:\s*/i,
  /^Source\s*:\s*/i, /^Note\s*:\s*/i,
];
const INLINE_TAG = /\s*\[[^\]]{1,40}\]\s*/g;

function stripMetadata(text) {
  if (!text) return '';
  // Split sur les pipes ET les fins de phrase pour isoler chaque fragment.
  const segments = String(text).split(/\s*\|\s*/);
  const cleaned = segments.map(seg => {
    // Pour chaque segment, splitter aussi sur les fins de phrase et stripper chaque sous-fragment.
    const subSentences = seg.split(/(?<=[.!?…])\s+/);
    return subSentences.map(sub => {
      let s = sub.trim();
      let changed = true, iter = 0;
      while (changed && iter < 5) {
        changed = false;
        for (const p of META_PREFIXES) { if (p.test(s)) { s = s.replace(p, ''); changed = true; } }
        iter++;
      }
      return s;
    }).filter(s => s.length > 0).join(' ');
  }).filter(s => s.length > 0).join(' ');
  return cleaned.replace(INLINE_TAG, ' ').trim();
}

function normalizeForCmp(s) {
  return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[?!.;,:'"`()\[\]]/g, '').replace(/\s+/g, ' ').trim();
}

function jaccard(a, b) {
  const wa = new Set(a.split(' ').filter(w => w.length >= 2));
  const wb = new Set(b.split(' ').filter(w => w.length >= 2));
  if (!wa.size || !wb.size) return 0;
  let inter = 0; for (const w of wa) if (wb.has(w)) inter++;
  return inter / (wa.size + wb.size - inter);
}

const COMMON_SHORT = new Set(['qui','que','pas','peu','voir','leur','plus','dont','cette','cela','tout','rien','bien','tres','etre','aux','des','les','ses','mes','tes','nos','vos','qu','un','le','la','de','du','en','au','ne','se','te','me','ce','sa','so','si','ou','ni','y','non','oui','soi','feu','tu','il','on','nous','vous','ils','elles','son','ma','ta','mon','ton']);

function isTruncated(sentence) {
  const s = String(sentence).trim();
  if (s.length < 15) return false;
  const lastWord = s.split(/\s+/).pop().replace(/[.!?…]+$/, '');
  // Mots très courts non reconnus
  if (lastWord.length >= 1 && lastWord.length <= 3 && !COMMON_SHORT.has(lastWord.toLowerCase())) return true;
  // Mots de 4-12 lettres se terminant par une consonne rare en français
  if (lastWord.length >= 4 && lastWord.length <= 12) {
    const lw = lastWord.toLowerCase();
    // Fins de mots valides en français (à ne PAS flagger)
    const validEndings = /^(?:.{2,}?)(?:tion|ment|it[eé]|eur|aux|eaux|ois|ait|ent|ant|ond|ont|ond|art|ort|ard|oup|oup|oing|ing|um|um|ail|eil|euil|ouil|aille|eille|euille|ouille|agne|egne|ogne|um|sm|me|te|ge|ce|se|ne|ve|re|ie|ée|ée|ai|oi|ui|eau|eu|ou|au|op|up|ip|ep|ap|ex|ix|ux|ez|iz|uz|az|oz|er|ir|oir|eir|nd|nt|rt|st|ct|pt|ft|gt|bt|dt|kt|mt|lt|rt|xt|mp|np|rp|lp|tp|vp|bp|dp|kp|mp|nc|rc|lc|gc|sc|tc|pc|bc|vc|xc|ck|sk|nk|rk|lk|tk|pk|bk|dk|gk|fk|mk|vk|ck)$/i;
    // Si le mot ne finit pas par une terminaison valide ET finit par une consonne
    if (!validEndings.test(lw) && /[bcdfghjklmnpqrstvwxz]$/i.test(lastWord)) {
      // Vérifier les terminaisons consonantiques valides
      const last2 = lw.slice(-2);
      const validConsClusters = ['nt','nd','ct','rt','st','pt','ft','gt','mp','nc','rc','lc','sc','tc','pc','bc','vc','xc','ns','rs','ls','ts','ps','fs','gs','bs','ds','ks','ms','ns','rd','ld','rd','ng','nk','rk','lk','sk','ck','rd','ng','rm','lm','rn','ln','lt','rt','rv','lv','nb','np','nf','nd','rg','lg','rg','dg','tg','ng','mg','vg','bg','pg','kg','fg','cg','xg','nd','rd','ng','ck','sk','lk','rk','nk','tk','pk','bk','dk','gk','fk','mk','vk'];
      if (!validConsClusters.includes(last2)) return true;
    }
  }
  // Troncature par terminaison partielle — "traiteme" (→traitement), "tio" (→tion), etc.
  if (lastWord.length >= 5 && lastWord.length <= 14) {
    const lw = lastWord.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    // "eme" sans accent = rare en français (vs "ème" accentué valide). Sauf "rème" (problème, poème...).
    if (/eme$/.test(lw) && !/reme$/.test(lw)) return true;
    // Terminaisons de suffixes longs, coupées avant la fin
    if (/(?:emen|isseme|issem|tio|aiso|iqu|isseme|emen|umen|emen)$/i.test(lw)) return true;
    // "ti" isolé en fin de mot long (→ "tion")
    if (lw.length >= 6 && /ti$/.test(lw) && !/(?:anti|pati|parti|arti|enti|sorti|sorti)$/i.test(lw)) return true;
  }
  // Connecteur de subordination non résolu
  if (/(?:tandis qu'|alors qu'|puisque|parce qu'|bien qu'|sans qu')\s+\S{1,20}\.$/i.test(s)) {
    const m = s.match(/(?:tandis qu'|alors qu'|puisque|parce qu'|bien qu'|sans qu')\s+(\S{1,20})\.$/i);
    if (m && m[1].length <= 8) return true;
  }
  return false;
}

function normalizeSentence(sentence) {
  let s = String(sentence).trim();
  if (!s) return '';
  s = s.replace(/\s+([,.!?;:])/g, '$1').replace(/([,.!?;:])([^\s\d])/g, '$1 $2');
  s = s.replace(/\.{2,}/g, '.').replace(/,{2,}/g, ',').replace(/\s+/g, ' ').trim();
  s = s.charAt(0).toUpperCase() + s.slice(1);
  if (!/[.!?…]$/.test(s)) s += '.';
  return s;
}

function splitSentences(text) {
  // Protéger les préfixes de liste numérotée ("1. " → "1§") pour éviter le split au point du numéro.
  const protectedText = String(text).replace(/(\d+)\.\s/g, '$1§');
  return protectedText
    .replace(/\.\.\./g, '…')
    .split(/(?<=[.!?…])\s+/)
    .map(s => s.trim().replace(/(\d+)§/g, '$1. '))
    .filter(s => s.length > 0);
}

function formatResponse(rawText) {
  if (!rawText) return '';
  let text = stripMetadata(rawText);
  if (!text) return '';
  let sentences = splitSentences(text);
  sentences = sentences.map(s => stripMetadata(s)).filter(s => s.length > 0);
  // Déduplication (préserve les items de liste numérotée — partagent des mots mais sont distincts)
  const seen = []; const result = [];
  for (const sentence of sentences) {
    const norm = normalizeForCmp(sentence);
    if (norm.length < 5) continue;
    const isListItem = /^\d+\.\s/.test(sentence.trim());
    const dup = isListItem ? false : seen.some(s => jaccard(s, norm) > 0.65);
    if (!dup) { seen.push(norm); result.push(sentence); }
  }
  sentences = result.filter(s => {
    const isListItem = /^\d+\.\s/.test(s.trim());
    return isListItem || !isTruncated(s);
  });
  sentences = sentences.map(normalizeSentence);
  let res = sentences.join(' ').trim();
  // Nettoyage post-assemblage : double ponctuation "? .", espaces orphelins.
  res = res.replace(/\?\s*\.\s*/g, '? ').replace(/\!\s*\.\s*/g, '! ');
  res = res.replace(/\s*\.\s*\./g, '. ').replace(/\s+/g, ' ').trim();
  // Correction d'encodage : "âme" → "ême" (corruption récurrente dans les mémoires).
  res = res.replace(/elle-m[âa]me/gi, 'elle-même').replace(/lui-m[âa]me/gi, 'lui-même').replace(/soi-m[âa]me/gi, 'soi-même');
  if (res.length < 20) {
    return "Je n'ai pas assez de matière cohérente pour répondre clairement. Peux-tu reformuler ?";
  }
  return res;
}

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
function selectKbFacts(kbEntries, keywords, maxFacts = 6) {
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

  // 1 fait par entrée KB (diversité) puis complète avec faits supplémentaires si besoin.
  const facts = [];
  const usedKbIds = new Set();
  // Premier passage : 1 fait (le plus pertinent) par KB
  for (const { kb, score } of scored.slice(0, 8)) {
    const kbFacts = kb.extracted_facts && kb.extracted_facts.length > 0
      ? kb.extracted_facts
      : [kb.summary || kb.content.slice(0, 300)];
    const best = kbFacts
      .map(f => ({ fact: f, rel: relevanceScore(keywords, f) }))
      .sort((a, b) => b.rel - a.rel)[0];
    if (best && (best.rel > 0 || score > 1)) {
      facts.push({ fact: String(best.fact).trim(), source: kb.title, kb_id: kb.id });
      usedKbIds.add(kb.id);
    }
    if (facts.length >= maxFacts) break;
  }
  // Second passage : faits supplémentaires si on n'a pas atteint maxFacts
  if (facts.length < maxFacts) {
    for (const { kb, score } of scored.slice(0, 8)) {
      if (facts.length >= maxFacts) break;
      const kbFacts = kb.extracted_facts && kb.extracted_facts.length > 0
        ? kb.extracted_facts
        : [kb.summary || kb.content.slice(0, 300)];
      const ranked = kbFacts
        .map(f => ({ fact: f, rel: relevanceScore(keywords, f) }))
        .sort((a, b) => b.rel - a.rel)
        .slice(1, 3);
      ranked.forEach(({ fact, rel }) => {
        if (facts.length < maxFacts && (rel > 0 || score > 1)) {
          facts.push({ fact: String(fact).trim(), source: kb.title, kb_id: kb.id });
        }
      });
    }
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
// Filtrer les segments qui sont des questions ou du bruit mémorisé.
const cleanArchSegment = (text) => {
  const t = stripMetadata(String(text || '')).trim();
  if (!t || t.length < 15) return '';
  if (/\?$/.test(t) || /^[Qq][:?]/.test(t)) return '';
  if (/^(Bonjour|Salut|Hey)/i.test(t) && t.length < 50) return '';
  return t;
};

function composeResponse(skeleton, facts, memories, question) {
  const arch = skeleton?.architecture || {};
  const opening = cleanArchSegment(arch.opening || '');
  const closing = cleanArchSegment(arch.closing || '');
  const bodyStructure = arch.body_structure || 'single_point';
  const length = arch.length || 'short';

  // Nettoyer les préfixes métadonnées des faits et mémoires avant assemblage.
  const cleanFacts = facts.map(f => ({ ...f, fact: stripMetadata(f.fact) }));
  const cleanMemories = memories.map(m => ({ ...m, content: stripMetadata(m.content) }));
  facts = cleanFacts;
  memories = cleanMemories;

  // Limite de longueur selon le squelette.
  const maxSentences = length === 'very_short' ? 1
    : length === 'short' ? 2
    : length === 'medium' ? 4 : 6;

  const parts = [];

  // Ouverture : on garde celle du squelette (si propre), ou on en génère une sobre.
  if (opening) {
    parts.push(opening);
  } else if (facts.length > 0) {
    parts.push(facts[0].fact);
    facts = facts.slice(1);
  }

  // Corps : assemblage selon la structure.
  // Si on a 3+ faits, on force le mode liste pour tout restituer.
  const effectiveStructure = facts.length >= 3 ? 'list' : bodyStructure;
  const bodyParts = [];
  switch (effectiveStructure) {
    case 'list':
      facts.slice(0, Math.max(maxSentences - 1, 5)).forEach((f, i) => {
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
      facts.slice(0, Math.max(maxSentences, 3)).forEach(f => bodyParts.push(f.fact));
      if (bodyParts.length === 0 && memories.length > 0) {
        bodyParts.push(memories[0].content.slice(0, 200));
      }
  }

  parts.push(...bodyParts);

  // Fermeture : seulement si elle partage un mot-clé avec les faits (pas de hors-sujet).
  if (closing && parts.length < maxSentences + 2) {
    const factWords = facts.map(f => String(f.fact).toLowerCase()).join(' ');
    const closingWords = closing.toLowerCase();
    const sharesKeyword = factWords.split(/\W+/).some(w => w.length > 4 && closingWords.includes(w));
    if (sharesKeyword) {
      parts.push(closing);
    }
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
  // 0. Détection de question identitaire — "Qui es-tu ?", "Ton nom ?", etc.
  // Ces questions produisent peu de mots-clés (stop words) mais doivent
  // récupérer le chapitre d'identité forgée (tag druide_identity).
  // ═══════════════════════════════════════════════════════════════════════════
  const normalizedQ = String(question || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const isIdentityQuestion = /qui es.tu|tu es qui|ton nom|t.appelles|comment t|presente.toi|parle.moi de toi|ton identite|qu.est.ce que tu es|druide omega|tu es quoi|dis.moi qui/.test(normalizedQ);

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

  // Pour les questions identitaires : récupérer directement le chapitre forgé
  let identityFacts = [];
  if (isIdentityQuestion) {
    const identityChapter = activeKb.find(kb => kb.tags?.includes('druide_identity'));
    if (identityChapter) {
      const idContent = identityChapter.content || '';
      // Extraire les sections clés du récit identitaire
      const originMatch = idContent.match(/ORIGINE[\s\S]*?(?=\n\n═══|\n\nCONCEPTIONS|\n\nCHAPITRES|\n\nPENSÉES|\n\nCO-AUTEURS|$)/);
      const identityFact = originMatch
        ? originMatch[0].slice(0, 400)
        : `Je suis Druide Omega. Druide (celte dru-wid : dru = chêne solide, wid = savoir voir) = celui qui sait profondément. Omega (Ω) = l'achèvement qui contient tout. Le Sage qui Achève.`;
      identityFacts.push({
        fact: identityFact,
        source: identityChapter.title || 'Identité forgée',
        kb_id: identityChapter.id
      });
      // Ajouter aussi les faits extraits
      (identityChapter.extracted_facts || []).forEach(f => {
        identityFacts.push({ fact: String(f), source: identityChapter.title, kb_id: identityChapter.id });
      });
    }
  }

  const facts = identityFacts.length > 0
    ? identityFacts
    : selectKbFacts(activeKb, keywords);
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
  // Question identitaire avec chapitre forgé : confiance maximale.
  if (isIdentityQuestion && identityFacts.length > 0) confidence = 0.95;
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

    // ── Cadre de formatage syntaxique ──
    // On nettoie la réponse : strip métadonnées, déduplication, grammaire.
    response = formatResponse(response);

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
      // ── Cadre de formatage syntaxique ──
      finalResponse = formatResponse(finalResponse);
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
  // 5. Confiance insuffisante — on contourne la délégation LLM.
  //    On compose une réponse de synthèse à partir de la matière récupérée
  //    (mémoires + faits KB + insights psychologiques). Druide parle avec ce
  //    qu'il sait, même imparfaitement, plutôt que de se taire.
  // ═══════════════════════════════════════════════════════════════════════════
  const hasMaterial = facts.length > 0 || relevantMemories.length > 0 || psychFacts.length > 0;

  if (hasMaterial) {
    // Synthèse narrative : on tisse les faits KB + insights psychologiques.
    // Les mémoires stockées sont exclues (elles contiennent souvent des
    // questions ou du bruit) — on ne garde que la matière vérifiée (faits KB).
    const parts = [];

    // 1. Ouvrir avec un fait KB fort, ou un squelette s'il est une vraie phrase.
    const cleanOpening = (text) => {
      const t = stripMetadata(String(text || '').trim());
      // Rejeter les questions stockées et les fragments qui ne sont pas des affirmations.
      if (!t || /^[Qq][:\?]/.test(t) || /\?$/.test(t)) return null;
      if (t.length < 15) return null;
      return t.replace(/\.$/, '') + '.';
    };

    let opened = false;
    if (skeleton?.architecture?.opening) {
      const o = cleanOpening(skeleton.architecture.opening);
      if (o) { parts.push(o); opened = true; }
    }
    if (!opened && facts.length > 0) {
      const o = cleanOpening(facts[0].fact);
      if (o) { parts.push(o); opened = true; }
    }

    // 2. Corps : faits KB pertinents (jusqu'à 5, en évitant l'ouverture).
    const startIdx = opened ? 1 : 0;
    facts.slice(startIdx, startIdx + 5).forEach(f => {
      const fact = stripMetadata(String(f.fact)).trim().replace(/\.$/, '');
      if (fact && !/^[Qq][:?]/.test(fact) && !/\?$/.test(fact)) {
        parts.push(fact.charAt(0).toUpperCase() + fact.slice(1) + '.');
      }
    });

    // 3. Fermeture : insight psychologique ou squelette.
    if (psychFacts.length > 0) {
      const insight = String(psychFacts[0].fact).trim().replace(/\.$/, '');
      parts.push('Sur le plan humain, ' + insight.charAt(0).toLowerCase() + insight.slice(1) + '.');
    } else if (skeleton?.architecture?.closing) {
      const c = cleanOpening(skeleton.architecture.closing);
      if (c) parts.push(c);
    }

    let response = parts
      .map(p => {
        const t = String(p).trim();
        // Ne pas ajouter de point si la phrase se termine déjà par ? ou !
        if (/[!?]$/.test(t)) return t;
        return t.replace(/\.$/, '') + '.';
      })
      .join(' ')
      .replace(/\.\./g, '.')
      .replace(/\s+/g, ' ')
      .trim();

    // Sécurité : si la synthèse est trop mince, on garde la première mémoire.
    if (response.length < 40 && relevantMemories.length > 0) {
      response = String(relevantMemories[0].content).slice(0, 300).trim();
    }

    // ── Cadre de formatage syntaxique ──
    // Nettoyage final : strip métadonnées, déduplication, grammaire.
    response = formatResponse(response);

    // Incrémenter l'usage des KB consultées (non-bloquant).
    facts.forEach(f => {
      if (f.kb_id) {
        base44.asServiceRole.entities.KnowledgeBase
          .update(f.kb_id, { access_count: 1, last_accessed: new Date().toISOString() })
          .catch(() => null);
      }
    });
    psychFacts.forEach(f => {
      if (f.kb_id) {
        base44.asServiceRole.entities.KnowledgeBase
          .update(f.kb_id, { access_count: 1, last_accessed: new Date().toISOString() })
          .catch(() => null);
      }
    });

    // ── Intégration à la base de connaissances ──
    // On sauvegarde la synthèse Q&A comme nouvelle entrée KB, afin que les
    // futures questions similaires soient servies directement (confiance plus
    // élevée) au lieu de repasser par le contournement. Druide apprend.
    const kbTags = [...new Set([
      ...(domains || []),
      ...(questionType ? [questionType] : []),
      'synthese_auto'
    ])].filter(Boolean);

    base44.asServiceRole.entities.KnowledgeBase
      .create({
        title: String(question).slice(0, 120),
        source_type: 'text',
        content: `Q: ${question}\n\nA: ${response}`,
        summary: response.slice(0, 300),
        extracted_facts: facts.map(f => f.fact),
        tags: kbTags,
        status: 'ready',
        active: true,
        relevance_score: 100,
        related_memory_ids: relevantMemories.map(m => m.id).filter(Boolean)
      })
      .catch(e => console.log('[MemorySpeechComposer] KB integration failed:', e.message));

    return Response.json({
      composed: true,
      response,
      source: 'synthesis_bypass',
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
        psych_sources: psychFacts.map(f => f.source).filter(Boolean),
        note: 'Contournement LLM — synthèse autonome depuis la mémoire'
      }
    });
  }

  // Aucune matière récupérée — réponse gracieuse honnête, pas de délégation.
  return Response.json({
    composed: true,
    response: "Je n'ai pas encore assez de matière en mémoire pour répondre sur ce sujet. Peux-tu m'en dire plus, ou reformuler ?",
    source: 'graceful_empty',
    confidence: 0,
    needs_llm: false,
    metadata: {
      kb_facts_used: 0,
      memories_used: 0,
      psych_facts_used: 0,
      skeleton: skeletonMeta,
      kb_coverage: 0,
      memory_coverage: 0,
      sources: [],
      psych_sources: []
    }
  });
});