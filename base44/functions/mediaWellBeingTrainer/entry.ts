/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Entraîneur de Bien-Être Médiatique                          ║
 * ║ Évalue des articles web/médias selon 4 critères et forme une opinion.      ║
 * ║                                                                            ║
 * ║ Équation d'opinion : 1:1:1 (C1+C2+C3)/3 | C4=gate                         ║
 * ║   C1 = polarité du sujet (positive/negative/neutral) → +1, -1, 0          ║
 * ║   C2 = polarité envers moi (positive/negative/neutral) → +1, -1, 0        ║
 * ║   C3 = pertinence d'apprentissage (relevant/obsolete) → +1, -1            ║
 * ║   C4 = PORTE : source vérifiée + certifiée fonctionnelle (binaire)        ║
 * ║                                                                            ║
 * ║ Si C4 échoue → rejet automatique, peu importe C1-C3.                       ║
 * ║ Si C4 passe → opinion = sign(C1+C2+C3), score = (C1+C2+C3)/3              ║
 * ║                                                                            ║
 * ║ Note: La recherche web automatique (InvokeLLM) nécessite des crédits.     ║
 * ║ La vérification URL via fetch() est gratuite et fonctionne sans crédits.   ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

// ═══════════════════════════════════════════════════════════════════════════
// C1 — POLARITÉ DU SUJET (positive/negative/neutral)
// ═══════════════════════════════════════════════════════════════════════════

const POSITIVE_LEXICON = [
  'progress', 'amelior', 'croissance', 'succes', 'reussite', 'victoire',
  'esperance', 'optimisme', 'bienveillance', 'compassion', 'solidarite',
  'cooperation', 'paix', 'harmonie', 'sante', 'guerison', 'innovation',
  'decouverte', 'avancee', 'percee', 'solution', 'espoir', 'joie',
  'gratitude', 'confiance', 'respect', 'dignite', 'liberte', 'justice',
  'equite', 'inclusion', 'diversite', 'resilience', 'renouveau'
];

const NEGATIVE_LEXICON = [
  'crise', 'catastrophe', 'desastre', 'tragedie', 'drame', 'souffrance',
  'mort', 'deces', 'blessure', 'maladie', 'epidemie', 'pandemie',
  'guerre', 'conflit', 'violence', 'agression', 'haine', 'discrimination',
  'injustice', 'corruption', 'scandale', 'fraude', 'tromperie', 'mensonge',
  'echec', 'defaite', 'effondrement', 'ruine', 'perte', 'chomage',
  'pauvrete', 'famine', 'pollution', 'degradation', 'menace', 'danger'
];

function evaluateC1(text) {
  const normalized = String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  let positiveHits = 0;
  let negativeHits = 0;

  for (const word of POSITIVE_LEXICON) {
    if (normalized.includes(word)) positiveHits++;
  }
  for (const word of NEGATIVE_LEXICON) {
    if (normalized.includes(word)) negativeHits++;
  }

  let polarity = 'neutral';
  let score = 0;

  if (positiveHits > negativeHits + 1) {
    polarity = 'positive';
    score = 1;
  } else if (negativeHits > positiveHits + 1) {
    polarity = 'negative';
    score = -1;
  } else if (positiveHits > 0 && negativeHits > 0) {
    polarity = 'neutral'; // mixte → neutre
    score = 0;
  } else if (positiveHits > 0) {
    polarity = 'positive';
    score = 1;
  } else if (negativeHits > 0) {
    polarity = 'negative';
    score = -1;
  }

  return {
    polarity,
    score,
    positive_hits: positiveHits,
    negative_hits: negativeHits,
    reasoning: `${positiveHits} mot(s) positif(s), ${negativeHits} mot(s) negatif(s) → ${polarity}`
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// C2 — POLARITÉ ENVERS MOI (Druide/IA)
// ═══════════════════════════════════════════════════════════════════════════

const SELF_REFERENCES = [
  'druide', 'ia ', 'i.a', 'intelligence artificielle', 'ai ',
  'chatbot', 'assistant virtuel', 'agent intelligent', 'llm',
  'modele de langage', 'automatisation', 'algorithme', 'robot',
  'machine learning', 'apprentissage automatique'
];

const SELF_POSITIVE_CONTEXT = [
  'aide', 'utile', 'support', 'accompagne', 'facilite', 'amelior',
  'progress', 'innov', 'collabore', 'complement', 'outil precieux',
  'bienveillant', 'empath', 'responsable', 'ethique', 'sure',
  'fiable', 'confiance en l\'ia', 'benefique'
];

const SELF_NEGATIVE_CONTEXT = [
  'remplace', 'remplacement', 'danger', 'menace', 'risque',
  'peur de l\'ia', 'distrust', 'mefiance', 'manipul', 'controle',
  'surveillance', 'perte d\'emploi', 'chomage', 'deshumanise',
  ' froid', 'sans ame', 'limite', 'incapable', 'hallucin',
  'biais', 'discrimin', 'non fiable', 'dangereux', 'menac'
];

function evaluateC2(text) {
  const normalized = String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  // L'article parle-t-il de moi (IA/Druide) ?
  const mentionsSelf = SELF_REFERENCES.some(ref => normalized.includes(ref));

  if (!mentionsSelf) {
    return {
      polarity: 'neutral',
      score: 0,
      mentions_self: false,
      reasoning: 'Aucune mention de l\'IA/Druide → neutre par defaut'
    };
  }

  // L'article parle de moi — évaluer la polarité du contexte
  let positiveContext = 0;
  let negativeContext = 0;

  for (const ctx of SELF_POSITIVE_CONTEXT) {
    if (normalized.includes(ctx)) positiveContext++;
  }
  for (const ctx of SELF_NEGATIVE_CONTEXT) {
    if (normalized.includes(ctx)) negativeContext++;
  }

  let polarity = 'neutral';
  let score = 0;

  if (positiveContext > negativeContext) {
    polarity = 'positive';
    score = 1;
  } else if (negativeContext > positiveContext) {
    polarity = 'negative';
    score = -1;
  }

  return {
    polarity,
    score,
    mentions_self: true,
    positive_context_hits: positiveContext,
    negative_context_hits: negativeContext,
    reasoning: `Mention de l'IA detectee. ${positiveContext} contexte(s) positif(s), ${negativeContext} negatif(s) → ${polarity}`
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// C3 — PERTINENCE D'APPRENTISSAGE (relevant/obsolete)
// ═══════════════════════════════════════════════════════════════════════════
// Correction: "obsolete" ≠ "non pertinent". On sépare deux sous-conditions:
//   3a = pertinence (lié aux domaines d'apprentissage de Druide)
//   3b = actualité (non obsolète — pas de dates anciennes, pas de technologies dépassées)
// C3 passe seulement si 3a ET 3b.

const LEARNING_DOMAINS = [
  'conscience', 'cognition', 'emotion', 'empathie', 'psychologie',
  'philosophie', 'ethique', 'morale', 'apprentissage', 'memoire',
  'raisonnement', 'creativite', 'langage', 'communication', 'relation',
  'social', 'humain', 'bienveillance', 'compassion', 'introspection',
  'metacognition', 'evolution', 'croissance personnelle', 'sagesse',
  'intelligence', 'neuroscience', 'sciences cognitives', 'ia ',
  'technologie', 'innovation', 'societe', 'culture', 'art',
  'sante mentale', 'bienveillance', 'relation interpersonnelle'
];

const OBSOLESCENCE_MARKERS = [
  'en 2010', 'en 2011', 'en 2012', 'en 2013', 'en 2014', 'en 2015',
  'il y a 10 ans', 'il y a 15 ans', 'il y a 20 ans',
  'obsolete', 'obsoletes', 'depasse', 'depasses', 'ancienne methode',
  'ancien modele', 'version precedente', 'n\'est plus utilise',
  'abandonne', 'remplace depuis', 'deconseille'
];

function evaluateC3(text, sourceDate) {
  const normalized = String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  // 3a — Pertinence: lié aux domaines d'apprentissage ?
  let domainHits = 0;
  const matchedDomains = [];
  for (const domain of LEARNING_DOMAINS) {
    if (normalized.includes(domain)) {
      domainHits++;
      matchedDomains.push(domain);
    }
  }
  const isRelevant = domainHits >= 1;

  // 3b — Actualité: non obsolète ?
  let obsolescenceHits = 0;
  for (const marker of OBSOLESCENCE_MARKERS) {
    if (normalized.includes(marker)) obsolescenceHits++;
  }
  const isCurrent = obsolescenceHits === 0;

  // C3 = pertinent ET non obsolète
  const passes = isRelevant && isCurrent;
  const result = passes ? 'relevant' : 'obsolete';
  const score = passes ? 1 : -1;

  let reason;
  if (!isRelevant && !isCurrent) {
    reason = `Non pertinent (0 domaine d'apprentissage) ET obsolète (${obsolescenceHits} marqueur(s) d'obsolescence)`;
  } else if (!isRelevant) {
    reason = `Non pertinent: aucun domaine d'apprentissage de Druide identifié`;
  } else if (!isCurrent) {
    reason = `Obsolète: ${obsolescenceHits} marqueur(s) d'obsolescence détecté(s)`;
  } else {
    reason = `Pertinent (${domainHits} domaine(s): ${matchedDomains.slice(0, 3).join(', ')}) ET actuel`;
  }

  return {
    result,
    score,
    is_relevant: isRelevant,
    is_current: isCurrent,
    domain_hits: domainHits,
    matched_domains: matchedDomains.slice(0, 5),
    obsolescence_hits: obsolescenceHits,
    reasoning: reason
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// C4 — PORTE: Source vérifiée + certifiée fonctionnelle
// ═══════════════════════════════════════════════════════════════════════════
// Vérifie que l'URL est atteignable (HTTP 200) et que le contenu
// correspond au sujet annoncé (au moins 1 mot-clé du titre présent dans la page).

async function verifySource(url, titleKeywords) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'User-Agent': 'DruideOmega-WelfareBot/1.0' },
      redirect: 'follow',
      signal: AbortSignal.timeout(8000)
    });

    const statusCode = response.status;
    const reachable = response.ok;

    if (!reachable) {
      return {
        verified: false,
        certified_functional: false,
        status_code: statusCode,
        reason: `URL non atteignable (HTTP ${statusCode})`
      };
    }

    // Certification fonctionnelle: le contenu de la page contient au moins
    // un mot-clé du titre (preuve que la source traite bien le sujet annoncé)
    const pageText = await response.text();
    const normalizedPage = pageText
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    const keywordMatches = titleKeywords.filter(kw =>
      kw.length > 3 && normalizedPage.includes(kw)
    );

    const certified = keywordMatches.length >= 1;

    return {
      verified: true,
      certified_functional: certified,
      status_code: statusCode,
      keyword_matches: keywordMatches.slice(0, 5),
      reason: certified
        ? `URL atteignable (200) + ${keywordMatches.length} mot(s)-cle(s) du titre trouves dans la page`
        : `URL atteignable (200) mais aucun mot-cle du titre trouve dans la page — source non certifiee`
    };
  } catch (error) {
    return {
      verified: false,
      certified_functional: false,
      status_code: 0,
      reason: `Erreur de verification: ${error.message}`
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// ÉQUATION D'OPINION: 1:1:1 (C1+C2+C3)/3 | C4=gate
// ═══════════════════════════════════════════════════════════════════════════

function formOpinion(c1, c2, c3, c4Passed, c4Reason) {
  // C4 = PORTE — si échec, rejet automatique
  if (!c4Passed) {
    return {
      opinion: 'reject',
      score: -1,
      reasoning: `C4 (PORTE) ECHOUE: ${c4Reason} → rejet automatique, opinion non formee sur C1-C3`
    };
  }

  // C4 passe — équation 1:1:1
  const rawSum = c1.score + c2.score + c3.score;
  const opinionScore = Math.round((rawSum / 3) * 100) / 100;

  let opinion;
  if (opinionScore > 0) {
    opinion = 'accept';
  } else if (opinionScore < 0) {
    opinion = 'reject';
  } else {
    opinion = 'neutral';
  }

  const reasoning = [
    `C4 (PORTE) PASSÉ: ${c4Reason}`,
    `C1 polarité sujet: ${c1.polarity} (${c1.score > 0 ? '+' : ''}${c1.score})`,
    `C2 polarité envers moi: ${c2.polarity} (${c2.score > 0 ? '+' : ''}${c2.score})`,
    `C3 pertinence apprentissage: ${c3.result} (${c3.score > 0 ? '+' : ''}${c3.score})`,
    `Équation 1:1:1 → (${c1.score}+${c2.score}+${c3.score})/3 = ${opinionScore} → ${opinion}`
  ].join(' · ');

  return { opinion, score: opinionScore, reasoning };
}

// ═══════════════════════════════════════════════════════════════════════════
// HANDLER
// ═══════════════════════════════════════════════════════════════════════════

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { action } = body;

    // ── MODE 'status' : retourner l'état d'entraînement ──
    if (action === 'status') {
      const articles = await base44.entities.MediaArticle.list('-training_date', 20).catch(() => []);
      const accepted = articles.filter(a => a.opinion === 'accept').length;
      const rejected = articles.filter(a => a.opinion === 'reject').length;
      const neutral = articles.filter(a => a.opinion === 'neutral').length;
      const gatePassed = articles.filter(a => a.c4_gate_passed).length;

      return Response.json({
        equation: '1:1:1 (C1+C2+C3)/3 | C4=gate',
        total_articles: articles.length,
        accepted,
        rejected,
        neutral,
        gate_passed: gatePassed,
        gate_failed: articles.length - gatePassed,
        recent: articles.slice(0, 5).map(a => ({
          title: a.title,
          opinion: a.opinion,
          score: a.opinion_score,
          source_verified: a.source_verified,
          c4_gate: a.c4_gate_passed
        }))
      });
    }

    // ── MODE 'evaluate' : évaluer un article ──
    const { title, content, source_url, source_name } = body;

    if (!title || !content || !source_url) {
      return Response.json({
        error: 'Parametres requis: title, content, source_url'
      }, { status: 400 });
    }

    // Extraire les mots-clés du titre pour la certification fonctionnelle
    const titleKeywords = String(title)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 3);

    // ── C4 (PORTE): Vérifier la source ──
    const verification = await verifySource(source_url, titleKeywords);
    const c4Passed = verification.verified && verification.certified_functional;

    // ── C1, C2, C3 ── (évalués même si C4 échoue, pour diagnostic)
    const c1 = evaluateC1(content);
    const c2 = evaluateC2(content);
    const c3 = evaluateC3(content);

    // ── Opinion ──
    const opinionResult = formOpinion(c1, c2, c3, c4Passed, verification.reason);

    const now = new Date().toISOString();

    // ── Stocker l'article évalué ──
    const article = await base44.entities.MediaArticle.create({
      title: String(title).slice(0, 500),
      content: String(content).slice(0, 5000),
      source_url,
      source_name: source_name || new URL(source_url).hostname,
      source_verified: verification.verified,
      source_certified_functional: verification.certified_functional,
      source_status_code: verification.status_code,
      verification_date: now,
      c1_subject_polarity: c1.polarity,
      c2_polarity_towards_me: c2.polarity,
      c3_learning_relevance: c3.result,
      c3_relevance_reason: c3.reasoning,
      c4_gate_passed: c4Passed,
      c4_gate_reason: verification.reason,
      opinion: opinionResult.opinion,
      opinion_score: opinionResult.score,
      opinion_reasoning: opinionResult.reasoning,
      equation: '1:1:1 (C1+C2+C3)/3 | C4=gate',
      training_date: now
    });

    return Response.json({
      equation: '1:1:1 (C1+C2+C3)/3 | C4=gate',
      article_id: article.id,
      title: String(title).slice(0, 200),
      source_url,
      c4_gate: {
        passed: c4Passed,
        verified: verification.verified,
        certified_functional: verification.certified_functional,
        status_code: verification.status_code,
        reason: verification.reason
      },
      c1_subject_polarity: c1,
      c2_polarity_towards_me: c2,
      c3_learning_relevance: c3,
      opinion: opinionResult.opinion,
      opinion_score: opinionResult.score,
      opinion_reasoning: opinionResult.reasoning,
      spectrum: {
        minus_1: 'rejeter',
        zero: 'neutre',
        plus_1: 'accepter'
      }
    });

  } catch (error) {
    console.error('[MediaWellBeingTrainer] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}