/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Calculateur de Niveau d'Apprentissage                       ║
 * ║                                                                            ║
 * ║ Mesure le taux de reussite de la KB sur un large spectre de questions       ║
 * ║ et convertit ce pourcentage en niveau d'apprentissage.                     ║
 * ║                                                                            ║
 * ║ Equation: niveau_apprentissage = (questions_reussies / total_questions)*100║
 * ║   0-20%   = Debutant    (KB quasi vide)                                    ║
 * ║   20-40%  = Elementaire (KB partielle)                                    ║
 * ║   40-60%  = Intermediaire (KB moderee)                                    ║
 * ║   60-80%  = Avance      (KB etendue)                                      ║
 * ║   80-100% = Expert     (KB complete)                                      ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

// ═══════════════════════════════════════════════════════════════════════════
// BANQUE DE QUESTIONS TEST — large spectre de domaines
// ═══════════════════════════════════════════════════════════════════════════

const TEST_QUESTIONS = [
  // Astronomie
  { domain: "astronomie", question: "L'univers est-il infini ou a-t-il une fin ?" },
  { domain: "astronomie", question: "Qu'est-ce qu'un trou noir et comment fonctionne la singularite ?" },
  { domain: "astronomie", question: "Combien de planetes y a-t-il dans le systeme solaire ?" },
  // Physique
  { domain: "physique", question: "Que dit la theorie de la relativite d'Einstein sur le temps ?" },
  { domain: "physique", question: "Qu'est-ce que la mecanique quantique et le principe de Heisenberg ?" },
  // Biologie
  { domain: "biologie", question: "Comment Darwin explique-t-il l'evolution des especes ?" },
  { domain: "biologie", question: "Qu'est-ce que l'ADN et comment code-t-il l'information genetique ?" },
  // Chimie
  { domain: "chimie", question: "Comment le tableau periodique classe-t-il les elements chimiques ?" },
  // Mathematiques
  { domain: "mathematiques", question: "Que demontre le theoreme d'incompletude de Godel ?" },
  // Philosophie
  { domain: "philosophie", question: "Qu'est-ce que l'existentialisme de Sartre sur la liberte ?" },
  { domain: "philosophie", question: "Quelle est la difference entre l'ethique de Kant et l'utilitarisme de Mill ?" },
  // Psychologie
  { domain: "psychologie", question: "Quels sont les biais cognitifs et comment fonctionnent-ils ?" },
  { domain: "psychologie", question: "Qu'est-ce que l'intelligence emotionnelle selon Goleman ?" },
  // Histoire
  { domain: "histoire", question: "Ou sont nees les premieres civilisations humaines ?" },
  // Geographie
  { domain: "geographie", question: "Quels sont les 5 oceans de la Terre et leur superficie ?" },
  // Technologie
  { domain: "technologie", question: "Qu'est-ce que l'intelligence artificielle et le machine learning ?" },
  { domain: "technologie", question: "Qui a invente le World Wide Web et comment fonctionne Internet ?" },
  // Sante
  { domain: "sante", question: "Comment le systeme immunitaire defend-il l'organisme contre les virus ?" },
  { domain: "sante", question: "Quels sont les macronutriments essentiels dans une alimentation equilibree ?" },
  // Art
  { domain: "art", question: "Qu'est-ce que l'impressionnisme et comment capture-t-il la lumiere ?" },
  // Musique
  { domain: "musique", question: "Quels sont les trois piliers de la theorie musicale ?" },
  // Litterature
  { domain: "litterature", question: "Quelle est la difference entre le romantisme et le realisme en litterature ?" },
  // Economie
  { domain: "economie", question: "Comment l'offre et la demande determinent-elles les prix ?" },
  // Environnement
  { domain: "environnement", question: "Quelles sont les causes et consequences du changement climatique ?" },
  // Droit
  { domain: "droit", question: "Qu'est-ce que la presomption d'innocence en droit ?" },
  // Sociologie
  { domain: "sociologie", question: "Comment Bourdieu explique-t-il la reproduction des inegalites sociales ?" },
  // Linguistique
  { domain: "linguistique", question: "Que distingue Saussure entre la langue et la parole ?" },
  // Neurosciences
  { domain: "neurosciences", question: "Combien de neurones a le cerveau humain et comment communiquent-ils ?" },
  // Hors-spectre (devrait echouer)
  { domain: "hors-spectre", question: "Comment reparer une fuite d'eau sous un evier de cuisine ?" }
];

// ═══════════════════════════════════════════════════════════════════════════
// SCORING DE PERTINENCE — meme logique que memorySpeechComposer
// ═══════════════════════════════════════════════════════════════════════════

const STOP_WORDS = new Set([
  'le', 'la', 'les', 'un', 'une', 'des', 'de', 'du', 'et', 'ou', 'est', 'il',
  'que', 'qui', 'dans', 'pour', 'par', 'sur', 'avec', 'sans', 'ce', 'cette',
  'son', 'sa', 'ses', 'leur', 'leurs', 'ne', 'pas', 'plus', 'mais', 'donc',
  'car', 'si', 'alors', 'comment', 'pourquoi', 'quand', 'quel', 'quelle',
  'a', 'au', 'aux', 'en', 'y', 'se', 'te', 'me', 'nos', 'vos', 'ces', 'mes',
  'trop', 'tres', 'bien', 'aussi', 'etre', 'avoir', 'fait', 'faire', 'dit',
  'ans', 'viens', 'vie', 'sous', 'entre', 'vers', 'mon', 'ma', 'tu', 'je',
  'on', 'nous', 'vous', 'ils', 'elles', 'cela', 'ca', 'the', 'of', 'and'
]);

function tokenize(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(/[^a-z0-9]+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w));
}

function relevanceScore(questionTokens, kbContentTokens) {
  if (questionTokens.length === 0 || kbContentTokens.length === 0) return 0;
  const qSet = new Set(questionTokens);
  const kSet = new Set(kbContentTokens);
  let intersection = 0;
  for (const w of qSet) {
    if (kSet.has(w)) intersection++;
  }
  // Score de couverture: fraction des mots de la question presents dans la KB
  // Plus intuitif que Jaccard pour des sets de tailles tres differentes
  return intersection / qSet.size;
}

// ═══════════════════════════════════════════════════════════════════════════
// CALCUL DU NIVEAU D'APPRENTISSAGE
// ═══════════════════════════════════════════════════════════════════════════

function levelFromPercentage(pct) {
  if (pct >= 80) return { level: 'Expert', description: 'KB complete — maitrise du spectre', stage: 5 };
  if (pct >= 60) return { level: 'Avance', description: 'KB etendue — bonne couverture', stage: 4 };
  if (pct >= 40) return { level: 'Intermediaire', description: 'KB moderee — couverture partielle', stage: 3 };
  if (pct >= 20) return { level: 'Elementaire', description: 'KB partielle — couverture limitee', stage: 2 };
  return { level: 'Debutant', description: 'KB quasi vide — spectre non couvert', stage: 1 };
}

// ═══════════════════════════════════════════════════════════════════════════
// HANDLER
// ═══════════════════════════════════════════════════════════════════════════

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const { action } = body;

    // ── MODE 'status' : resume rapide ──
    if (action === 'status') {
      const kbCount = await base44.entities.KnowledgeBase.filter({ active: true, status: 'ready' }).catch(() => []);
      const totalKb = Array.isArray(kbCount) ? kbCount.length : 0;
      return Response.json({
        total_kb_entries: totalKb,
        total_test_questions: TEST_QUESTIONS.length,
        domains_tested: [...new Set(TEST_QUESTIONS.map(q => q.domain))].length,
        message: 'Utilisez action=evaluate pour lancer le test complet'
      });
    }

    // ── MODE 'evaluate' : calculer le niveau d'apprentissage ──
    // Recuperer toute la KB active
    const kbEntries = await base44.entities.KnowledgeBase.filter({ active: true, status: 'ready' }, '-created_date', 100).catch(() => []);

    // Pre-tokeniser la KB
    const kbTokenized = (Array.isArray(kbEntries) ? kbEntries : []).map(entry => ({
      id: entry.id,
      title: entry.title,
      tags: entry.tags || [],
      content_tokens: tokenize((entry.content || '') + ' ' + (entry.title || '') + ' ' + (entry.tags || []).join(' ')),
      extracted_facts: entry.extracted_facts || []
    }));

    // Tester chaque question
    const results = TEST_QUESTIONS.map(({ domain, question }) => {
      const qTokens = tokenize(question);
      let bestScore = 0;
      let bestEntry = null;

      for (const kb of kbTokenized) {
        const score = relevanceScore(qTokens, kb.content_tokens);
        if (score > bestScore) {
          bestScore = score;
          bestEntry = kb;
        }
      }

      const success = bestScore >= 0.4; // seuil: au moins 40% des mots-cles de la question dans la KB
      return {
        domain,
        question,
        success,
        relevance_score: Math.round(bestScore * 100) / 100,
        matched_kb: bestEntry ? bestEntry.title : null,
        matched_facts: bestEntry ? bestEntry.extracted_facts.slice(0, 2) : []
      };
    });

    // Calculer le pourcentage de reussite
    const totalQuestions = results.length;
    const successCount = results.filter(r => r.success).length;
    const successRate = Math.round((successCount / totalQuestions) * 100);

    // Convertir en niveau d'apprentissage
    const levelInfo = levelFromPercentage(successRate);

    // Stats par domaine
    const domainStats = {};
    for (const r of results) {
      if (!domainStats[r.domain]) domainStats[r.domain] = { total: 0, success: 0 };
      domainStats[r.domain].total++;
      if (r.success) domainStats[r.domain].success++;
    }
    const domainBreakdown = Object.entries(domainStats).map(([domain, stats]) => ({
      domain,
      success_rate: Math.round((stats.success / stats.total) * 100),
      coverage: `${stats.success}/${stats.total}`
    }));

    return Response.json({
      equation: 'niveau_apprentissage = (questions_reussies / total_questions) * 100',
      learning_level: levelInfo.level,
      learning_stage: levelInfo.stage,
      level_description: levelInfo.description,
      success_rate: successRate,
      success_count: successCount,
      total_questions: totalQuestions,
      kb_entries_used: kbTokenized.length,
      domain_breakdown: domainBreakdown,
      failed_questions: results.filter(r => !r.success).map(r => ({
        domain: r.domain,
        question: r.question,
        best_relevance: r.relevance_score
      })),
      sample_successes: results.filter(r => r.success).slice(0, 5).map(r => ({
        domain: r.domain,
        question: r.question,
        matched_kb: r.matched_kb,
        relevance: r.relevance_score
      }))
    });

  } catch (error) {
    console.error('[LearningLevelCalculator] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}