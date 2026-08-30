/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║ ENRICH KNOWLEDGE BASE — fiches sourcées par recherche web            ║
 * ║ Passe par OpenRouter (clé propre), hors crédits d'intégration.       ║
 * ║ Refuse d'écrire une fiche sans source citée ou déjà présente.        ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { researchFiche, toKnowledgeBaseRecord } from '../../shared/webResearch.js';

const DEFAULT_TOPICS = [
  'méthode de vérification des sources en recherche documentaire',
  'raisonnement clinique: démarche du diagnostic différentiel',
  'biais cognitifs les plus documentés et comment les contrer',
  'principes de la protection des renseignements personnels au Québec'
];

function normalizeTitle(t) {
  return (t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const topics = Array.isArray(body.topics) && body.topics.length ? body.topics : DEFAULT_TOPICS;
    const model = body.model;
    const maxResults = body.max_results ?? 5;
    const extraTags = Array.isArray(body.tags) ? body.tags : [];

    // Titres déjà présents — évite les doublons sans dépendre du LLM
    const existing = await base44.entities.KnowledgeBase.filter({ active: true }, '-created_date', 500);
    const existingTitles = new Set(existing.map((k) => normalizeTitle(k.title)));

    const created = [];
    const rejected = [];
    let totalCost = 0;

    for (const topic of topics.slice(0, 10)) {
      try {
        const result = await researchFiche(topic, { model, max_results: maxResults });
        totalCost += result.usage?.cost || 0;

        if (!result.valid) {
          rejected.push({ topic, reason: 'sources insuffisantes ou fiche incomplète' });
          continue;
        }
        if (existingTitles.has(normalizeTitle(result.fiche.title))) {
          rejected.push({ topic, reason: `doublon: ${result.fiche.title}` });
          continue;
        }

        const record = toKnowledgeBaseRecord(result, extraTags);
        await base44.entities.KnowledgeBase.create(record);
        existingTitles.add(normalizeTitle(record.title));
        created.push({
          title: record.title,
          source_url: record.source_url,
          facts: record.extracted_facts.length,
          citations: result.citations.length
        });
      } catch (e) {
        rejected.push({ topic, reason: String(e?.message || e).slice(0, 150) });
      }
    }

    return Response.json({
      created: created.length,
      fiches: created,
      rejected,
      cost_usd: Number(totalCost.toFixed(5)),
      provider: 'openrouter_web',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[enrichKnowledgeBase]', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}