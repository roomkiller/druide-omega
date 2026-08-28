/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Module de Bien-Être                                        ║
 * ║ Régule ce que Druide garde ou rejette comme information reçue.             ║
 * ║                                                                            ║
 * ║ Équation régulatrice : 1:1 %(0) %-1:1                                      ║
 * ║   1:1   = équilibre de base (accepter:rejeter pondérés également)           ║
 * ║   %(0)  = point de vide neutre — le pivot où rien n'est tranché             ║
 * ║   %-1:1 = spectre de décision : -1 (rejeter) ↔ 0 (neutre) ↔ +1 (garder)     ║
 * ║                                                                            ║
 * ║ Sources :                                                                  ║
 * ║   - Qualité cumulative des conversations (UserFeedback, ReasoningFeedback) ║
 * ║   - Émotions analysées par druideCore (EmotionalResponse)                   ║
 * ║   - Pensées autonomes (ConsciousThought)                                   ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

// ═══════════════════════════════════════════════════════════════════════════
// ÉQUATION 1:1 %(0) %-1:1
// ═══════════════════════════════════════════════════════════════════════════
// Le bien-être détermine le SEUIL d'acceptation (le %(0) de l'équation).
//   bien-être élevé  → seuil bas  → Druide plus ouvert (accepte plus)
//   bien-être bas    → seuil haut → Druide plus protecteur (filtre plus)
// Le score de l'idée est projeté sur %-1:1 :
//   +1 = garder, -1 = rejeter, 0 = neutre (zone grise, à revisiter)
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
  // %(0) — le point de vide neutre.
  // bien-être 100 → seuil 0.15 (très ouvert)
  // bien-être 50  → seuil 0.40 (équilibré)
  // bien-être 0   → seuil 0.70 (très protecteur)
  // Formule : seuil = 0.70 - (wellBeing / 100) * 0.55
  return Math.max(0.15, Math.min(0.70, 0.70 - (wellBeing / 100) * 0.55));
}

function scoreIdea(idea, wellBeingIndex, emotionalMetrics) {
  // Score de l'idée sur %-1:1
  // Facteurs :
  //   - cohérence (longueur, clarté) : +0.0 à +0.3
  //   - valence émotionnelle : positive = +, négative = -
  //   - résonance avec bien-être : une idée positive dans un état bas = légèrement -
  //     (Druide protège), une idée neutre dans un état haut = + (Druide ouvert)
  const text = String(idea || '').trim();
  let score = 0;

  // Cohérence : longueur raisonnable = +, vide ou trop long = -
  if (text.length >= 15 && text.length <= 500) score += 0.25;
  else if (text.length < 5) score -= 0.2;
  else if (text.length > 1000) score -= 0.1;

  // Valence émotionnelle (heuristique lexicale)
  const positiveWords = /joie|bonheur|amour|gratitude|espoir|paix|s[ée]r[ée]nit[ée]|croissance|apprentissage|d[ée]couverte|bienveillance|confiance/i;
  const negativeWords = /peur|haine|col[èe]re|d[ée]sespoir|destruct|toxique|manipul|mensonge|trahison|souffrance|angoisse|panique/i;
  if (positiveWords.test(text)) score += 0.3;
  if (negativeWords.test(text)) score -= 0.3;

  // Résonance avec bien-être : un état bas rend plus méfiant face aux idées fortes
  if (wellBeingIndex < 40 && Math.abs(score) > 0.4) {
    score *= 0.7; // atténuation — Druide protège quand il est fragile
  }

  // Projection sur -1..+1
  return Math.max(-1, Math.min(1, score));
}

function decide(score, threshold) {
  // %-1:1 → décision
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
        equation: '1:1 %(0) %-1:1',
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
    const ideaScore = scoreIdea(idea, wellBeingData.wellBeing, emotionalMetrics);
    const decisionResult = decide(ideaScore, threshold);

    // Raisonnement de la décision
    const reasoningParts = [];
    if (ideaScore >= threshold) {
      reasoningParts.push(`Score ${Math.round(ideaScore * 100) / 100} ≥ seuil ${Math.round(threshold * 100) / 100} → idée gardée`);
    } else if (ideaScore <= -threshold) {
      reasoningParts.push(`Score ${Math.round(ideaScore * 100) / 100} ≤ -seuil ${Math.round(threshold * 100) / 100} → idée rejetée`);
    } else {
      reasoningParts.push(`Score ${Math.round(ideaScore * 100) / 100} dans la zone grise (|score| < seuil ${Math.round(threshold * 100) / 100}) → neutre, à revisiter`);
    }
    reasoningParts.push(`Bien-être ${wellBeingData.wellBeing}/100 (qualité ${wellBeingData.qualityScore} · émotion ${wellBeingData.emotionalScore})`);
    if (wellBeingData.wellBeing < 40) {
      reasoningParts.push('Druide fragile — filtration renforcée (atténuation des scores extrêmes)');
    }

    return Response.json({
      equation: '1:1 %(0) %-1:1',
      idea: String(idea).slice(0, 200),
      decision: decisionResult.decision,
      decision_value: decisionResult.value,
      score: Math.round(ideaScore * 100) / 100,
      threshold: Math.round(threshold * 100) / 100,
      reasoning: reasoningParts.join(' · '),
      well_being: wellBeingData,
      spectrum: {
        minus_one: 'rejeter',
        zero: 'neutre (zone grise)',
        plus_one: 'garder'
      }
    });

  } catch (error) {
    console.error('[WellBeingModule] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});