/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║ KB RETRIEVAL — Recherche et composition 100% locales                 ║
 * ║ Aucun appel LLM. Utilisable quand les crédits sont épuisés.          ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

const STOPWORDS = new Set([
  'les', 'des', 'une', 'un', 'le', 'la', 'de', 'du', 'et', 'ou', 'que', 'qui',
  'quoi', 'dont', 'pour', 'par', 'avec', 'sans', 'dans', 'sur', 'sous', 'est',
  'sont', 'etre', 'avoir', 'ai', 'as', 'ce', 'cet', 'cette', 'ces', 'mon', 'ma',
  'mes', 'ton', 'ta', 'tes', 'son', 'sa', 'ses', 'nos', 'vos', 'leur', 'leurs',
  'je', 'tu', 'il', 'elle', 'on', 'nous', 'vous', 'ils', 'elles', 'me', 'te',
  'se', 'en', 'au', 'aux', 'plus', 'moins', 'tres', 'tout', 'tous', 'toute',
  'comment', 'pourquoi', 'quand', 'quel', 'quelle', 'quels', 'quelles', 'donc',
  'mais', 'car', 'si', 'ne', 'pas', 'y', 'a', 'il', 'faut', 'peux', 'peut',
  'dis', 'dire', 'sais', 'savoir', 'veux', 'vouloir', 'fait', 'faire'
]);

export function normalize(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function tokenize(text) {
  const words = normalize(text).split(/[^a-z0-9]+/);
  const out = new Set();
  for (const w of words) {
    if (w.length < 3) continue;
    if (STOPWORDS.has(w)) continue;
    out.add(w);
    // radical grossier : permet "prix/prixs", "cout/couts", "memoire/memoires"
    if (w.length > 4 && w.endsWith('s')) out.add(w.slice(0, -1));
  }
  return out;
}

function fieldTokens(kb) {
  return {
    title: tokenize(kb.title),
    tags: tokenize((kb.tags || []).join(' ')),
    facts: tokenize((kb.extracted_facts || []).join(' ')),
    summary: tokenize(kb.summary),
    content: tokenize((kb.content || '').slice(0, 1200))
  };
}

function overlap(queryTokens, tokenSet) {
  let n = 0;
  for (const t of queryTokens) if (tokenSet.has(t)) n++;
  return n;
}

/**
 * Classe les fiches par pertinence lexicale vis-à-vis de la question.
 * Retourne [{ kb, score, matched }] trié décroissant, score > 0 uniquement.
 */
export function rankKnowledge(query, knowledgeBases, limit = 6) {
  const q = tokenize(query);
  if (q.size === 0) return [];

  const scored = [];
  for (const kb of knowledgeBases) {
    const f = fieldTokens(kb);
    const raw =
      overlap(q, f.title) * 3 +
      overlap(q, f.tags) * 3 +
      overlap(q, f.facts) * 2 +
      overlap(q, f.summary) * 2 +
      overlap(q, f.content) * 1;
    if (raw === 0) continue;
    const matched = new Set();
    for (const t of q) {
      if (f.title.has(t) || f.tags.has(t) || f.facts.has(t) || f.summary.has(t) || f.content.has(t)) {
        matched.add(t);
      }
    }
    // couverture de la question : évite qu'une fiche longue gagne par volume
    const coverage = matched.size / q.size;
    scored.push({ kb, score: raw * (0.5 + coverage), coverage, matched: [...matched] });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}

/**
 * Compose une réponse déterministe à partir des fiches retenues.
 * Aucun LLM : assemblage des résumés et faits clés, avec attribution.
 */
export function composeLocalAnswer(query, ranked) {
  if (ranked.length === 0) {
    return {
      found: false,
      answer: "Aucune fiche de ma base ne recoupe cette question. Je peux répondre si tu précises le domaine, ou si tu ajoutes une fiche sur ce sujet.",
      confidence: 0,
      sources: [],
      facts: []
    };
  }

  const top = ranked[0];
  // On ne retient comme fiches d'appui que celles dont la pertinence est
  // comparable à la meilleure — sinon des fiches faiblement liées polluent
  // les points clés et les rapprochements.
  const strong = ranked.filter((r) => r.score >= top.score * 0.6).slice(0, 3);
  const others = strong.slice(1, 3);

  const parts = [];
  parts.push(top.kb.summary || (top.kb.content || '').slice(0, 400));

  const facts = [];
  for (const r of strong) {
    for (const f of (r.kb.extracted_facts || []).slice(0, 3)) {
      if (!facts.includes(f)) facts.push(f);
    }
  }
  if (facts.length > 0) {
    parts.push('Points clés : ' + facts.slice(0, 5).map((f) => f.replace(/\.$/, '')).join(' · ') + '.');
  }

  if (others.length > 0) {
    parts.push(
      'À rapprocher de ' + others.map((r) => `« ${r.kb.title} »`).join(' et ') + '.'
    );
  }

  // confiance : couverture de la question × densité des fiches trouvées
  const confidence = Math.min(
    92,
    Math.round(top.coverage * 70 + Math.min(ranked.length, 4) * 5)
  );

  return {
    found: true,
    answer: parts.join('\n\n'),
    confidence,
    sources: ranked.map((r) => ({ id: r.kb.id, title: r.kb.title, score: Math.round(r.score) })),
    facts: facts.slice(0, 8)
  };
}