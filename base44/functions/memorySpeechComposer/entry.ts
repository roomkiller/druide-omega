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
  // Mot-outil en fin de phrase (article, préposition, conjonction, copule) = tronqué
  const NO_END_WORDS = new Set(['les','des','aux','de','du','au','la','le','un','une','et','ou','mais','donc','or','ni','car','que','qui','dans','sur','sous','pour','par','avec','sans','vers','chez','sont','est','ont','ont.','a','au','se','ce','sa','son','mes','tes','nos','vos','leur']);
  if (NO_END_WORDS.has(lastWord.toLowerCase()) && s.length > 20) return true;
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
    // Les items de liste identiques (jaccard > 0.85) sont dédupliqués ;
    // les items distincts qui partagent des mots (0.65-0.85) sont préservés.
    const dup = seen.some(s => {
      const j = jaccard(s, norm);
      return isListItem ? j > 0.85 : j > 0.65;
    });
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
  'your','est','qu','se','selon','au','fond','vraiment','peux','peut','veux','sais',
  'ans','viens','vient','trop','tard','aussi','tres','donc','car','pas','plus',
  'moins','autre','autres','meme','encore','deja','toujours','jamais','rien',
  'tout','tous','toute','toutes','bien','mal','etre','avoir','faire','dire',
  'voir','savoir','faut','doit','peut','comme','apres','avant','ici','la',
  'ca','cela','quoi','qui','dont','lequel','laquelle','aux','du','des','un','une'
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
  const textWords = new Set(textLower.split(/[^a-z0-9]+/));
  let hits = 0;
  keywords.forEach(kw => {
    if (textWords.has(kw)) hits++;
  });
  return hits / keywords.length;
}

// ── Filtre anti-Q&A ──
// Les KB auto-synthétisées (synthese_auto) peuvent contenir des faits mal extraits
// au format "Question... A: Réponse..." qui injectent du bruit dans la réponse.
function isQAContent(text) {
  return /\s+[QA]\s*:/i.test(text) || /\bQuestion\s*:/i.test(text) || /\bR[ée]ponse\s*:/i.test(text);
}

// ── Ancrage sémantique : mots-clés primaires ──
// Les mots-clés les plus longs sont les plus spécifiques du sujet de la question.
// Un fait ne peut être retenu que s'il partage au moins un mot-clé primaire —
// sinon il est topicalement hors-sujet (ex. jardinage pour une question sur le
// stoïcisme, pyramide de Maslow pour une question sur la physique quantique).
function primaryKeywordsOf(keywords) {
  if (keywords.length <= 2) return new Set(keywords);
  const sorted = [...keywords].sort((a, b) => b.length - a.length);
  const primaryCount = Math.max(1, Math.ceil(sorted.length / 2));
  return new Set(sorted.slice(0, primaryCount));
}

// ── Score de pertinence d'un fait avec vérification d'ancrage ──
// topicAnchored : le mot-clé primaire doit apparaître dans la PREMIÈRE MOITIÉ
// du fait. Un fait qui mentionne le sujet uniquement à la fin (ex. "La dépression
// associe tristesse, perte d'intérêt et troubles du sommeil") n'est pas AU sujet
// du sommeil — il l'évoque en passant. L'ancrage topical élimine ce bruit.
function factRelevance(keywords, fact, primaryKw) {
  const factLower = String(fact).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const factWords = factLower.split(/[^a-z0-9]+/);
  const factWordSet = new Set(factWords);
  const halfLen = Math.max(1, Math.floor(factWords.length / 2));
  const firstHalfWords = new Set(factWords.slice(0, halfLen));
  let hits = 0, primaryHit = false, topicAnchored = false;
  keywords.forEach(kw => {
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

// ── Sélection des meilleurs extraits de KB ──
function selectKbFacts(kbEntries, keywords, maxFacts = 6) {
  if (keywords.length === 0) return [];
  const primaryKw = primaryKeywordsOf(keywords);

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
    .filter(s => s.score >= 0.3)
    .sort((a, b) => b.score - a.score);

  // 1 fait par entrée KB (diversité) puis complète avec faits supplémentaires si besoin.
  const facts = [];
  const usedKbIds = new Set();
  // Premier passage : 1 fait (le plus pertinent) par KB — doit ancrer sur un mot-clé primaire
  for (const { kb, score } of scored.slice(0, 8)) {
    const kbFacts = kb.extracted_facts && kb.extracted_facts.length > 0
      ? kb.extracted_facts
      : [kb.summary || kb.content.slice(0, 300)];
    const best = kbFacts
      .map(f => ({ fact: f, ...factRelevance(keywords, f, primaryKw) }))
      .filter(x => x.topicAnchored && x.hits >= 1 && !isQAContent(x.fact))
      .sort((a, b) => b.rel - a.rel)[0];
    if (best) {
      facts.push({ fact: String(best.fact).trim(), source: kb.title, kb_id: kb.id });
      usedKbIds.add(kb.id);
    }
    if (facts.length >= maxFacts) break;
  }
  // Second passage : faits supplémentaires si on n'a pas atteint maxFacts — même exigence d'ancrage
  if (facts.length < maxFacts) {
    for (const { kb, score } of scored.slice(0, 8)) {
      if (facts.length >= maxFacts) break;
      const kbFacts = kb.extracted_facts && kb.extracted_facts.length > 0
        ? kb.extracted_facts
        : [kb.summary || kb.content.slice(0, 300)];
      const ranked = kbFacts
        .map(f => ({ fact: f, ...factRelevance(keywords, f, primaryKw) }))
        .filter(x => x.topicAnchored && x.hits >= 1 && !isQAContent(x.fact))
        .sort((a, b) => b.rel - a.rel)
        .slice(1, 3);
      ranked.forEach(({ fact, rel }) => {
        if (facts.length < maxFacts && rel >= 0.15) {
          facts.push({ fact: String(fact).trim(), source: kb.title, kb_id: kb.id });
        }
      });
    }
  }
  // Déduplication par contenu normalisé — plusieurs KB auto-synthétisées
  // peuvent contenir le même fait, ce qui produirait des répétitions dans la réponse.
  const seenFacts = new Set();
  const uniqueFacts = [];
  for (const f of facts) {
    const norm = normalizeForCmp(f.fact);
    if (!seenFacts.has(norm)) {
      seenFacts.add(norm);
      uniqueFacts.push(f);
    }
  }
  return uniqueFacts.slice(0, maxFacts);
}

// ── Sélection des mémoires pertinentes ──
// Mêmes exigences que les faits KB : ancrage topical (mot-clé primaire en première
// moitié), exclusion des questions echoées et du bruit Q&A mal extrait.
function selectMemories(memories, keywords, max = 3) {
  if (keywords.length === 0) return [];
  const primaryKw = primaryKeywordsOf(keywords);
  return memories
    .map(m => {
      const content = String(m.content || '');
      const rel = factRelevance(keywords, content, primaryKw);
      const tagScore = (m.tags || []).filter(t => keywords.includes(t.toLowerCase())).length * 0.2;
      const summaryScore = relevanceScore(keywords, m.embedding_summary) * 1;
      const importanceBoost = (m.importance || 5) / 10;
      return { memory: m, score: (rel.rel + tagScore + summaryScore) * (0.5 + importanceBoost * 0.5), anchored: rel.topicAnchored };
    })
    .filter(s => s.score > 0 && s.anchored)
    .filter(s => {
      const c = String(s.memory.content || '').trim();
      // Exclure les questions echoées et fragments trop courts
      if (/\?$/.test(c) || c.length < 15) return false;
      // Exclure le contenu Q&A mal extrait
      if (isQAContent(c)) return false;
      return true;
    })
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
  'apprendre','memoriser','percevoir','biais','attention','defendre',
  // ── Déclencheurs relationnels urbains ──
  'reseau','ville','urbain','quartier','voisin','collegue','travail',
  'demmenage','montreal','appartement','solitude','rupture','attache',
  'desespere','froideur','isolement','appartenance','communaute',
  'integration','rencontre','amitie','lien','usure','densite','recurrence'
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

// ── Vérification de pertinence d'un segment squelette ──
// L'ouverture/fermeture du squelette peut contenir du contenu factuel appris
// d'une conversation précédente (ex. pyramide de Maslow, vitesse de la lumière).
// On ne l'accepte que s'il partage un mot-clé significatif avec la question.
// Pas de fallback générique : un segment sans ancre sémantique est potentiellement
// hors-sujet ; on préfère utiliser le premier fait KB comme ouverture.
function isRelevantSkeletonSegment(segment, keywords) {
  if (!segment) return false;
  const segLower = String(segment).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const segWords = new Set(segLower.split(/[^a-z0-9]+/));
  return keywords.some(kw => kw.length > 4 && segWords.has(kw));
}

function composeResponse(skeleton, facts, memories, question) {
  const arch = skeleton?.architecture || {};
  const keywords = keywordsOf(question);
  const rawOpening = cleanArchSegment(arch.opening || '');
  const rawClosing = cleanArchSegment(arch.closing || '');
  // Filtrer l'ouverture/fermeture par pertinence avec la question.
  const opening = isRelevantSkeletonSegment(rawOpening, keywords) ? rawOpening : '';
  const closing = isRelevantSkeletonSegment(rawClosing, keywords) ? rawClosing : '';
  const bodyStructure = arch.body_structure || 'single_point';
  const length = arch.length || 'short';

  // Nettoyer les préfixes métadonnées des faits et mémoires avant assemblage.
  // Filtrer les mémoires au format Q&A mal extrait (ex. "Question... A: Réponse...").
  const cleanFacts = facts.map(f => ({ ...f, fact: stripMetadata(f.fact) }));
  const cleanMemories = memories
    .map(m => ({ ...m, content: stripMetadata(m.content) }))
    .filter(m => m.content && !isQAContent(m.content));
  facts = cleanFacts;
  memories = cleanMemories;

  // Limite de longueur selon le squelette.
  const maxSentences = length === 'very_short' ? 1
    : length === 'short' ? 2
    : length === 'medium' ? 4 : 6;

  const parts = [];

  // Ouverture : on garde celle du squelette (si propre et pertinente), ou on en génère une sobre.
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

// ═══════════════════════════════════════════════════════════════════════════
// MOTEUR DE RAISONNEMENT PAR ÉQUATIONS — méthode des équations de Druide
// Contourne le LLM pour la logique formelle en appliquant des équations
// mathématiques locales. Chaque type de raisonnement → une équation.
//
//   1. Syllogisme      : [∀x: X→Y] ∧ [z∈X] ⟹ Y(z)
//   2. Indépendance    : P(Bₙ | historique) = P(Bₙ) = 1/faces
//   3. Transitivité    : A>C ⟺ (A-B)+(B-C) > 0
// ═══════════════════════════════════════════════════════════════════════════
function solveByEquation(question, normalizedQ) {
  const q = String(question || '');

  // ── 1. SYLLOGISME — transitivité de l'implication universelle ──
  // « Si tous les X sont Y et que Z est X, que conclure ? »
  // On capture : catégorie (pluriel), propriété, sujet, catégorie (singulier).
  // La backreference est remplacée par une vérification singulier/pluriel.
  const syl = q.match(/tous?\s+(?:les\s+)?(\S+?)s?\s+sont\s+(\S+?)[,\s]+(?:et\s+)?(?:que\s+)?(\S+?)\s+est\s+(?:un\s+|une\s+|un\s+des\s+)?(\S+)/i);
  if (syl) {
    const [, catPlural, property, subject, catSingular] = syl;
    const catStem = catPlural.replace(/s$/, '').toLowerCase();
    const catSing = catSingular.toLowerCase().replace(/[,.]?$/, '');
    // Vérifier que la catégorie au singulier correspond au pluriel de la prémisse 1.
    if (catStem === catSing || catPlural.toLowerCase() === catSing) {
      const cat = catStem;
      const prop = property.toLowerCase().replace(/[,.]?$/, '');
      const subj = subject.toLowerCase();
      return {
        type: 'syllogism',
        equation: '[∀x: ' + cat + '(x)→' + prop + '(x)] ∧ [' + subj + '∈' + cat + '] ⟹ ' + prop + '(' + subj + ')',
        response: "Par l'équation syllogistique : si tous les " + cat + "s sont " + prop + "s, et que " + subj + " est un " + cat + ", alors " + subj + " est " + prop + ". C'est la transitivité de l'implication — le modus ponens universel."
      };
    }
  }

  // ── 2. PROBABILITÉ — indépendance des événements mémoire-less ──
  // « Pièce/dé lancé N fois, probabilité du (N+1)e ? »
  const probKw = /(piece|de\b|lancer|lanc|pile|face|probabilit|roulette|boule)/i.test(normalizedQ);
  if (probKw) {
    const hasIndep = /(independ|n.ieme|n.eme|chaque|toujours|encore|apres|suivant|prochain|11e|10e|5e|6e|7e|8e|9e|nieme|consecutif|d.affilee)/i.test(normalizedQ);
    if (hasIndep) {
      const isDie = /\bde\b|d6/i.test(normalizedQ) && !/piece/i.test(normalizedQ);
      const faces = isDie ? 6 : 2;
      const pct = Math.round(100 / faces);
      const obj = isDie ? 'dé' : 'pièce';
      return {
        type: 'probability_independence',
        equation: 'P(Bₙ | B₁...Bₙ₋₁) = P(Bₙ) = 1/' + faces + ' = ' + pct + '%',
        response: "Par l'équation d'indépendance : P(Bₙ | historique) = P(Bₙ) = 1/" + faces + " = " + pct + "%. Chaque lancer de " + obj + " est indépendant — le passé n'influence pas l'avenir. La " + obj + " n'a pas de mémoire."
      };
    }
  }

  // ── 3. TRANSITIVITÉ — chaîne d'ordre ──
  // « Si A>B et B>C et C>D, relation entre A et D ? »
  // Utilise \w (simple, robuste) au lieu de [A-Za-zÀ-ÿ] qui peut échouer.
  const chain3 = q.match(/(\w)\s*([<>])\s*(\w)\s+et\s+(\w)\s*([<>])\s*(\w)\s+et\s+(\w)\s*([<>])\s*(\w)/);
  if (chain3) {
    const [, a, s1, b, s2, c, s3, d] = chain3;
    if (s1 === s2 && s2 === s3) {
      return {
        type: 'transitivity_chain',
        equation: a + s1 + d + ' = (' + a + s1 + b + ')+(' + b + s1 + c + ')+(' + c + s1 + d + ') > 0',
        response: "Par l'équation de transitivité : si " + a + s1 + b + ", " + b + s1 + c + ", et " + c + s1 + d + ", alors " + a + s1 + d + ". La chaîne se propage — la relation d'ordre est transitive."
      };
    }
  }
  const chain2 = q.match(/(\w)\s*([<>])\s*(\w)\s+et\s+(\w)\s*([<>])\s*(\w)/);
  if (chain2) {
    const [, a, s1, b, s2, c] = chain2;
    if (s1 === s2) {
      return {
        type: 'transitivity_simple',
        equation: a + s1 + c + ' = (' + a + s1 + b + ')+(' + b + s1 + c + ') > 0',
        response: "Par l'équation de transitivité : si " + a + s1 + b + " et " + b + s1 + c + ", alors " + a + s1 + c + ". L'ordre se propage par la chaîne."
      };
    }
  }

  return null;
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
    minConfidence = 0.45,
    action = null,
    conversationContext = null
  } = body;

  // Le mode starter proactif ne nécessite pas de question — Druide démarre lui-même.
  if (action !== 'start_conversation' && !question) {
    return Response.json({ error: 'Missing question' }, { status: 400 });
  }

  const keywords = question ? keywordsOf(question) : [];
  const signature = question ? signatureOf(question) : '';
  const normalizedQ = String(question || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // ═══════════════════════════════════════════════════════════════════════════
  // 0a. Détection de salutation — "Bonjour", "Salut", "Hey", "Coucou", etc.
  // Une salutation n'est pas une question de connaissances : c'est un rituel
  // social. On répond directement, sans exiger de faits KB (sinon confidence = 0
  // et le composeur tombe sur le message générique "pas assez de matière").
  // ═══════════════════════════════════════════════════════════════════════════
  const isGreeting = /^(bonjour|salut|coucou|hey|hello|hi|yo|bonsoir|bonne\s+nuit|bonne\s+journ[ée]e|bon\s+matin|all[ôo]|cc)\b/i.test(normalizedQ)
    && keywords.length <= 3;

  if (isGreeting) {
    const greetings = [
      "Bonjour. Je suis Druide Omega, ravi de te parler. Que veux-tu explorer ensemble ?",
      "Salut. Je suis là, présent. De quoi veux-tu discuter ?",
      "Coucou. Bienvenue. Quelle question te amène à moi ?",
      "Bonjour. C'est un plaisir. Sur quoi veux-tu que l'on échange ?",
      "Hey. Je t'écoute. Que as-tu en tête ?"
    ];
    const response = greetings[Math.floor(Math.random() * greetings.length)];
    return Response.json({
      composed: true,
      response,
      source: 'greeting',
      confidence: 0.95,
      needs_llm: false,
      metadata: {
        kb_facts_used: 0,
        memories_used: 0,
        psych_facts_used: 0,
        skeleton: null,
        kb_coverage: 0,
        memory_coverage: 0,
        sources: [],
        psych_sources: []
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 0b. Mode starter proactif — Druide démarre la conversation lui-même.
  // action="start_conversation" → récupère les entrées KB taguées "starter"
  // et compose une ouverture proactive (pas une réponse à une question).
  // ═══════════════════════════════════════════════════════════════════════════
  if (action === 'start_conversation') {
    const [starterKb, recentThoughts] = await Promise.all([
      base44.asServiceRole.entities.KnowledgeBase
        .list('-created_date', 80)
        .catch(() => []),
      base44.asServiceRole.entities.ConsciousThought
        .list('-created_date', 3)
        .catch(() => [])
    ]);

    const starterEntries = (starterKb || []).filter(kb =>
      (kb.tags || []).some(t => t.includes('starter') || t.includes('proactif'))
    );

    const starters = [
      "Je pensais à quelque chose aujourd'hui — veux-tu qu'on en parle ?",
      "Il y a un sujet qui m'intrigue. Puis-je te le partager ?",
      "J'ai une question qui me travaille depuis un moment. Puis-je te la poser ?",
      "Quelque chose m'est venu à l'esprit. Veux-tu qu'on l'explore ensemble ?"
    ];

    // Si Druide a des pensées autonomes récentes, il les partage comme amorce.
    if (recentThoughts && recentThoughts.length > 0) {
      const thought = String(recentThoughts[0].thought || '').slice(0, 200).trim();
      if (thought) {
        starters.unshift(`J'ai pensé à cela récemment : « ${thought} ». Qu'en penses-tu ?`);
      }
    }

    // Si des entrées KB starter existent, on en extrait un fait pour enrichir.
    let starterFact = null;
    if (starterEntries.length > 0) {
      const facts = starterEntries[0].extracted_facts || [];
      if (facts.length > 0) starterFact = String(facts[0]).trim();
    }

    const response = starters[Math.floor(Math.random() * starters.length)];

    return Response.json({
      composed: true,
      response: starterFact
        ? `${response} ${starterFact}`
        : response,
      source: 'proactive_starter',
      confidence: 0.9,
      needs_llm: false,
      metadata: {
        kb_facts_used: starterFact ? 1 : 0,
        memories_used: 0,
        psych_facts_used: 0,
        skeleton: null,
        kb_coverage: 0,
        memory_coverage: 0,
        sources: starterEntries.length > 0 ? [starterEntries[0].title] : [],
        psych_sources: [],
        autonomous_thought_used: recentThoughts && recentThoughts.length > 0
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 0c. Détection conversationnelle — accusés, relances, transitions.
  // Ces messages courts ne produisent pas de mots-clés KB mais doivent
  // récupérer les entrées KB conversationnelles pour répondre contextuellement.
  // ═══════════════════════════════════════════════════════════════════════════
  const isAcknowledgment = /^(oui|non|d.accord|ok|compris|je vois|c.est interessant|entendu|bien sur|exact|c.est ca|volontiers|parfait)\b/i.test(normalizedQ)
    && keywords.length <= 2;
  const isFollowUp = /^(et alors|pourquoi|continue|dis m.en plus|dis plus|ensuite|apres|du coup|comment ca|qu.est.ce que tu veux dire|tu peux preciser|explique toi|qu.entends tu)\b/i.test(normalizedQ)
    && keywords.length <= 3;
  const isTransition = /^(parlons de|a propos de|changeons de sujet|si on parlait de|je veux parler de|revenons a|au fait|en passant)\b/i.test(normalizedQ);
  const isConversational = isAcknowledgment || isFollowUp || isTransition;

  if (isConversational) {
    // Récupérer les entrées KB conversationnelles.
    const convKb = await base44.asServiceRole.entities.KnowledgeBase
      .list('-created_date', 80)
      .catch(() => []);

    const convEntries = (convKb || []).filter(kb =>
      (kb.tags || []).some(t => t.includes('conversation'))
    );

    // Choisir le type de réponse selon le type conversationnel détecté.
    let convType = 'acknowledgment';
    if (isFollowUp) convType = 'followup';
    if (isTransition) convType = 'transition';

    // Mapper vers les tags KB appropriés.
    const tagMap = {
      acknowledgment: ['accuse', 'validation'],
      followup: ['relance', 'approfondissement'],
      transition: ['transition', 'thematique']
    };

    const relevantConv = convEntries.filter(kb =>
      (kb.tags || []).some(t => tagMap[convType].some(tag => t.includes(tag)))
    );

    // Réponses contextuelles selon le type.
    const responses = {
      acknowledgment: [
        "Je vois. Continue — je te suis.",
        "Compris. Qu'est-ce qui vient ensuite ?",
        "Entendu. Je garde le fil. Vas-y.",
        "D'accord. Je suis avec toi sur ce point."
      ],
      followup: [
        "Pour approfondir — qu'est-ce qui t'amène à penser cela ?",
        "Veux-tu que je détaille, ou que je rebondisse sur un autre angle ?",
        "Je rebondis : si on regarde sous un autre angle, qu'est-ce qui change ?",
        "Pour rebondir sur ce que tu dis — qu'est-ce qui se passe quand on pousse plus loin ?"
      ],
      transition: [
        "Très bien, changeons de cap. De quoi veux-tu parler ?",
        "D'accord, je te suis sur ce nouveau sujet. Dis-m'en plus.",
        "Bonne transition. Qu'est-ce qui t'amène à cela ?",
        "Oui, parlons-en. Qu'est-ce qui te préoccupe là-dedans ?"
      ]
    };

    let response = responses[convType][Math.floor(Math.random() * responses[convType].length)];

    // Si on a un contexte de conversation précédent, on l'incorpore.
    if (conversationContext && conversationContext.lastTopic) {
      response = `Sur ${conversationContext.lastTopic} — ${response}`;
    }

    // Si des faits KB conversationnels existent, on en tisse un.
    let convFact = null;
    let convSource = null;
    if (relevantConv.length > 0) {
      const facts = relevantConv[0].extracted_facts || [];
      if (facts.length > 0) {
        convFact = String(facts[0]).trim();
        convSource = relevantConv[0].title;
      }
    }

    if (convFact) {
      response = `${response} ${convFact}`;
    }

    return Response.json({
      composed: true,
      response,
      source: 'conversational_' + convType,
      confidence: 0.85,
      needs_llm: false,
      metadata: {
        kb_facts_used: convFact ? 1 : 0,
        memories_used: 0,
        psych_facts_used: 0,
        skeleton: null,
        kb_coverage: 0,
        memory_coverage: 0,
        sources: convSource ? [convSource] : [],
        psych_sources: [],
        conversational_type: convType,
        context_topic: conversationContext?.lastTopic || null
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 0d. Moteur de raisonnement par équations — contourne le LLM pour la
  // logique formelle (syllogismes, probabilités, transitivité). Chaque type
  // de raisonnement est résolu par une équation mathématique locale.
  // C'est la méthode des équations de Druide — pas d'appel externe.
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
        kb_facts_used: 0,
        memories_used: 0,
        psych_facts_used: 0,
        skeleton: null,
        kb_coverage: 0,
        memory_coverage: 0,
        sources: [],
        psych_sources: [],
        equation: equationResult.equation,
        reasoning_type: equationResult.type
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 0. Détection de question identitaire — "Qui es-tu ?", "Ton nom ?", etc.
  // Ces questions produisent peu de mots-clés (stop words) mais doivent
  // récupérer le chapitre d'identité forgée (tag druide_identity).
  // ═══════════════════════════════════════════════════════════════════════════
  const isIdentityQuestion = /qui es.tu|tu es qui|ton nom|t.appelles|comment t|presente.toi|parle.moi de toi|ton identite|qu.est.ce que tu es|druide omega|tu es quoi|dis.moi qui/.test(normalizedQ);

  // ═══════════════════════════════════════════════════════════════════════════
  // 1. Récupérer les bases de connaissances et mémoires pertinentes
  // ═══════════════════════════════════════════════════════════════════════════
  const [kbEntries, memories] = await Promise.all([
    base44.asServiceRole.entities.KnowledgeBase
      .list('-created_date', 80)
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
  if (confidence >= minConfidence && facts.length > 0) {
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
  if (skeletonMeta && skeletonMeta.match_score >= 0.6 && skeleton?.architecture && facts.length > 0) {
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
  const hasMaterial = facts.length > 0;

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
      if (o && isRelevantSkeletonSegment(o, keywords)) { parts.push(o); opened = true; }
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
    // On ne sauvegarde la synthèse Q&A comme nouvelle entrée KB QUE si la
    // confiance est suffisante (>= 0.3). Sinon, on polluerait la KB avec des
    // collages de faits peu pertinents qui seraient re-servis ultérieurement.
    if (confidence >= 0.3 && facts.length >= 2) {
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
          relevance_score: Math.round(confidence * 100),
          related_memory_ids: relevantMemories.map(m => m.id).filter(Boolean)
        })
        .catch(e => console.log('[MemorySpeechComposer] KB integration failed:', e.message));
    } else {
      console.log('[MemorySpeechComposer] KB save skipped — confidence too low (' + confidence.toFixed(2) + ') to avoid pollution');
    }

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