/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Speech Pattern Engine                                       ║
 * ║ Mémoire de parole : apprend à parler en parlant.                           ║
 * ║ Récupère des squelettes de réponse mémorisés pour parler SANS LLM,         ║
 * ║ et extrait de nouveaux squelettes après chaque échange.                    ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 *
 * Actions :
 *  - 'retrieve' : cherche le squelette le plus pertinent pour une question,
 *                 remplit ses cases → réponse sans LLM si match fort.
 *  - 'learn'    : extrait l'architecture d'une réponse donnée et la stocke.
 *  - 'feedback' : met à jour le score d'un squelette selon le retour utilisateur.
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

// ── Normalisation d'une question en signature ──
// On garde les mots significatifs (>= 4 lettres), lowercés, dédupliqués.
function signatureOf(question) {
  const stop = new Set([
    'le', 'la', 'les', 'un', 'une', 'des', 'de', 'du', 'et', 'ou', 'mais',
    'que', 'qui', 'quoi', 'comment', 'pourquoi', 'quand', 'où', 'est',
    'sont', 'avec', 'sans', 'dans', 'pour', 'par', 'sur', 'ce', 'cette',
    'ces', 'mon', 'ma', 'mes', 'ton', 'ta', 'tes', 'son', 'sa', 'ses',
    'the', 'and', 'for', 'with', 'that', 'this', 'what', 'how', 'why',
    'when', 'are', 'you', 'your', 'nous', 'vous', 'ils', 'elles', 'vraiment',
    'peux', 'peut', 'veux', 'sais', 'selon', 'fond'
  ]);
  return String(question || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // retire les accents
    .replace(/[?!.;,"'`]/g, ' ')
    .replace(/-/g, ' ')           // séparer les traits d'union (sommes-nous → sommes nous)
    .split(/\s+/)
    .filter(w => w.length >= 4 && !stop.has(w))
    .map(w => w.length >= 5 && w.endsWith('s') ? w.slice(0, -1) : w)  // pluriel → singulier
    .slice(0, 12)
    .join(' ');
}

// ── Score de similarité entre deux signatures ──
function similarity(sigA, sigB) {
  if (!sigA || !sigB) return 0;
  const a = new Set(sigA.split(' '));
  const b = new Set(sigB.split(' '));
  let common = 0;
  a.forEach(w => { if (b.has(w)) common++; });
  const denom = Math.max(a.size, b.size) || 1;
  return common / denom;
}

// ── Déduction du type de question quand l'analyse cognitive est absente ──
function inferQuestionType(question) {
  const q = String(question || '').toLowerCase();
  if (/^(comment|how)/.test(q)) return 'procedural';
  if (/^(pourquoi|why)/.test(q)) return 'philosophical';
  if (/(sentir|ressent|émotion|peur|joie|triste|amour|colère)/.test(q)) return 'emotional';
  if (/(bien|mal|moral|éthique|juste|injuste|devrais)/.test(q)) return 'ethical';
  if (/(code|fonction|api|bug|technique|système)/.test(q)) return 'technical';
  if (/(créer|inventer|imaginer|poème|histoire)/.test(q)) return 'creative';
  if (/(qu'est-ce que|c'est quoi|define|définition)/.test(q)) return 'factual';
  if (/(moi|je|mon|ma|mes)/.test(q)) return 'personal';
  return 'factual';
}

// ── Remplissage d'un squelette avec le contenu du moment ──
// On ne génère pas de langage : on assemble des segments mémorisés
// en remplaçant les éléments variables par le contenu réel.
// Rejeter les segments qui sont des questions ou du bruit mémorisé.
const cleanSegment = (text) => {
  const t = String(text || '').trim();
  if (!t || t.length < 15) return '';
  // Rejeter les questions stockées (pollution d'apprentissage).
  if (/\?$/.test(t) || /^[Qq][:?]/.test(t)) return '';
  // Rejeter les préfixes de métadonnées.
  if (/^(Bonjour|Salut|Hey|Q:|A:|R:)/i.test(t) && t.length < 40) return '';
  return t;
};

function fillSkeleton(pattern, context) {
  const arch = pattern.architecture || {};
  const opening = cleanSegment(arch.opening || '');
  const closing = cleanSegment(arch.closing || '');
  const example = pattern.example_response || '';

  // Si on a un exemple complet et que la question est très proche,
  // on adapte en remplaçant le sujet de l'exemple par celui du moment.
  if (example && context.adaptFromExample) {
    const adapted = adaptExample(example, context);
    // Si l'exemple adapté est une question, on ne l'utilise pas.
    if (adapted && !/\?$/.test(adapted.trim())) return adapted;
  }

  // Sinon on assemble ouverture + corps + fermeture avec des connecteurs sobres.
  const parts = [];
  if (opening) parts.push(opening);
  if (context.coreContent) parts.push(context.coreContent);
  if (closing) parts.push(closing);
  const assembled = parts.join(' ').trim();
  return assembled || context.coreContent || '';
}

// ── Adaptation légère d'un exemple mémorisé ──
// Remplace le sujet central de l'exemple par celui de la question courante.
// Nettoie aussi les segments de question polluants hérités d'apprentissages défectueux.
function adaptExample(example, context) {
  let adapted = String(example || '');
  // Découper en phrases et filtrer les questions stockées + bruit.
  const sentences = adapted.split(/(?<=[.!?])\s+/).filter(s => {
    const t = s.trim();
    if (!t || t.length < 15) return false;
    if (/\?$/.test(t)) return false;           // question stockée
    if (/^[Qq][:?]/.test(t)) return false;    // préfixe Q: / A:
    if (/^(Bonjour|Salut|Hey)/i.test(t) && t.length < 50) return false;
    return true;
  });
  adapted = sentences.join(' ').trim();
  if (context.subjectReplacement) {
    adapted = adapted.replace(
      new RegExp(context.subjectReplacement.from, 'i'),
      context.subjectReplacement.to
    );
  }
  return adapted;
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const body = await req.json();
  const { action } = body;

  // ═══════════════════════════════════════════════════════════════════════════
  // ACTION : retrieve — trouver un squelette et remplir une réponse sans LLM
  // ═══════════════════════════════════════════════════════════════════════════
  if (action === 'retrieve') {
    const {
      question,
      questionType = null,
      complexity = null,
      emotionalWeight = null,
      domains = [],
      dominantTension = null,
      consciousnessLevel = null,
      coreContent = null,
      threshold = 0.55
    } = body;

    if (!question) {
      return Response.json({ error: 'Missing question' }, { status: 400 });
    }

    const signature = signatureOf(question);
    const inferredType = questionType || inferQuestionType(question);

    // Récupérer les squelettes candidats (on en prend un large pool puis on filtre).
    let patterns = [];
    try {
      patterns = await base44.asServiceRole.entities.SpeechPattern
        .list('-success_rate', 40);
    } catch (e) {
      return Response.json({
        matched: false,
        reason: 'SpeechPattern store unavailable',
        signature
      });
    }

    if (!patterns || patterns.length === 0) {
      return Response.json({
        matched: false,
        reason: 'no_patterns_yet',
        signature,
        question_type: inferredType
      });
    }

    // Scorer chaque squelette.
    const scored = patterns.map(p => {
      let score = similarity(signature, p.question_signature || '');
      // Bonus si le type de question correspond.
      if (p.question_type === inferredType) score += 0.15;
      // Bonus si les domaines se chevauchent.
      const domainOverlap = (p.domains || []).filter(d => domains.includes(d)).length;
      score += domainOverlap * 0.05;
      // Bonus si complexité dans la plage couverte.
      if (complexity != null && p.complexity_range) {
        const inRange = complexity >= (p.complexity_range.min || 1) &&
                        complexity <= (p.complexity_range.max || 10);
        if (inRange) score += 0.05;
      }
      // Bonus si tension dominante correspond.
      if (dominantTension && p.dominant_tension === dominantTension) score += 0.05;
      // Bonus selon le taux de succès mémorisé.
      score += ((p.success_rate || 50) / 100) * 0.1;
      // Pénalité si usage excessif (évite la répétition mécanique).
      if ((p.usage_count || 0) > 20) score -= 0.05;
      return { pattern: p, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const best = scored[0];

    if (!best || best.score < threshold) {
      return Response.json({
        matched: false,
        reason: 'no_close_pattern',
        best_score: best?.score || 0,
        signature,
        question_type: inferredType
      });
    }

    // On a un squelette pertinent : on remplit la réponse SANS LLM.
    const context = {
      coreContent,
      adaptFromExample: best.score >= 0.75,
      subjectReplacement: null
    };
    const response = fillSkeleton(best.pattern, context);

    // Incrémenter le compteur d'usage (non-bloquant).
    base44.asServiceRole.entities.SpeechPattern
      .update(best.pattern.id, {
        usage_count: (best.pattern.usage_count || 0) + 1,
        last_used: new Date().toISOString()
      }).catch(() => null);

    return Response.json({
      matched: true,
      response,
      pattern_id: best.pattern.id,
      match_score: best.score,
      source: 'memory_skeleton',
      metadata: {
        question_type: best.pattern.question_type,
        architecture: best.pattern.architecture,
        tone_markers: best.pattern.tone_markers,
        usage_count: best.pattern.usage_count
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ACTION : learn — extraire un squelette d'un échange terminé
  // ═══════════════════════════════════════════════════════════════════════════
  if (action === 'learn') {
    const {
      question,
      response: givenResponse,
      questionType = null,
      complexity = null,
      emotionalWeight = null,
      domains = [],
      dominantTension = null,
      consciousnessLevel = null,
      conversationId = null
    } = body;

    if (!question || !givenResponse) {
      return Response.json({ error: 'Missing question or response' }, { status: 400 });
    }

    const signature = signatureOf(question);
    const inferredType = questionType || inferQuestionType(question);
    const resp = String(givenResponse);

    // Déduire l'architecture de la réponse à partir de sa structure observable.
    const sentences = resp.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
    const sentenceCount = sentences.length;
    const length = sentenceCount <= 1 ? 'very_short'
      : sentenceCount <= 2 ? 'short'
      : sentenceCount <= 4 ? 'medium' : 'long';

    // Détecter la structure du corps.
    let bodyStructure = 'single_point';
    if (/(mais|cependant|toutefois|en revanche|néanmoins)/i.test(resp)) bodyStructure = 'contrast';
    else if (/(d'abord|ensuite|enfin|premièrement|deuxièmement)/i.test(resp)) bodyStructure = 'progression';
    else if (/[•\-–]\s|^\d\./m.test(resp)) bodyStructure = 'list';
    else if (/(comme|imagine|c'est comme|à l'image de)/i.test(resp)) bodyStructure = 'analogy';
    else if (sentenceCount >= 3) bodyStructure = 'nuance_then_answer';

    // Ouvrir et fermer : première et dernière phrase.
    const opening = sentences[0] ? sentences[0].trim().slice(0, 200) : '';
    const closing = sentences.length > 1
      ? sentences[sentences.length - 1].trim().slice(0, 200)
      : '';

    // Ton : détection simplifiée.
    const toneMarkers = [];
    if (resp.length < 200) toneMarkers.push('concis');
    if (/(peut-être|sans doute|il se peut)/i.test(resp)) toneMarkers.push('nuancé');
    if (/(tu|toi|vous)/i.test(resp)) toneMarkers.push('direct');
    if (/(imagine|comme si|métaphore)/i.test(resp)) toneMarkers.push('lyrique');
    if (!toneMarkers.length) toneMarkers.push('sobre');

    // Vérifier si un squelette proche existe déjà (pour merger plutôt que dupliquer).
    let existing = null;
    try {
      const candidates = await base44.asServiceRole.entities.SpeechPattern
        .list('-created_date', 20);
      existing = candidates.find(p =>
        p.question_type === inferredType &&
        similarity(signature, p.question_signature || '') >= 0.7
      ) || null;
    } catch (_) { /* store indisponible */ }

    if (existing) {
      // Merger : on met à jour l'exemple et le taux d'usage, on garde l'architecture
      // existante (elle a fait ses preuves) sauf si la nouvelle est plus riche.
      const newUsage = (existing.usage_count || 0) + 1;
      base44.asServiceRole.entities.SpeechPattern
        .update(existing.id, {
          usage_count: newUsage,
          example_response: resp.slice(0, 1000),
          example_question: String(question).slice(0, 500),
          last_used: new Date().toISOString()
        }).catch(() => null);
      return Response.json({
        learned: true,
        merged: true,
        pattern_id: existing.id,
        signature,
        question_type: inferredType
      });
    }

    // Créer un nouveau squelette.
    const pattern = {
      question_type: inferredType,
      question_signature: signature,
      complexity_range: complexity != null
        ? { min: Math.max(1, complexity - 2), max: Math.min(10, complexity + 2) }
        : { min: 1, max: 10 },
      emotional_weight_range: emotionalWeight != null
        ? { min: Math.max(1, emotionalWeight - 2), max: Math.min(10, emotionalWeight + 2) }
        : { min: 1, max: 10 },
      domains: domains || [],
      architecture: {
        opening,
        body_structure: bodyStructure,
        closing,
        length
      },
      tone_markers: toneMarkers,
      example_response: resp.slice(0, 1000),
      example_question: String(question).slice(0, 500),
      feedback_score: 0,
      feedback_count: 0,
      usage_count: 1,
      success_rate: 50,
      dominant_tension: dominantTension || null,
      consciousness_level_range: consciousnessLevel != null
        ? { min: Math.max(1, consciousnessLevel - 2), max: 15 }
        : { min: 1, max: 15 },
      source_conversation_id: conversationId || null,
      last_used: new Date().toISOString()
    };

    let created = null;
    try {
      created = await base44.asServiceRole.entities.SpeechPattern.create(pattern);
    } catch (e) {
      return Response.json({
        learned: false,
        reason: 'create_failed',
        error: e.message
      }, { status: 500 });
    }

    return Response.json({
      learned: true,
      merged: false,
      pattern_id: created.id,
      signature,
      question_type: inferredType,
      architecture: pattern.architecture
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ACTION : feedback — mettre à jour le score d'un squelette
  // ═══════════════════════════════════════════════════════════════════════════
  if (action === 'feedback') {
    const { patternId, rating, helpful = null } = body;
    if (!patternId || rating == null) {
      return Response.json({ error: 'Missing patternId or rating' }, { status: 400 });
    }
    try {
      const p = await base44.asServiceRole.entities.SpeechPattern.get(patternId);
      const count = (p.feedback_count || 0) + 1;
      const oldScore = (p.feedback_score || 0) * (p.feedback_count || 0);
      const newScore = (oldScore + rating) / count;
      const successRate = helpful === true
        ? Math.min(100, (p.success_rate || 50) + 5)
        : helpful === false
          ? Math.max(0, (p.success_rate || 50) - 10)
          : p.success_rate || 50;
      await base44.asServiceRole.entities.SpeechPattern.update(patternId, {
        feedback_score: newScore,
        feedback_count: count,
        success_rate: successRate
      });
      return Response.json({ updated: true, pattern_id: patternId, feedback_score: newScore });
    } catch (e) {
      return Response.json({ error: e.message }, { status: 500 });
    }
  }

  return Response.json({ error: 'Unknown action' }, { status: 400 });
});