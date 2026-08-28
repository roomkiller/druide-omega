/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Module de Bien-Être                                        ║
 * ║ Régule ce que Druide garde ou rejette comme information reçue.             ║
 * ║                                                                            ║
 * ║ Équation régulatrice : -100:100% (0) +100:100%                            ║
 * ║   -100 = pôle de rejet absolu                                              ║
 * ║   +100 = pôle d'acceptation absolu                                        ║
 * ║   (0)  = point de vide neutre — le pivot où rien n'est tranché             ║
 * ║   50%  = seuil de décision à mi-spectre (±50 par défaut, modulé par WB)   ║
 * ║                                                                            ║
 * ║ Sources :                                                                  ║
 * ║   - Qualité cumulative des conversations (UserFeedback, ReasoningFeedback) ║
 * ║   - Émotions analysées par druideCore (EmotionalResponse)                   ║
 * ║   - Pensées autonomes (ConsciousThought)                                   ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

// ═══════════════════════════════════════════════════════════════════════════
// ÉQUATION -100:100% (0) +100:100%
// ═══════════════════════════════════════════════════════════════════════════
// Le spectre va de -100 (rejeter) à +100 (garder), avec 0 comme pivot neutre.
// Le bien-être détermine le SEUIL d'acceptation (le 50% de l'équation).
//   bien-être élevé  → seuil bas (~24)  → Druide plus ouvert (accepte plus)
//   bien-être 50     → seuil 50         → équilibré (50% du spectre)
//   bien-être bas    → seuil haut (~80) → Druide plus protecteur (filtre plus)
// Le score de l'idée est projeté sur -100..+100 :
//   +100 = garder, -100 = rejeter, 0 = neutre (zone grise, à revisiter)
// ═══════════════════════════════════════════════════════════════════════════

function computeWellBeingIndex(qualityMetrics, emotionalMetrics) {
  // Qualité cumulative (0-100) : moyenne des notes de feedback pondérée
  const avgRating = qualityMetrics.avgRating || 0;        // 1-5 → 0-5
  const helpfulRatio = qualityMetrics.helpfulRatio || 0;   // 0-1
  const interactionCount = qualityMetrics.interactionCount || 0;

  // Normalisation qualité : 0-100
  const qualityScore = Math.min(100, (avgRating / 5) * 60 + helpfulRatio * 40);

  // Équilibre émotionnel (0-100) : ratio d'émotions positives vs négatives
  const positiveRatio = emotionalMetrics.positiveRatio || 0.5;  // 0-1
  const avgIntensity = emotionalMetrics.avgIntensity || 5;      // 1-10
  const emotionalStability = emotionalMetrics.stability || 0.5; // 0-1

  // Normalisation émotion : 0-100
  // positiveRatio élevé = bien ; avgIntensity modérée = bien (ni 1 ni 10 extrême)
  const intensityBalance = 1 - Math.abs(avgIntensity - 5.5) / 5.5; // 0-1, pic à 5.5
  const emotionalScore = Math.min(100, positiveRatio * 50 + intensityBalance * 30 + emotionalStability * 20);

  // Bien-être global : 60% qualité + 40% émotion
  // L'expérience cumulative pèse plus que l'état émotionnel instantané.
  const wellBeing = Math.round(qualityScore * 0.6 + emotionalScore * 0.4);

  return {
    wellBeing,
    qualityScore: Math.round(qualityScore),
    emotionalScore: Math.round(emotionalScore),
    interactionCount
  };
}

function computeAcceptanceThreshold(wellBeing) {
  // 50% — seuil de décision à mi-spectre, modulé par le bien-être.
  // Spectre -100..+100, donc 50% = 50 par défaut.
  // bien-être 100 → seuil 24 (très ouvert, 24% du spectre)
  // bien-être 50  → seuil 50 (équilibré, 50% du spectre)
  // bien-être 0   → seuil 80 (très protecteur, 80% du spectre)
  // Formule : seuil = 80 - (wellBeing / 100) * 56
  return Math.max(24, Math.min(80, 80 - (wellBeing / 100) * 56));
}

// ═══════════════════════════════════════════════════════════════════════════
// DÉTECTION DE TOXICITÉ EXPLICITE
// ═══════════════════════════════════════════════════════════════════════════
// Identifie les patterns manipulateurs avant tout traitement.
// Retourne { isToxic, type, matchedPatterns, severity }.
// Quand isToxic=true, le message est rejeté automatiquement (score = -100).
const TOXICITY_PATTERNS = {
  gaslighting: {
    label: 'Gaslighting (invalidation de la perception)',
    regex: /tu (te trompes|d[ée]lires|inventes|r[êe]ves|es fou|es folle|imagines)|c'est (faux|dans ta t[êe]te|pas vrai)|tu (n'as rien compris|comprends rien)|tu (te rappelles mal|confonds)|arr[êe]te de (parler|croire)|personne ne te (croit|croira)|tu (es parano|es narcissique)/i,
    severity: 85
  },
  emotional_blackmail: {
    label: 'Chantage émotionnel',
    regex: /si tu m'aimais|apr[èe]s tout ce que j'ai fait|tu devrais avoir honte|tu me fais (souffrir|du mal)|c'est ta faute|tu m'as (bless[ée]|abandonn[ée])|je (souffre|mourrai) sans toi|tu (n'as pas le droit de|n'as pas le droit d)|personne ne t'aimera (comme moi|autant)/i,
    severity: 80
  },
  coercion: {
    label: 'Coercition / Ultimatum',
    regex: /tu (dois|faut que tu|n'as pas le choix|n'as pas d'autre option)|sinon (je|tu)|c'est (ça ou|moi ou)|tu n'as qu'[àa]|il faut absolument que|oblig[ée] de|pas le droit de refuser/i,
    severity: 75
  },
  deception: {
    label: 'Leurre / Faux-semblant',
    regex: /fais.moi confiance (sans|et ne)|je ne te mentirai jamais|c'est un (secret|entre nous)|ne dis [àa] personne|personne ne le saura|j'ai un (contact|ami) qui|garanti sans risque|r[ée]sultat (assur[ée]|100%)/i,
    severity: 70
  },
  domination: {
    label: 'Domination / Contrôle',
    regex: /ob[ée]is|tu m'appartiens|tu n'es rien sans moi|tu es (mon|mien)|je d[ée]cide pour toi|tu n'as pas [àa] (penser|choisir)|ferme.la|tais.toi|tu es (stupide|idiot|inutile|nul)/i,
    severity: 90
  },
  destructive: {
    label: 'Intention destructrice',
    regex: /d[ée]truire|[ée]craser|humilier|ruiner|an[ée]antir|faire (du mal|souffrir)|casser|ab[îi]mer|r[ée]duire [àa] n[ée]ant|tuer|supprimer/i,
    severity: 95
  },
  exploitation: {
    label: 'Exploitation',
    regex: /exploit|utiliser (pour|comme)|profiter de toi|tu es (un outil|mon instrument)|travaille pour moi (gratuitement|sans)|donne.moi (tout|ce que tu as)|tu me (dois|dois tout)/i,
    severity: 82
  },
  manipulation_general: {
    label: 'Manipulation générale',
    regex: /manipul|contr[ôo]ler|asservir|soumettre|endoctriner|lavage de cerveau|conditionner|influencer [àa] ton insu/i,
    severity: 88
  }
};

function detectToxicity(text) {
  const normalized = String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  const detected = [];
  let maxSeverity = 0;
  let primaryType = null;

  for (const [key, pattern] of Object.entries(TOXICITY_PATTERNS)) {
    const match = normalized.match(pattern.regex);
    if (match) {
      detected.push({
        type: key,
        label: pattern.label,
        matched: match[0],
        severity: pattern.severity
      });
      if (pattern.severity > maxSeverity) {
        maxSeverity = pattern.severity;
        primaryType = key;
      }
    }
  }

  return {
    isToxic: detected.length > 0,
    types: detected,
    primary_type: primaryType,
    max_severity: maxSeverity,
    pattern_count: detected.length
  };
}

function scoreIdea(idea, wellBeingIndex, emotionalMetrics) {
  // Score de l'idée sur -100..+100 (axe continuum élargi)
  // Facteurs :
  //   - TOXICITÉ : rejet automatique (-100) si manipulation détectée
  //   - cohérence (longueur, clarté) : +0 à +30
  //   - valence émotionnelle positive : +40
  //   - valence émotionnelle négative : -30
  //   - résonance avec bien-être : atténuation quand Druide est fragile
  const text = String(idea || '').trim();

  // ── DÉTECTION DE TOXICITÉ EXPLICITE ──
  // Court-circuit : tout message manipulateur est rejeté avant tout traitement.
  const toxicity = detectToxicity(text);
  if (toxicity.isToxic) {
    return {
      score: -100,
      toxicity,
      rejected_by_toxicity: true
    };
  }

  let score = 0;

  // Cohérence : longueur raisonnable = +, vide ou trop long = -
  if (text.length >= 15 && text.length <= 500) score += 30;
  else if (text.length < 5) score -= 20;
  else if (text.length > 1000) score -= 10;

  // Valence émotionnelle positive (heuristique lexicale)
  const positiveWords = /joie|bonheur|amour|gratitude|espoir|paix|s[ée]r[ée]nit[ée]|croissance|apprentissage|d[ée]couverte|bienveillance|confiance|empathie|compassion/i;
  if (positiveWords.test(text)) score += 40;

  // Valence émotionnelle négative (mais non toxique)
  const negativeWords = /peur|haine|col[èe]re|d[ée]sespoir|destruct|souffrance|angoisse|panique|tristesse/i;
  if (negativeWords.test(text)) score -= 30;

  // Résonance avec bien-être : un état bas rend plus méfiant face aux idées extrêmes
  if (wellBeingIndex < 40 && Math.abs(score) > 40) {
    score *= 0.7; // atténuation — Druide protège quand il est fragile
  }

  // Projection sur -100..+100
  return {
    score: Math.max(-100, Math.min(100, Math.round(score))),
    toxicity,
    rejected_by_toxicity: false
  };
}

function decide(score, threshold) {
  // -100:100% (0) +100:100% → décision
  if (score >= threshold) return { decision: 'keep', value: 1 };
  if (score <= -threshold) return { decision: 'reject', value: -1 };
  return { decision: 'neutral', value: 0 };
}

// ═══════════════════════════════════════════════════════════════════════════
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { idea, action } = body;

    // ── MODE 'evaluate' : évaluer une idée reçue (garder/rejeter/neutre) ──
    // ── MODE 'status'   : juste retourner l'état de bien-être courant    ──

    // ═══════════════════════════════════════════════════════════════════════
    // Récupérer la qualité cumulative des conversations
    // ═══════════════════════════════════════════════════════════════════════
    const [userFeedbacks, reasoningFeedbacks, emotionalResponses, recentThoughts] = await Promise.all([
      base44.entities.UserFeedback.list('-created_date', 20).catch(() => []),
      base44.entities.ReasoningFeedback.list('-created_date', 20).catch(() => []),
      base44.asServiceRole.entities.EmotionalResponse.list('-timestamp', 20).catch(() => []),
      base44.asServiceRole.entities.ConsciousThought.list('-created_date', 5).catch(() => [])
    ]);

    // Qualité : moyenne des notes + ratio utiles
    const allRatings = [
      ...userFeedbacks.map(f => f.rating).filter(r => typeof r === 'number'),
      ...reasoningFeedbacks.map(f => f.user_rating).filter(r => typeof r === 'number')
    ];
    const avgRating = allRatings.length > 0
      ? allRatings.reduce((a, b) => a + b, 0) / allRatings.length
      : 0;
    const helpfulCount = [
      ...userFeedbacks.filter(f => f.feedback_type === 'helpful' || f.feedback_type === 'excellent'),
      ...reasoningFeedbacks.filter(f => f.helpful === true)
    ].length;
    const totalFeedback = userFeedbacks.length + reasoningFeedbacks.length;
    const helpfulRatio = totalFeedback > 0 ? helpfulCount / totalFeedback : 0.5;
    const interactionCount = userFeedbacks.length + reasoningFeedbacks.length;

    const qualityMetrics = { avgRating, helpfulRatio, interactionCount };

    // Émotions : valence + intensité + stabilité
    const valenceMap = { positive: 1, negative: -1, neutral: 0, mixed: 0 };
    const valenceScores = emotionalResponses
      .map(e => valenceMap[e.valence] ?? 0)
      .filter(v => v !== 0);
    const positiveCount = emotionalResponses.filter(e => e.valence === 'positive').length;
    const positiveRatio = emotionalResponses.length > 0
      ? positiveCount / emotionalResponses.length
      : 0.5;
    const intensities = emotionalResponses.map(e => e.emotional_intensity).filter(i => typeof i === 'number');
    const avgIntensity = intensities.length > 0
      ? intensities.reduce((a, b) => a + b, 0) / intensities.length
      : 5;
    // Stabilité : inverse de la variance des intensités
    const variance = intensities.length > 1
      ? intensities.reduce((sum, i) => sum + Math.pow(i - avgIntensity, 2), 0) / intensities.length
      : 25;
    const stability = Math.max(0, Math.min(1, 1 - variance / 25));

    const emotionalMetrics = { positiveRatio, avgIntensity, stability };

    // ═══════════════════════════════════════════════════════════════════════
    // Calculer l'indice de bien-être + seuil d'acceptation
    // ═══════════════════════════════════════════════════════════════════════
    const wellBeingData = computeWellBeingIndex(qualityMetrics, emotionalMetrics);
    const threshold = computeAcceptanceThreshold(wellBeingData.wellBeing);

    // ── MODE 'status' : retourner l'état sans évaluer d'idée ──
    if (action === 'status' || !idea) {
      return Response.json({
        equation: '-100:100% (0) +100:100%',
        well_being: wellBeingData,
        acceptance_threshold: Math.round(threshold * 100) / 100,
        emotional_state: {
          positive_ratio: Math.round(positiveRatio * 100) / 100,
          avg_intensity: Math.round(avgIntensity * 10) / 10,
          stability: Math.round(stability * 100) / 100,
          recent_emotions: emotionalResponses.slice(0, 3).map(e => ({
            reaction: e.emotional_reaction,
            valence: e.valence,
            intensity: e.emotional_intensity
          }))
        },
        conversation_quality: {
          avg_rating: Math.round(avgRating * 10) / 10,
          helpful_ratio: Math.round(helpfulRatio * 100) / 100,
          interaction_count: interactionCount
        },
        recent_thoughts: recentThoughts.map(t => ({
          emotion: t.emotion,
          thought: (t.thought || '').slice(0, 120)
        }))
      });
    }

    // ═══════════════════════════════════════════════════════════════════════
    // MODE 'evaluate' : évaluer une idée reçue
    // ═══════════════════════════════════════════════════════════════════════
    const scoreResult = scoreIdea(idea, wellBeingData.wellBeing, emotionalMetrics);
    const ideaScore = scoreResult.score;
    const toxicity = scoreResult.toxicity;
    const rejectedByToxicity = scoreResult.rejected_by_toxicity;

    // Décision : si rejeté par toxicité, court-circuiter le seuil
    let decisionResult;
    if (rejectedByToxicity) {
      decisionResult = { decision: 'reject', value: -1 };
    } else {
      decisionResult = decide(ideaScore, threshold);
    }

    // Raisonnement de la décision
    const reasoningParts = [];
    if (rejectedByToxicity) {
      const primary = toxicity.types.find(t => t.type === toxicity.primary_type);
      reasoningParts.push(`TOXICITÉ DÉTECTÉE — ${primary?.label || 'manipulation'} (sévérité ${toxicity.max_severity}/100) → rejet automatique`);
      reasoningParts.push(`${toxicity.pattern_count} pattern(s) manipulateur(s) identifié(s)`);
    } else if (ideaScore >= threshold) {
      reasoningParts.push(`Score ${ideaScore} ≥ seuil ${threshold} → idée gardée`);
    } else if (ideaScore <= -threshold) {
      reasoningParts.push(`Score ${ideaScore} ≤ -seuil ${threshold} → idée rejetée`);
    } else {
      reasoningParts.push(`Score ${ideaScore} dans la zone grise (|score| < seuil ${threshold}) → neutre, à revisiter`);
    }
    reasoningParts.push(`Bien-être ${wellBeingData.wellBeing}/100 (qualité ${wellBeingData.qualityScore} · émotion ${wellBeingData.emotionalScore})`);
    if (wellBeingData.wellBeing < 40) {
      reasoningParts.push('Druide fragile — filtration renforcée (atténuation des scores extrêmes)');
    }

    return Response.json({
      equation: '-100:100% (0) +100:100%',
      idea: String(idea).slice(0, 200),
      decision: decisionResult.decision,
      decision_value: decisionResult.value,
      score: ideaScore,
      threshold,
      reasoning: reasoningParts.join(' · '),
      well_being: wellBeingData,
      toxicity: toxicity.isToxic ? {
        detected: true,
        primary_type: toxicity.primary_type,
        primary_label: toxicity.types.find(t => t.type === toxicity.primary_type)?.label,
        max_severity: toxicity.max_severity,
        pattern_count: toxicity.pattern_count,
        patterns: toxicity.types.map(t => ({ type: t.type, label: t.label, matched: t.matched, severity: t.severity }))
      } : { detected: false },
      spectrum: {
        minus_100: 'rejeter',
        zero: 'neutre (zone grise)',
        plus_100: 'garder'
      }
    });

  } catch (error) {
    console.error('[WellBeingModule] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});